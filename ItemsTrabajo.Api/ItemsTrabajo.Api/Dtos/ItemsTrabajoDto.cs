namespace ItemsTrabajo.Api.Dtos
{
    public class ItemsTrabajoDto
    {
        public string? Titulo { get; set; }
        public DateTime? FechaEntrega { get; set; }
        public string? Relevancia { get; set; }
        public string? UsuarioAsignado { get; set; }
        public bool? Completado { get; set; }
        public int DiasParaEntrega { get; set; }
    }

    public class ItemsTrabajoBaseDto : ItemsTrabajoDto
    {
        public long Id { get; set; }
    }

}
