namespace ItemsTrabajo.Api.Dtos
{
    public class ItemsTrabajoDto
    {
        public string? Titulo { get; set; }          // ittr_titulo
        public DateTime? FechaEntrega { get; set; }  // ittr_fecha_entrega
        public string? Relevancia { get; set; }      // ittr_relevancia
        public string? UsuarioAsignado { get; set; } // ittr_usuario_asignado
        public bool? Completado { get; set; }        // ittr_completado
    }

    public class ItemsTrabajoBaseDto : ItemsTrabajoDto
    {
        public long Id { get; set; }                 // ittr_id
    }

}
