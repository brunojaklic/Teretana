using BACKEND.Data;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProgramController : ControllerBase
    {
        // 1. koristimo dependency injection

        private readonly EdunovaContext _context;

        // 2. u konstruktoru postavljamo vrijednost
        public ProgramController(EdunovaContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(_context.Programi);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpGet("{sifra:int}")]
        public IActionResult Get(int sifra)
        {
            if (sifra <= 0)
            {
                return BadRequest("Šifra nije dobra");
            }

            try
            {
                var program = _context.Programi.Find(sifra);
                if(program == null)
                {
                    return NotFound();
                }

                return Ok(program);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPost]
        public IActionResult Post(BACKEND.Models.Program program)
        {
            try
            {
                _context.Programi.Add(program);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, program);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPut("{sifra:int}")]
        public IActionResult Put(int sifra, BACKEND.Models.Program program)
        {

            if(sifra < 1)
            {
                return BadRequest(new { poruka = "Šifra mora biti veća od 0" });
            }

            try
            {
                BACKEND.Models.Program p = _context.Programi.Find(sifra);

                if(p == null)
                {
                    return NotFound();
                }

                // za sada ručno, kasnije automatika
                p.Naziv = program.Naziv;
                p.Cijena = program.Cijena;
                p.Aktivan = program.Aktivan;

                _context.Programi.Update(p);
                _context.SaveChanges();
                return Ok(p);

            }
            catch (Exception e)
            {
                return BadRequest(e);
            }

        }

        [HttpDelete("{sifra:int}")]
        public IActionResult Delete(int sifra)
        {
            if (sifra < 1)
            {
                return BadRequest(new { poruka = "Šifra mora biti veća od 0" });
            }

            try
            {
                BACKEND.Models.Program p = _context.Programi.Find(sifra);

                if (p == null)
                {
                    return NotFound();
                }

                _context.Programi.Remove(p);
                _context.SaveChanges();
                return NoContent();

            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }




    }
}
