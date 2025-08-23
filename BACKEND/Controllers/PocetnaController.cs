using BACKEND.Data;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PocetnaController(TeretanaContext _context) : ControllerBase
    {

        [HttpGet]
        [Route("DostupniProgrami")]
        public ActionResult<List<ProgramDTORead>> DostupniProgrami()
        {
            try
            {
                var programi = _context.Programi.ToList();
                var lista = new List<object>();
                foreach (var program in programi)
                {
                    lista.Add(new { program.Naziv });
                }
                return Ok(lista);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        [Route("UkupnoVjezbaca")]
        public IActionResult UkupnoVjezbaca()
        {
            try
            {
                return Ok(new { poruka = _context.Vjezbaci.Count() });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }
    }
}