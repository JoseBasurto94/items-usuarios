using ItemsTrabajo.Api.Dtos;
using ItemsTrabajo.Api.Interfaces;
using ItemsTrabajo.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ItemsTrabajo.Api.Services
{
    public class ItemsTrabajoService : IItemTrabajo
    {
        private readonly ItemsTrabajoContext _context;
        private readonly UsuarioServiceClient _usuarioClient;
        private readonly ILogger<ItemsTrabajoService> _logger;

        public ItemsTrabajoService(ItemsTrabajoContext context, 
            UsuarioServiceClient usuarioClient,
            ILogger<ItemsTrabajoService> logger)
        {
            _context = context;
            _usuarioClient = usuarioClient;
            _logger = logger;
        }

        public async Task<List<ItemsTrabajoBaseDto>> ObtenerItems()
        {
            var fechaActual = DateTime.Today;
            var items = await _context.dato_item_trabajos
            .Select(x => new ItemsTrabajoBaseDto
            {
                Id = x.ittr_id,
                Titulo = x.ittr_titulo,
                FechaEntrega = x.ittr_fecha_entrega,
                Relevancia = x.ittr_relevancia, // "alta", "media", "baja"
                UsuarioAsignado = x.ittr_usuario_asignado,
                Completado = x.ittr_completado, // true/false
                DiasParaEntrega = (x.ittr_fecha_entrega.Value - fechaActual).Days
            })
            .ToListAsync();

            // Ordenar: Primero por relevancia, luego por fecha de entrega
            return items
                .OrderBy(x => x.Relevancia == "alta" ? 1 :
                              x.Relevancia == "media" ? 2 : 3)  // alta > media > baja
                .ThenBy(x => x.DiasParaEntrega)                  // fecha más próxima primero
                .ThenBy(x => x.Titulo)                           // desempate por título
                .ToList();
        }

        public async Task<List<ItemsTrabajoBaseDto>> ObtenerItemsPendientesPorUsuario(string usuario)
        {
            var fechaActual = DateTime.Today;

            var items = await _context.dato_item_trabajos
                .Where(x => x.ittr_usuario_asignado == usuario && x.ittr_completado == false)
                .Select(x => new ItemsTrabajoBaseDto
                {
                    Id = x.ittr_id,
                    Titulo = x.ittr_titulo,
                    FechaEntrega = x.ittr_fecha_entrega,
                    Relevancia = x.ittr_relevancia,
                    UsuarioAsignado = x.ittr_usuario_asignado,
                    Completado = x.ittr_completado,
                    DiasParaEntrega = (x.ittr_fecha_entrega.Value - fechaActual).Days
                })
                .ToListAsync();

            // ORDENAR: Primero por relevancia, luego por fecha de entrega
            var itemsOrdenados = items
                .OrderBy(x => x.Relevancia == "alta" ? 1 :
                              x.Relevancia == "media" ? 2 : 3)  // 1. alta, 2. media, 3. baja
                .ThenBy(x => x.DiasParaEntrega)                  // 2. fecha más cercana
                .ThenBy(x => x.Titulo)                           // 3. orden alfabético
                .ToList();

            return itemsOrdenados;
        }

        public async Task<ItemsTrabajoBaseDto?> ObtenerItemPorId(long id)
        {
            var item = await _context.dato_item_trabajos.FindAsync(id);
            if (item == null) return null;

            return new ItemsTrabajoBaseDto
            {
                Id = item.ittr_id,
                Titulo = item.ittr_titulo,
                FechaEntrega = item.ittr_fecha_entrega,
                Relevancia = item.ittr_relevancia,
                UsuarioAsignado = item.ittr_usuario_asignado,
                Completado = item.ittr_completado
            };
        }

        public async Task CrearItem(ItemsTrabajoBaseDto dto)
        {
            var item = new dato_item_trabajo
            {
                ittr_titulo = dto.Titulo,
                ittr_fecha_entrega = dto.FechaEntrega,
                ittr_relevancia = dto.Relevancia,
                ittr_usuario_asignado = dto.UsuarioAsignado,
                ittr_completado = dto.Completado ?? false
            };

            _context.dato_item_trabajos.Add(item);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> CompletarItem(long id)
        {
            var item = await _context.dato_item_trabajos.FindAsync(id);
            if (item == null) return false;

            item.ittr_completado = true;
            await _context.SaveChangesAsync();
            return true;
        }
        
        public async Task<bool> EliminarItem(long id)
        {
            var item = await _context.dato_item_trabajos.FindAsync(id);
            if (item == null) return false;

            _context.dato_item_trabajos.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AsignarItem(long id, string usuario)
        {
            var item = await _context.dato_item_trabajos.FindAsync(id);
            if (item == null)
                throw new KeyNotFoundException($"No se encontró el item con ID {id}");

            // Verificar si el item ya está completado
            if (item.ittr_completado.Value)
                throw new InvalidOperationException($"El item '{item.ittr_titulo}' ya está completado y no puede ser reasignado");

            // Verificar que el usuario existe en el microservicio de usuarios
            var usuariosExternos = await _usuarioClient.ObtenerTodosLosUsuarios();
            var usuarioExiste = usuariosExternos.Any(u => u.usuaNombre.Equals(usuario, StringComparison.OrdinalIgnoreCase));

            if (!usuarioExiste)
                throw new InvalidOperationException($"El usuario '{usuario}' no existe en el sistema");

            // Obtener todos los items del usuario
            var itemsUsuario = await _context.dato_item_trabajos
                .Where(x => x.ittr_usuario_asignado == usuario && !x.ittr_completado.Value)
                .ToListAsync();

            // Verificar si el usuario está saturado (más de 3 items altamente relevantes)
            var itemsAltamenteRelevantes = itemsUsuario
                .Count(x => x.ittr_relevancia?.ToLower() == "alta");

            if (itemsAltamenteRelevantes >= 3)
            {
                // Obtener usuarios alternativos no saturados
                var usuariosAlternativos = await ObtenerUsuariosNoSaturados(usuario);
                var usuarioSugerido = usuariosAlternativos.FirstOrDefault();

                throw new UsuarioSaturadoException(
                    $"El usuario {usuario} está saturado con {itemsAltamenteRelevantes} items altamente relevantes. " +
                    "Complete algunos items antes de asignar nuevos.",
                    itemsAltamenteRelevantes,
                    usuariosAlternativos,
                    usuarioSugerido
                );
            }

            // Verificar reglas de negocio
            var fechaActual = DateTime.Today;
            var diasParaEntrega = (item.ittr_fecha_entrega.Value - fechaActual).Days;
            var esFechaProxima = diasParaEntrega < 3;

            // REGLA 1: Si la fecha está próxima a vencer (menos de 3 días)
            if (esFechaProxima)
            {
                var usuarioOptimo = await ObtenerUsuarioConMenosItems();

                if (usuarioOptimo != null && usuarioOptimo != usuario)
                {
                    // Obtener lista de usuarios disponibles (excluyendo al actual)
                    var usuariosDisponibles = await ObtenerUsuariosNoSaturados(usuario);

                    throw new UsuarioNoOptimoException(
                        $"Este item tiene fecha próxima a vencer ({item.ittr_fecha_entrega:dd/MM/yyyy}). " +
                        $"Debe asignarse a {usuarioOptimo} que tiene menos items pendientes.",
                        usuarioOptimo,
                        usuariosDisponibles
                    );
                }
            }
            else
            {
                // REGLA 2: Para items NO próximos a vencer, aplicar reglas de relevancia
                var esRelevante = item.ittr_relevancia?.ToLower() == "alta";

                if (esRelevante)
                {
                    var usuarioOptimo = await ObtenerUsuarioConMenosItems();

                    if (usuarioOptimo != null && usuarioOptimo != usuario)
                    {
                        // Obtener lista de usuarios disponibles (excluyendo al actual)
                        var usuariosDisponibles = await ObtenerUsuariosNoSaturados(usuario);

                        throw new UsuarioNoOptimoException(
                            $"Este item es ALTAMENTE RELEVANTE. " +
                            $"Debe asignarse a {usuarioOptimo} que tiene menos items pendientes.",
                            usuarioOptimo,
                            usuariosDisponibles
                        );
                    }
                }
            }

            // Si pasa todas las validaciones, asignar
            item.ittr_usuario_asignado = usuario;
            await _context.SaveChangesAsync();

            return true;
        }

        private async Task<List<string>> ObtenerUsuariosNoSaturados(string usuarioExcluido)
        {
            var usuariosExternos = await _usuarioClient.ObtenerTodosLosUsuarios();
            var nombresUsuarios = usuariosExternos.Select(u => u.usuaNombre).ToList();
            var resultado = new List<string>();

            foreach (var nombreUsuario in nombresUsuarios)
            {
                if (nombreUsuario.Equals(usuarioExcluido, StringComparison.OrdinalIgnoreCase))
                    continue;

                var itemsUsuario = await _context.dato_item_trabajos
                    .Where(x => x.ittr_usuario_asignado == nombreUsuario && !x.ittr_completado.Value)
                    .ToListAsync();

                var itemsAltamenteRelevantes = itemsUsuario
                    .Count(x => x.ittr_relevancia?.ToLower() == "alta");

                if (itemsAltamenteRelevantes < 3)
                {
                    resultado.Add(nombreUsuario);
                }
            }

            return resultado;
        }

        public class UsuarioSaturadoException : Exception
        {
            public int ItemsAltamenteRelevantes { get; }
            public List<string> UsuariosAlternativos { get; }
            public string? UsuarioSugerido { get; }

            public UsuarioSaturadoException(string message, int itemsRelevantes, List<string> usuariosAlternativos, string? usuarioSugerido)
                : base(message)
            {
                ItemsAltamenteRelevantes = itemsRelevantes;
                UsuariosAlternativos = usuariosAlternativos;
                UsuarioSugerido = usuarioSugerido;
            }
        }

        public class UsuarioNoOptimoException : Exception
        {
            public string UsuarioSugerido { get; }
            public List<string> UsuariosAlternativos { get; }

            public UsuarioNoOptimoException(string message, string usuarioSugerido, List<string> usuariosAlternativos)
                : base(message)
            {
                UsuarioSugerido = usuarioSugerido;
                UsuariosAlternativos = usuariosAlternativos;
            }
        }

        private async Task<string?> ObtenerUsuarioConMenosItems()
        {
            // Obtener usuarios del microservicio
            var usuariosExternos = await _usuarioClient.ObtenerTodosLosUsuarios();

            if (!usuariosExternos.Any())
                return null;

            var nombresUsuarios = usuariosExternos.Select(u => u.usuaNombre).ToList();

            // Obtener carga de trabajo de los usuarios que tienen items
            var usuariosConCarga = await _context.dato_item_trabajos
                .Where(x => x.ittr_usuario_asignado != null && nombresUsuarios.Contains(x.ittr_usuario_asignado))
                .GroupBy(x => x.ittr_usuario_asignado)
                .Select(g => new
                {
                    Usuario = g.Key,
                    ItemsPendientes = g.Count(x => !x.ittr_completado.Value),
                    ItemsAltamenteRelevantes = g.Count(x => !x.ittr_completado.Value && x.ittr_relevancia == "alta")
                })
                .Where(x => x.ItemsAltamenteRelevantes < 3)
                .OrderBy(x => x.ItemsPendientes)
                .ToListAsync();

            // Crear lista completa incluyendo usuarios sin items
            var todosLosUsuarios = new List<dynamic>();

            // Agregar usuarios con carga
            todosLosUsuarios.AddRange(usuariosConCarga);

            // Agregar usuarios sin items (no están en la BD)
            var usuariosConItems = usuariosConCarga.Select(u => u.Usuario).ToHashSet();
            var usuariosSinItems = nombresUsuarios.Where(n => !usuariosConItems.Contains(n));

            foreach (var usuario in usuariosSinItems)
            {
                todosLosUsuarios.Add(new
                {
                    Usuario = usuario,
                    ItemsPendientes = 0,
                    ItemsAltamenteRelevantes = 0
                });
            }

            // Ordenar por items pendientes
            var usuariosOrdenados = todosLosUsuarios
                .OrderBy(u => u.ItemsPendientes)
                .ThenBy(u => u.Usuario)
                .ToList();

            return usuariosOrdenados.FirstOrDefault()?.Usuario;
        }

        public async Task<AsignacionAutomaticaDto> AsignarItemAutomaticamente(long id)
        {
            var item = await _context.dato_item_trabajos.FindAsync(id);
            if (item == null)
                throw new KeyNotFoundException($"No se encontró el item con ID {id}");

            if (item.ittr_completado.Value)
                throw new InvalidOperationException($"El item '{item.ittr_titulo}' ya está completado");

            if (!string.IsNullOrEmpty(item.ittr_usuario_asignado))
                throw new InvalidOperationException($"El item ya está asignado a {item.ittr_usuario_asignado}");

            var fechaActual = DateTime.Today;
            var diasParaEntrega = (item.ittr_fecha_entrega.Value - fechaActual).Days;
            var esFechaProxima = diasParaEntrega < 3;
            var esRelevante = item.ittr_relevancia?.ToLower() == "alta";

            // Obtener usuarios del microservicio
            var usuariosExternos = await _usuarioClient.ObtenerTodosLosUsuarios();
            if (!usuariosExternos.Any())
                throw new InvalidOperationException("No hay usuarios disponibles en el sistema");

            // Obtener TODOS los usuarios con su carga de trabajo (incluyendo saturados)
            var todosLosUsuarios = await ObtenerCargaCompletaUsuarios(usuariosExternos.Select(u => u.usuaNombre).ToList());

            // Filtrar SOLO usuarios NO saturados (menos de 3 items relevantes)
            var usuariosDisponibles = todosLosUsuarios
                .Where(u => !u.EstaSaturado)
                .OrderBy(u => u.ItemsPendientes)
                .ToList();

            if (!usuariosDisponibles.Any())
                throw new InvalidOperationException("No hay usuarios disponibles no saturados para asignar este item");

            // Seleccionar el usuario óptimo según reglas
            UsuarioCargaDto usuarioSeleccionado;
            string motivo;

            // REGLA 1: Items con fecha próxima (menos de 3 días)
            if (esFechaProxima)
            {
                usuarioSeleccionado = usuariosDisponibles.First(); // Usuario con menos pendientes (no saturado)
                motivo = $"Fecha próxima a vencer ({item.ittr_fecha_entrega:dd/MM/yyyy}) - " +
                        $"Asignado a {usuarioSeleccionado.NombreUsuario} que tiene {usuarioSeleccionado.ItemsPendientes} items pendientes";
            }
            // REGLA 2: Items relevantes
            else if (esRelevante)
            {
                usuarioSeleccionado = usuariosDisponibles.First(); // Usuario no saturado con menos pendientes
                motivo = $"Item altamente relevante - " +
                        $"Asignado a {usuarioSeleccionado.NombreUsuario} (no saturado, {usuarioSeleccionado.ItemsPendientes} pendientes, {usuarioSeleccionado.ItemsAltamenteRelevantes} relevantes)";
            }
            // REGLA 3: Items normales
            else
            {
                usuarioSeleccionado = usuariosDisponibles.First(); // Usuario con menos pendientes (balanceo)
                motivo = $"Item de prioridad normal - " +
                        $"Asignado para balancear carga a {usuarioSeleccionado.NombreUsuario} ({usuarioSeleccionado.ItemsPendientes} items pendientes)";
            }

            // Asignar el item
            item.ittr_usuario_asignado = usuarioSeleccionado.NombreUsuario;
            await _context.SaveChangesAsync();

            return new AsignacionAutomaticaDto
            {
                ItemId = item.ittr_id,
                Titulo = item.ittr_titulo,
                UsuarioAsignado = usuarioSeleccionado.NombreUsuario,
                MotivoAsignacion = motivo,
                FechaEntrega = item.ittr_fecha_entrega.Value,
                Relevancia = item.ittr_relevancia ?? "baja",
                DiasParaEntrega = diasParaEntrega
            };
        }

        private async Task<List<UsuarioCargaDto>> ObtenerCargaCompletaUsuarios(List<string> nombresUsuarios)
        {
            var cargaUsuarios = new List<UsuarioCargaDto>();

            foreach (var nombreUsuario in nombresUsuarios)
            {
                var itemsUsuario = await _context.dato_item_trabajos
                    .Where(x => x.ittr_usuario_asignado == nombreUsuario)
                    .ToListAsync();

                var carga = new UsuarioCargaDto
                {
                    NombreUsuario = nombreUsuario,
                    ItemsPendientes = itemsUsuario.Count(x => !x.ittr_completado.Value),
                    ItemsAltamenteRelevantes = itemsUsuario.Count(x => !x.ittr_completado.Value && x.ittr_relevancia == "alta")
                };

                cargaUsuarios.Add(carga);
            }

            // Agregar usuarios que no tienen items asignados
            var usuariosConItems = cargaUsuarios.Select(u => u.NombreUsuario).ToHashSet();
            var usuariosSinItems = nombresUsuarios.Where(n => !usuariosConItems.Contains(n));

            foreach (var usuario in usuariosSinItems)
            {
                cargaUsuarios.Add(new UsuarioCargaDto
                {
                    NombreUsuario = usuario,
                    ItemsPendientes = 0,
                    ItemsAltamenteRelevantes = 0
                });
            }

            return cargaUsuarios;
        }

        private async Task<List<UsuarioCargaDto>> ObtenerUsuariosDisponibles()
        {
            var usuariosExternos = await _usuarioClient.ObtenerTodosLosUsuarios();
            var todosLosUsuarios = await ObtenerCargaCompletaUsuarios(usuariosExternos.Select(u => u.usuaNombre).ToList());

            return todosLosUsuarios
                .Where(u => !u.EstaSaturado)
                .OrderBy(u => u.ItemsPendientes)
                .ToList();
        }

        private async Task<(string? Usuario, string Motivo)> ObtenerUsuarioOptimoParaItemConDetalle(dato_item_trabajo item)
        {
            var fechaActual = DateTime.Today;
            var diasParaEntrega = (item.ittr_fecha_entrega.Value - fechaActual).Days;
            var esFechaProxima = diasParaEntrega < 3;
            var esRelevante = item.ittr_relevancia?.ToLower() == "alta";

            var usuariosOrdenados = await ObtenerUsuariosOrdenadosPorCarga();

            if (!usuariosOrdenados.Any())
                return (null, "");

            var usuarioOptimo = usuariosOrdenados.First();

            if (esFechaProxima)
            {
                return (usuarioOptimo.Usuario,
                    $"Fecha próxima a vencer ({item.ittr_fecha_entrega:dd/MM/yyyy}) - " +
                    $"Asignado a {usuarioOptimo.Usuario} con {usuarioOptimo.ItemsPendientes} items pendientes");
            }

            if (esRelevante)
            {
                return (usuarioOptimo.Usuario,
                    $"Item altamente relevante - Asignado a {usuarioOptimo.Usuario} " +
                    $"(no saturado, {usuarioOptimo.ItemsPendientes} pendientes)");
            }

            return (usuarioOptimo.Usuario,
                $"Item de prioridad normal - Asignado para balancear carga a {usuarioOptimo.Usuario} " +
                $"({usuarioOptimo.ItemsPendientes} items pendientes)");
        }

        private async Task<List<dynamic>> ObtenerUsuariosOrdenadosPorCarga()
        {
            var usuariosExternos = await _usuarioClient.ObtenerTodosLosUsuarios();
            var nombresUsuarios = usuariosExternos.Select(u => u.usuaNombre).ToList();

            var usuariosConCarga = await _context.dato_item_trabajos
                .Where(x => x.ittr_usuario_asignado != null && nombresUsuarios.Contains(x.ittr_usuario_asignado))
                .GroupBy(x => x.ittr_usuario_asignado)
                .Select(g => new
                {
                    Usuario = g.Key,
                    ItemsPendientes = g.Count(x => !x.ittr_completado.Value),
                    ItemsAltamenteRelevantes = g.Count(x => !x.ittr_completado.Value && x.ittr_relevancia == "alta")
                })
                .Where(x => x.ItemsAltamenteRelevantes < 3)
                .ToListAsync();

            var resultado = new List<dynamic>();

            resultado.AddRange(usuariosConCarga);

            var usuariosConItems = usuariosConCarga.Select(u => u.Usuario).ToHashSet();
            var usuariosSinItems = nombresUsuarios.Where(n => !usuariosConItems.Contains(n));

            foreach (var usuario in usuariosSinItems)
            {
                resultado.Add(new
                {
                    Usuario = usuario,
                    ItemsPendientes = 0,
                    ItemsAltamenteRelevantes = 0
                });
            }

            return resultado
                .OrderBy(u => u.ItemsPendientes)
                .ThenBy(u => u.Usuario)
                .ToList();
        }

        public async Task<List<UsuarioCargaDto>> ObtenerEstadoUsuarios()
        {
            var usuariosExternos = await _usuarioClient.ObtenerTodosLosUsuarios();
            var resultado = new List<UsuarioCargaDto>();

            foreach (var usuario in usuariosExternos)
            {
                var itemsUsuario = await _context.dato_item_trabajos
                    .Where(x => x.ittr_usuario_asignado == usuario.usuaNombre)
                    .ToListAsync();

                resultado.Add(new UsuarioCargaDto
                {
                    NombreUsuario = usuario.usuaNombre,
                    ItemsPendientes = itemsUsuario.Count(x => !x.ittr_completado.Value),
                    ItemsAltamenteRelevantes = itemsUsuario.Count(x => !x.ittr_completado.Value && x.ittr_relevancia == "alta")
                });
            }

            return resultado.OrderBy(u => u.ItemsPendientes).ToList();
        }

    }
}
