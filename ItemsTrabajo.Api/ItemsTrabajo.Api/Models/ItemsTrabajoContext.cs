using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ItemsTrabajo.Api.Models;

public partial class ItemsTrabajoContext : DbContext
{
    public ItemsTrabajoContext()
    {
    }

    public ItemsTrabajoContext(DbContextOptions<ItemsTrabajoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<dato_item_trabajo> dato_item_trabajos { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseSqlServer("Server=PC-JOSE;Database=dbItemsTrabajo;User Id=sa;Password=123;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<dato_item_trabajo>(entity =>
        {
            entity.HasKey(e => e.ittr_id);

            entity.ToTable("dato_item_trabajo");

            entity.Property(e => e.ittr_fecha_entrega).HasColumnType("datetime");
            entity.Property(e => e.ittr_relevancia)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ittr_titulo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ittr_usuario_asignado)
                .HasMaxLength(150)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
