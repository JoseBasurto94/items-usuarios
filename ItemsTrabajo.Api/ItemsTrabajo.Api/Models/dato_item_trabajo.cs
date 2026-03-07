using System;
using System.Collections.Generic;

namespace ItemsTrabajo.Api.Models;

public partial class dato_item_trabajo
{
    public long ittr_id { get; set; }

    public string? ittr_titulo { get; set; }

    public DateTime? ittr_fecha_entrega { get; set; }

    public string? ittr_relevancia { get; set; }

    public string? ittr_usuario_asignado { get; set; }

    public bool? ittr_completado { get; set; }
}
