using Microsoft.EntityFrameworkCore;
using Usuarios.Api.Interfaces;
using Usuarios.Api.Models;
using Usuarios.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<UsuariosContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("UsuariosConnection")
    )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()   // Permite cualquier dominio
            .AllowAnyMethod()   // Permite GET, POST, PUT, DELETE...
            .AllowAnyHeader();  // Permite cualquier header
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IUsuario, UsuarioService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
