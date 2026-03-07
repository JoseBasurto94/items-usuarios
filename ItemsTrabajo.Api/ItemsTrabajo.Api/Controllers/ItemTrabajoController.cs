using ItemsTrabajo.Api.Dtos;
using ItemsTrabajo.Api.Interfaces;
using ItemsTrabajo.Api.Models;
using ItemsTrabajo.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ItemsTrabajo.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemTrabajoController : ControllerBase
    {
        private readonly IItemTrabajo _itemsService;

        public ItemTrabajoController(IItemTrabajo itemsService)
        {
            _itemsService = itemsService;
        }

        // GET api/ItemTrabajo
        [HttpGet]
        public async Task<ActionResult<List<ItemsTrabajoBaseDto>>> ObtenerItems()
        {
            var items = await _itemsService.ObtenerItems();
            return Ok(items);
        }

        // GET api/ItemTrabajo/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemsTrabajoBaseDto>> ObtenerItem(long id)
        {
            var item = await _itemsService.ObtenerItemPorId(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // POST api/ItemTrabajo
        [HttpPost]
        public async Task<IActionResult> CrearItem([FromBody] ItemsTrabajoBaseDto dto)
        {
            await _itemsService.CrearItem(dto);
            return Ok("Item creado correctamente");
        }

        // PUT api/ItemTrabajo/{id}/complete
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompletarItem(long id)
        {
            var success = await _itemsService.CompletarItem(id);
            if (!success) return NotFound();
            return Ok("Item completado");
        }

        // PUT api/ItemTrabajo/{id}/assign
        [HttpPut("{id}/assign")]
        public async Task<IActionResult> AsignarItem(long id, [FromBody] AsignarItemDto dto)
        {
            var success = await _itemsService.AsignarItem(id, dto.usuario);
            if (!success) return NotFound();
            return Ok(new { mensaje = $"Item {id} asignado a {dto.usuario}" });
        }

        // DELETE api/ItemTrabajo/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarItem(long id)
        {
            var success = await _itemsService.EliminarItem(id);
            if (!success) return NotFound();
            return Ok("Item eliminado");
        }

    }
}
