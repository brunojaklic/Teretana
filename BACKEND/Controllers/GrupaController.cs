using AutoMapper;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{

    [ApiController]
    [Route("api/v1/[controller]")]
    public class GrupaController(TeretanaContext context, IMapper mapper) : TeretanaController(context, mapper)
    {


        [HttpGet]
        public ActionResult<List<GrupaDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<GrupaDTORead>>(_context.Grupe.Include(g => g.Program)));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }


        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<GrupaDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Grupa? e;
            try
            {
                e = _context.Grupe.Include(g => g.Program).FirstOrDefault(g => g.Sifra == sifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Grupa ne postoji u bazi" });
            }

            return Ok(_mapper.Map<GrupaDTOInsertUpdate>(e));
        }

        [HttpPost]
        public IActionResult Post(GrupaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }

            Models.TreningProgram? es;
            try
            {
                es = _context.Programi.Find(dto.ProgramSifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (es == null)
            {
                return NotFound(new { poruka = "Program na grupi ne postoji u bazi" });
            }

            try
            {
                var e = _mapper.Map<Grupa>(dto);
                e.Program = es;
                _context.Grupe.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<GrupaDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }



        }

        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, GrupaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Grupa? e;
                try
                {
                    e = _context.Grupe.Include(g => g.Program).FirstOrDefault(x => x.Sifra == sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Grupa ne postoji u bazi" });
                }

                Models.TreningProgram? es;
                try
                {
                    es = _context.Programi.Find(dto.ProgramSifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (es == null)
                {
                    return NotFound(new { poruka = "Program na grupi ne postoji u bazi" });
                }

                e = _mapper.Map(dto, e);
                e.Program = es;
                _context.Grupe.Update(e);
                _context.SaveChanges();

                return Ok(new { poruka = "Uspješno promjenjeno" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }

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
                Grupa? e;
                try
                {
                    e = _context.Grupe.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound("Grupa ne postoji u bazi");
                }
                _context.Grupe.Remove(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }


        [HttpGet]
        [Route("Vjezbaci/{sifraGrupe:int}")]
        public ActionResult<List<VjezbacDTORead>> GetVjezbaci(int sifraGrupe)
        {
            if (!ModelState.IsValid || sifraGrupe <= 0)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var p = _context.Grupe
                    .Include(i => i.Vjezbaci)
                    .ThenInclude(v => v.Kategorija)
                    .FirstOrDefault(x => x.Sifra == sifraGrupe);
                if (p == null)
                {
                    return BadRequest("Ne postoji grupa s šifrom " + sifraGrupe + " u bazi");
                }

                return Ok(_mapper.Map<List<VjezbacDTORead>>(p.Vjezbaci));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }



        [HttpPost]
        [Route("{sifra:int}/dodaj/{vjezbacSifra:int}")]
        public IActionResult DodajVjezbaca(int sifra, int vjezbacSifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (sifra <= 0 || vjezbacSifra <= 0)
            {
                return BadRequest("Šifra grupe ili vjezbaca nije dobra");
            }
            try
            {
                var grupa = _context.Grupe
                    .Include(g => g.Vjezbaci)
                    .FirstOrDefault(g => g.Sifra == sifra);
                if (grupa == null)
                {
                    return BadRequest("Ne postoji grupa s šifrom " + sifra + " u bazi");
                }
                var vjezbac = _context.Vjezbaci.Find(vjezbacSifra);
                if (vjezbac == null)
                {
                    return BadRequest("Ne postoji vjezbac s šifrom " + vjezbacSifra + " u bazi");
                }
                grupa.Vjezbaci.Add(vjezbac);
                _context.Grupe.Update(grupa);
                _context.SaveChanges();
                return Ok(new
                {
                    poruka = "Vjezbac " + vjezbac.Prezime + " " + vjezbac.Ime + " dodan na grupu "
                 + grupa.Naziv
                });
            }
            catch (Exception ex)
            {
                return StatusCode(
                       StatusCodes.Status503ServiceUnavailable,
                       ex.Message);
            }
        }


        [HttpDelete]
        [Route("{sifra:int}/obrisi/{vjezbacSifra:int}")]
        public IActionResult ObrisiVjezbaca(int sifra, int vjezbacSifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (sifra <= 0 || vjezbacSifra <= 0)
            {
                return BadRequest("Šifra grupe ili vjezbaca nije dobra");
            }
            try
            {
                var grupa = _context.Grupe
                    .Include(g => g.Vjezbaci)
                    .FirstOrDefault(g => g.Sifra == sifra);
                if (grupa == null)
                {
                    return BadRequest("Ne postoji grupa s šifrom " + sifra + " u bazi");
                }
                var vjezbac = _context.Vjezbaci.Find(vjezbacSifra);
                if (vjezbac == null)
                {
                    return BadRequest("Ne postoji vjezbac s šifrom " + vjezbacSifra + " u bazi");
                }
                grupa.Vjezbaci.Remove(vjezbac);
                _context.Grupe.Update(grupa);
                _context.SaveChanges();

                return Ok(new
                {
                    poruka = "Vjezbac " + vjezbac.Prezime + " " + vjezbac.Ime + " obrisan iz grupe "
                 + grupa.Naziv
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });

            }
        }

        [HttpGet]
        [Route("GrafGrupe")]
        public ActionResult<List<GrafGrupaDTO>> GrafGrupe()
        {
            try
            {
                return Ok(_mapper.Map<List<GrafGrupaDTO>>(_context.Grupe.Include(g => g.Vjezbaci)));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }


    }
}