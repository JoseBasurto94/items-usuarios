using ItemsTrabajo.Api.Dtos;
using System.Text.Json;

namespace ItemsTrabajo.Api.Services
{
    public class UsuarioServiceClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<UsuarioServiceClient> _logger;
        private readonly string _baseUrl;

        public UsuarioServiceClient(
            HttpClient httpClient,
            ILogger<UsuarioServiceClient> logger,
            IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;

            // Leer la URL desde appsettings.json
            _baseUrl = configuration.GetConnectionString("URLUsuariosApi")
                      ?? configuration["ApiUrls:UsuariosApi"]
                      ?? throw new InvalidOperationException("URL de UsuariosApi no configurada");

            _httpClient.BaseAddress = new Uri(_baseUrl);
        }

        public async Task<List<UsuarioDto>> ObtenerTodosLosUsuarios()
        {
            try
            {
                _logger.LogInformation($"Obteniendo usuarios desde: {_baseUrl}");

                var response = await _httpClient.GetAsync("api/Usuario");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation($"Respuesta recibida: {content}");

                    return JsonSerializer.Deserialize<List<UsuarioDto>>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }) ?? new List<UsuarioDto>();
                }

                _logger.LogError($"Error al obtener usuarios. Status: {response.StatusCode}, Reason: {response.ReasonPhrase}");
                return new List<UsuarioDto>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al comunicarse con el microservicio de usuarios");
                return new List<UsuarioDto>();
            }
        }

        public async Task<UsuarioDto?> ObtenerUsuarioPorId(long id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"Usuario/{id}");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return JsonSerializer.Deserialize<UsuarioDto>(content, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener usuario {id}");
                return null;
            }
        }

        public async Task<UsuarioDto?> ObtenerUsuarioPorNombre(string nombre)
        {
            try
            {
                var usuarios = await ObtenerTodosLosUsuarios();
                return usuarios.FirstOrDefault(u => u.usuaNombre.Equals(nombre, StringComparison.OrdinalIgnoreCase));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener usuario por nombre {nombre}");
                return null;
            }
        }

        // Método para verificar la salud del servicio
        public async Task<bool> VerificarServicio()
        {
            try
            {
                var response = await _httpClient.GetAsync("Usuario");
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }
    }
}
