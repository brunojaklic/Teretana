using AutoMapper;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{

    /// <summary>
    /// API kontroler za upravljanje entitetima TreningProgram.
    /// Omogućuje dohvat, dodavanje, ažuriranje i brisanje programa.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProgramController(TeretanaContext context, IMapper mapper) : TeretanaController(context, mapper)
    {
        /// <summary>
        /// Dohvaća sve programe iz baze i vraća ih kao listu DTO objekata.
        /// </summary>
        /// <returns>Lista svih programa.</returns>
        [HttpGet]
        public ActionResult<List<ProgramDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<ProgramDTORead>>(_context.Programi));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Dohvaća program prema zadanoj šifri.
        /// </summary>
        /// <param name="sifra">Šifra programa.</param>
        /// <returns>DTO objekt programa ili poruka o grešci.</returns>
        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<ProgramDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            TreningProgram? e;
            try
            {
                e = _context.Programi.Find(sifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Program ne postoji u bazi" });
            }

            return Ok(_mapper.Map<ProgramDTOInsertUpdate>(e));
        }

        /// <summary>
        /// Dodaje novi program u bazu.
        /// </summary>
        /// <param name="dto">DTO objekt s podacima o programu.</param>
        /// <returns>Kreirani program ili poruka o grešci.</returns>
        [HttpPost]
        public IActionResult Post(ProgramDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var e = _mapper.Map<TreningProgram>(dto);
                _context.Programi.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<ProgramDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Ažurira postojeći program prema šifri.
        /// </summary>
        /// <param name="sifra">Šifra programa za ažuriranje.</param>
        /// <param name="dto">DTO objekt s novim podacima.</param>
        /// <returns>Poruka o uspjehu ili grešci.</returns>
        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, ProgramDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                TreningProgram? e;
                try
                {
                    e = _context.Programi.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Program ne postoji u bazi" });
                }

                e = _mapper.Map(dto, e);

                _context.Programi.Update(e);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promjenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        /// <summary>
        /// Briše program iz baze prema zadanoj šifri.
        /// </summary>
        /// <param name="sifra">Šifra programa za brisanje.</param>
        /// <returns>Poruka o uspjehu ili grešci.</returns>
        [HttpDelete]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Delete(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                TreningProgram? e;
                try
                {
                    e = _context.Programi.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound("Program ne postoji u bazi");
                }
                _context.Programi.Remove(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }
    }
}