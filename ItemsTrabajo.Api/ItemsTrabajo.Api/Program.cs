using ItemsTrabajo.Api.Configurations;
using ItemsTrabajo.Api.Interfaces;
using ItemsTrabajo.Api.Models;
using ItemsTrabajo.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ItemsTrabajoContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ItemsTrabajoConnection")
    )
);

builder.Services.Configure<ApiSettings>(builder.Configuration.GetSection("ApiUrls"));

builder.Services.AddHttpClient<UsuarioServiceClient>((serviceProvider, client) =>
{
    var settings = serviceProvider.GetRequiredService<IOptions<ApiSettings>>().Value;
    client.BaseAddress = new Uri(settings.UsuariosApi);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

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
