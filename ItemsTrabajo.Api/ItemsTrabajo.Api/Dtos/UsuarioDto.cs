namespace ItemsTrabajo.Api.Dtos
{

    public class UsuarioDto
    {
        public long usuaId { get; set; }
        public string usuaNombre { get; set; } = string.Empty;
    }

    public class UsuarioCargaDto
    {
        public string NombreUsuario { get; set; } = string.Empty;
        public int ItemsPendientes { get; set; }
        public int ItemsAltamenteRelevantes { get; set; }
        public bool EstaSaturado => ItemsAltamenteRelevantes >= 3;
    }

    public class AsignacionAutomaticaDto
    {
        public long ItemId { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? UsuarioAsignado { get; set; }
        public string MotivoAsignacion { get; set; } = string.Empty;
        public DateTime FechaEntrega { get; set; }
        public string Relevancia { get; set; } = string.Empty;
        public int DiasParaEntrega { get; set; }
        public UsuarioCargaDto? InfoUsuario { get; set; }
    }

}
