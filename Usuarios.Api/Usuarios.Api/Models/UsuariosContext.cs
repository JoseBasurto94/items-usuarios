using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Usuarios.Api.Models;

public partial class UsuariosContext : DbContext
{
    public UsuariosContext()
    {
    }

    public UsuariosContext(DbContextOptions<UsuariosContext> options)
        : base(options)
    {
    }

    public virtual DbSet<dato_usuario> dato_usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<dato_usuario>(entity =>
        {
            entity.HasKey(e => e.usua_id);

            entity.ToTable("dato_usuario");

            entity.Property(e => e.usua_nombre)
                .HasMaxLength(150)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
