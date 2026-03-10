using ItemsTrabajo.Api.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace ItemsTrabajo.Api.Interfaces
{
    public interface IItemTrabajo
    {
        Task<List<ItemsTrabajoBaseDto>> ObtenerItems();
        Task<ItemsTrabajoBaseDto?> ObtenerItemPorId(long id);
        Task CrearItem(ItemsTrabajoBaseDto dto);
        Task<bool> CompletarItem(long id);
        Task<bool> AsignarItem(long id, string usuario);
        Task<bool> EliminarItem(long id);
        Task<AsignacionAutomaticaDto> AsignarItemAutomaticamente(long id);
        Task<List<UsuarioCargaDto>> ObtenerEstadoUsuarios();
        Task<List<ItemsTrabajoBaseDto>> ObtenerItemsPendientesPorUsuario(string usuario);
    }
}
