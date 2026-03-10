using ItemsTrabajo.Api.Dtos;
using ItemsTrabajo.Api.Interfaces;
using ItemsTrabajo.Api.Models;
using ItemsTrabajo.Api.Services;
using Microsoft.AspNetCore.Mvc;
using static ItemsTrabajo.Api.Services.ItemsTrabajoService;

namespace ItemsTrabajo.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemTrabajoController : ControllerBase
    {
        private readonly IItemTrabajo _itemsService;

        public ItemTrabajoController(IItemTrabajo itemsService)
        {
            _itemsService = itemsService;
        }

        // GET api/ItemTrabajo
        [HttpGet]
        public async Task<ActionResult<List<ItemsTrabajoBaseDto>>> ObtenerItems()
        {
            var items = await _itemsService.ObtenerItems();
            return Ok(items);
        }

        // GET api/ItemTrabajo/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemsTrabajoBaseDto>> ObtenerItem(long id)
        {
            var item = await _itemsService.ObtenerItemPorId(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST api/ItemTrabajo
        [HttpPost]
        public async Task<IActionResult> CrearItem([FromBody] ItemsTrabajoBaseDto dto)
        {
            await _itemsService.CrearItem(dto);
            return Ok("Item creado correctamente");
        }

        // PUT api/ItemTrabajo/{id}/complete
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompletarItem(long id)
        {
            var success = await _itemsService.CompletarItem(id);
            if (!success) return NotFound();
            return Ok("Item completado");
        }

        // PUT api/ItemTrabajo/{id}/assign
        [HttpPut("{id}/assign")]
        public async Task<IActionResult> AsignarItem(long id, [FromBody] AsignarItemDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.usuario))
                    return BadRequest(new
                    {
                        success = false,
                        mensaje = "El nombre de usuario es requerido",
                        codigo = "USUARIO_REQUERIDO"
                    });

                await _itemsService.AsignarItem(id, dto.usuario);

                var itemActualizado = await _itemsService.ObtenerItemPorId(id);

                return Ok(new
                {
                    success = true,
                    mensaje = $"Item '{itemActualizado?.Titulo}' asignado exitosamente a {dto.usuario}",
                    data = itemActualizado
                });
            }
            catch (UsuarioSaturadoException ex)
            {
                return Conflict(new
                {
                    success = false,
                    mensaje = ex.Message,
                    codigo = "USUARIO_SATURADO",
                    itemsAltamenteRelevantes = ex.ItemsAltamenteRelevantes,
                    usuariosAlternativos = ex.UsuariosAlternativos,
                    usuarioSugerido = ex.UsuarioSugerido
                });
            }
            catch (UsuarioNoOptimoException ex)
            {
                return Conflict(new
                {
                    success = false,
                    mensaje = ex.Message,
                    codigo = "USUARIO_NO_OPTIMO",
                    usuarioSugerido = ex.UsuarioSugerido,
                    usuariosAlternativos = ex.UsuariosAlternativos
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    success = false,
                    mensaje = ex.Message,
                    codigo = "ITEM_NO_ENCONTRADO"
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    success = false,
                    mensaje = ex.Message,
                    codigo = "REGLA_NEGOCIO"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    mensaje = "Error interno al asignar el item",
                    codigo = "ERROR_INTERNO"
                });
            }
        }

        // DELETE api/ItemTrabajo/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarItem(long id)
        {
            var success = await _itemsService.EliminarItem(id);
            if (!success) return NotFound();
            return Ok("Item eliminado");
        }

        [HttpPost("{id}/asignar-automatico")]
        public async Task<IActionResult> AsignarItemAutomaticamente(long id)
        {
            try
            {
                var resultado = await _itemsService.AsignarItemAutomaticamente(id);

                return Ok(new
                {
                    success = true,
                    mensaje = $"Item asignado automáticamente a {resultado.UsuarioAsignado}",
                    data = resultado
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    success = false,
                    mensaje = ex.Message,
                    codigo = "ITEM_NO_ENCONTRADO"
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    success = false,
                    mensaje = ex.Message,
                    codigo = "REGLA_NEGOCIO"
                });
            }
            catch (UsuarioSaturadoException ex)
            {
                return Conflict(new
                {
                    success = false,
                    mensaje = ex.Message,
                    codigo = "USUARIO_SATURADO",
                    itemsAltamenteRelevantes = ex.ItemsAltamenteRelevantes,
                    usuariosAlternativos = ex.UsuariosAlternativos,
                    usuarioSugerido = ex.UsuarioSugerido
                });
            }
            catch (UsuarioNoOptimoException ex)
            {
                return Conflict(new
                {
                    success = false,
                    mensaje = ex.Message,
                    codigo = "USUARIO_NO_OPTIMO",
                    usuarioSugerido = ex.UsuarioSugerido,
                    usuariosAlternativos = ex.UsuariosAlternativos
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    mensaje = "Error interno al asignar el item automáticamente",
                    codigo = "ERROR_INTERNO"
                });
            }
        }

        [HttpGet("usuario/{usuario}/pendientes")]
        public async Task<ActionResult<List<ItemsTrabajoBaseDto>>> ObtenerItemsPendientesPorUsuario(string usuario)
        {
            try
            {
                var items = await _itemsService.ObtenerItemsPendientesPorUsuario(usuario);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener items del usuario" });
            }
        }

    }
}
