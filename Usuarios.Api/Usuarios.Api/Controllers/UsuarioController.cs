using Microsoft.AspNetCore.Mvc;
using Usuarios.Api.Dtos;
using Usuarios.Api.Interfaces;

namespace Usuarios.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuario _usuarioService;

        public UsuarioController(IUsuario usuarioService)
        {
            _usuarioService = usuarioService;
        }

        // GET: api/Usuario
        [HttpGet]
        public async Task<ActionResult<List<UsuariosBaseDto>>> GetUsuarios()
        {
            var usuarios = await _usuarioService.ObtenerUsuarios();
            return Ok(usuarios); 
        }

        // GET: api/Usuario/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuariosBaseDto>> GetUsuario(long id)
        {
            var usuario = await _usuarioService.ObtenerUsuarioPorId(id);
            if (usuario == null) return NotFound();
            return Ok(usuario); 
        }

        // POST: api/Usuario
        [HttpPost]
        public async Task<IActionResult> CrearUsuario([FromBody] UsuariosDto dto)
        {
            await _usuarioService.CrearUsuario(dto);
            return Ok(new { mensaje = "Usuario creado correctamente"}); 
        }

        // PUT: api/Usuario/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarUsuario(long id, [FromBody] UsuariosDto dto)
        {
            var success = await _usuarioService.ActualizarUsuario(id, dto);
            if (!success) return NotFound();
            return Ok(new { mensaje = "Usuario actualizado" });
        }

        // DELETE: api/Usuario/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarUsuario(long id)
        {
            var success = await _usuarioService.EliminarUsuario(id);
            if (!success) return NotFound();
            return Ok(new { mensaje = "Usuario eliminado" }); 
        }
    }
}
