using AutoMapper;
using BACKEND.Controllers;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{

    [ApiController]
    [Route("api/v1/[controller]")]
    public class KategorijaController(EdunovaContext context, IMapper mapper) : TeretanaController(context, mapper)
    {


        [HttpGet]
        public ActionResult<List<KategorijaDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                return Ok(_mapper.Map<List<KategorijaDTORead>>(_context.Kategorije));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }


        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<KategorijaDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Kategorija? e;
            try
            {
                e = _context.Kategorije.Find(sifra);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Kategorija ne postoji u bazi" });
            }

            return Ok(_mapper.Map<KategorijaDTOInsertUpdate>(e));
        }

        [HttpPost]
        public IActionResult Post(KategorijaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var e = _mapper.Map<Kategorija>(dto);
                _context.Kategorije.Add(e);
                _context.SaveChanges();
                return StatusCode(StatusCodes.Status201Created, _mapper.Map<KategorijaDTORead>(e));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }



        }

        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, KategorijaDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Kategorija? e;
                try
                {
                    e = _context.Kategorije.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Kategorija ne postoji u bazi" });
                }

                e = _mapper.Map(dto, e);

                _context.Kategorije.Update(e);
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
                Kategorija? e;
                try
                {
                    e = _context.Kategorije.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound("Kategorija ne postoji u bazi");
                }
                _context.Kategorije.Remove(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        [Route("Vjezbaci/{sifraKategorije:int}")]
        public ActionResult<List<VjezbacDTORead>> GetVjezbaci(int sifraKategorije)
        {
            if (!ModelState.IsValid || sifraKategorije <= 0)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var p = _context.Kategorije
                    .Include(i => i.Vjezbaci).FirstOrDefault(x => x.Sifra == sifraKategorije);
                if (p == null)
                {
                    return BadRequest("Ne postoji kategorija s šifrom " + sifraKategorije + " u bazi");
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
                return BadRequest("Šifra kategorije ili vjezbaca nije dobra");
            }
            try
            {
                var kategorija = _context.Kategorije
                    .Include(g => g.Vjezbaci)
                    .FirstOrDefault(g => g.Sifra == sifra);
                if (kategorija == null)
                {
                    return BadRequest("Ne postoji kategorija s šifrom " + sifra + " u bazi");
                }
                var vjezbac = _context.Vjezbaci.Find(vjezbacSifra);
                if (vjezbac == null)
                {
                    return BadRequest("Ne postoji vjezbac s šifrom " + vjezbacSifra + " u bazi");
                }
                kategorija.Vjezbaci.Add(vjezbac);
                _context.Kategorije.Update(kategorija);
                _context.SaveChanges();
                return Ok(new
                {
                    poruka = "Vjezbac " + vjezbac.Prezime + " " + vjezbac.Ime + " dodan na kategoriju "
                 + kategorija.Naziv
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
                return BadRequest("Šifra kategorije ili vježbača nije dobra");
            }
            try
            {
                var kategorija = _context.Kategorije.FirstOrDefault(g => g.Sifra == sifra);
                if (kategorija == null)
                {
                    return BadRequest("Ne postoji kategorija s šifrom " + sifra + " u bazi");
                }

                var vjezbac = _context.Vjezbaci.Include(v => v.Kategorija).FirstOrDefault(v => v.Sifra == vjezbacSifra);
                if (vjezbac == null)
                {
                    return BadRequest("Ne postoji vježbač s šifrom " + vjezbacSifra + " u bazi");
                }

                if (vjezbac.Kategorija.Sifra != sifra)
                {
                    return BadRequest("Vježbač nije dodijeljen ovoj kategoriji");
                }

                int pocetnikSifra = 1;
                var pocetnikKategorija = _context.Kategorije.Find(pocetnikSifra);
                if (pocetnikKategorija == null)
                {
                    return BadRequest("Nema definirana kategorija Početnik u bazi");
                }

                vjezbac.Kategorija = pocetnikKategorija;
                _context.Vjezbaci.Update(vjezbac);
                _context.SaveChanges();

                return Ok(new
                {
                    poruka = $"Vježbač {vjezbac.Prezime} {vjezbac.Ime} je premješten u kategoriju Početnik"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }





    }
}