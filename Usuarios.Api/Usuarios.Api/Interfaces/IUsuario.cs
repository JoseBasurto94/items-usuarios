using Usuarios.Api.Dtos;

namespace Usuarios.Api.Interfaces
{
    public interface IUsuario
    {
        Task<List<UsuariosBaseDto>> ObtenerUsuarios();
        Task<UsuariosBaseDto> ObtenerUsuarioPorId(long id);
        Task CrearUsuario(UsuariosDto dto);
        Task<bool> ActualizarUsuario(long id, UsuariosDto dto);
        Task<bool> EliminarUsuario(long id);
    }
}
