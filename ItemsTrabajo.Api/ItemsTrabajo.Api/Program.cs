using ItemsTrabajo.Api.Interfaces;
using ItemsTrabajo.Api.Models;
using ItemsTrabajo.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ItemsTrabajoContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ItemsTrabajoConnection")
    )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IItemTrabajo, ItemsTrabajoService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
