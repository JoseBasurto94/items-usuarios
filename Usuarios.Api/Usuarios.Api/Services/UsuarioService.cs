using Microsoft.EntityFrameworkCore;
using Usuarios.Api.Dtos;
using Usuarios.Api.Interfaces;
using Usuarios.Api.Models;

namespace Usuarios.Api.Services
{
    public class UsuarioService : IUsuario
    {

        private readonly UsuariosContext _context;

        public UsuarioService(UsuariosContext context)
        {
            _context = context;
        }

        public async Task<List<UsuariosBaseDto>> ObtenerUsuarios()
        {
            return await _context.dato_usuarios
                .Select(u => new UsuariosBaseDto
                {
                    usuaId = u.usua_id,
                    usuaNombre = u.usua_nombre
                })
            .ToListAsync();
        }

        public async Task<UsuariosBaseDto> ObtenerUsuarioPorId(long id)
        {
            var usuario = await _context.dato_usuarios.FindAsync(id);
            if (usuario == null) return null;

            return new UsuariosBaseDto
            {
                usuaId = usuario.usua_id,
                usuaNombre = usuario.usua_nombre
            };
        }

        public async Task CrearUsuario(UsuariosDto dto)
        {
            var usuario = new dato_usuario
            {
                usua_nombre = dto.usuaNombre
            };

            _context.dato_usuarios.Add(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ActualizarUsuario(long id, UsuariosDto dto)
        {
            var usuario = await _context.dato_usuarios.FindAsync(id);
            if (usuario == null) return false;

            usuario.usua_nombre = dto.usuaNombre;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarUsuario(long id)
        {
            var usuario = await _context.dato_usuarios.FindAsync(id);
            if (usuario == null) return false;

            _context.dato_usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
