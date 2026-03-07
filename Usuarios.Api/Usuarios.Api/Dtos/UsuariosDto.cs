namespace Usuarios.Api.Dtos
{
    public class UsuariosDto
    {
        public string? usuaNombre { get; set; }
    }

    public class UsuariosBaseDto : UsuariosDto
    {
        public long usuaId { get; set; }
    }

}
