using ItemsTrabajo.Api.Dtos;
using ItemsTrabajo.Api.Interfaces;
using ItemsTrabajo.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ItemsTrabajo.Api.Services
{
    public class ItemsTrabajoService : IItemTrabajo
    {
        private readonly ItemsTrabajoContext _context;

        public ItemsTrabajoService(ItemsTrabajoContext context)
        {
            _context = context;
        }

        public async Task<List<ItemsTrabajoBaseDto>> ObtenerItems()
        {
            return await _context.dato_item_trabajos
                .Select(x => new ItemsTrabajoBaseDto
                {
                    Id = x.ittr_id,
                    Titulo = x.ittr_titulo,
                    FechaEntrega = x.ittr_fecha_entrega,
                    Relevancia = x.ittr_relevancia,
                    UsuarioAsignado = x.ittr_usuario_asignado,
                    Completado = x.ittr_completado
                })
                .ToListAsync();
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

        public async Task<bool> AsignarItem(long id, string usuario)
        {
            var item = await _context.dato_item_trabajos.FindAsync(id);
            if (item == null) return false;

            item.ittr_usuario_asignado = usuario;
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

    }
}
