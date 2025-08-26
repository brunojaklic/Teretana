using BACKEND.Data;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    /// <summary>
    /// API kontroler za dohvat osnovnih podataka na početnoj stranici aplikacije.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class PocetnaController(TeretanaContext _context) : ControllerBase
    {
        /// <summary>
        /// Dohvaća listu dostupnih programa s njihovim nazivima.
        /// </summary>
        /// <returns>Lista objekata koji sadrže nazive programa.</returns>
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

        /// <summary>
        /// Vraća ukupan broj vježbača u sustavu.
        /// </summary>
        /// <returns>Broj vježbača.</returns>
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