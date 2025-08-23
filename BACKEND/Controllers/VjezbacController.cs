using System;
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
    public class VjezbacController(TeretanaContext context, IMapper mapper) : TeretanaController(context, mapper)
    {


        [HttpGet]
        public ActionResult<List<VjezbacDTORead>> Get()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var vjezbaci = _context.Vjezbaci
                    .Include(v => v.Kategorija)
                    .ToList();


                return Ok(_mapper.Map<List<VjezbacDTORead>>(vjezbaci));

            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }

        }


        [HttpGet]
        [Route("{sifra:int}")]
        public ActionResult<VjezbacDTOInsertUpdate> GetBySifra(int sifra)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            Vjezbac? e;
            try
            {
                e = _context.Vjezbaci
                .Include(v => v.Kategorija)
                .FirstOrDefault(v => v.Sifra == sifra);

            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
            if (e == null)
            {
                return NotFound(new { poruka = "Vježbač ne postoji u bazi" });
            }

            return Ok(_mapper.Map<VjezbacDTOInsertUpdate>(e));
        }

        [HttpPost]
        public IActionResult Post(VjezbacDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                var vjezbac = _mapper.Map<Vjezbac>(dto);

                var kategorija = _context.Kategorije.Find(dto.KategorijaSifra);
                if (kategorija == null)
                {
                    return BadRequest(new { poruka = "Ne postoji kategorija s danim ID-om." });
                }

                vjezbac.Kategorija = kategorija;

                _context.Vjezbaci.Add(vjezbac);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status201Created, _mapper.Map<VjezbacDTORead>(vjezbac));
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }


        [HttpPut]
        [Route("{sifra:int}")]
        [Produces("application/json")]
        public IActionResult Put(int sifra, VjezbacDTOInsertUpdate dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { poruka = ModelState });
            }
            try
            {
                Vjezbac? e;
                try
                {
                    e = _context.Vjezbaci.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound(new { poruka = "Vježbač ne postoji u bazi" });
                }

                e = _mapper.Map(dto, e);

                _context.Vjezbaci.Update(e);
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
                Vjezbac? e;
                try
                {
                    e = _context.Vjezbaci.Find(sifra);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { poruka = ex.Message });
                }
                if (e == null)
                {
                    return NotFound("Vježbač ne postoji u bazi");
                }
                _context.Vjezbaci.Remove(e);
                _context.SaveChanges();
                return Ok(new { poruka = "Uspješno obrisano" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        [Route("trazi/{uvjet}")]
        public ActionResult<List<VjezbacDTORead>> TraziVjezbac(string uvjet)
        {
            if (uvjet == null || uvjet.Length < 3)
            {
                return BadRequest(ModelState);
            }
            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Vjezbac> query = _context.Vjezbaci;
                var niz = uvjet.Split(" ");
                foreach (var s in uvjet.Split(" "))
                {
                    query = query.Where(p => p.Ime.ToLower().Contains(s) || p.Prezime.ToLower().Contains(s));
                }
                var vjezbaci = query.ToList();
                return Ok(_mapper.Map<List<VjezbacDTORead>>(vjezbaci));
            }
            catch (Exception e)
            {
                return BadRequest(new { poruka = e.Message });
            }
        }

        [HttpGet]
        [Route("traziStranicenje/{stranica}")]
        public IActionResult TraziVjezbacStranicenje(int stranica, string uvjet = "")
        {
            var poStranici = 4;
            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Vjezbac> query = _context.Vjezbaci;

                var niz = uvjet.Split(" ");
                foreach (var s in uvjet.Split(" "))
                {
                    query = query.Where(p => p.Ime.ToLower().Contains(s) || p.Prezime.ToLower().Contains(s));
                }
                query
                    .OrderBy(p => p.Prezime);
                var vjezbaci = query.ToList();
                var filtriranaLista = vjezbaci.Skip((poStranici * stranica) - poStranici).Take(poStranici);
                return Ok(_mapper.Map<List<VjezbacDTORead>>(filtriranaLista.ToList()));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpPut]
        [Route("postaviSliku/{sifra:int}")]
        public IActionResult PostaviSliku(int sifra, SlikaDTO slika)
        {
            if (sifra <= 0)
            {
                return BadRequest("Šifra mora biti veća od nula (0)");
            }
            if (slika.Zapis == null || slika.Zapis?.Length == 0)
            {
                return BadRequest("Slika nije postavljena");
            }
            var p = _context.Vjezbaci.Find(sifra);
            if (p == null)
            {
                return BadRequest("Ne postoji vježbač s šifrom " + sifra + ".");
            }
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string dir = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "vjezbaci");

                if (!System.IO.Directory.Exists(dir))
                {
                    System.IO.Directory.CreateDirectory(dir);
                }
                var putanja = Path.Combine(dir + ds + sifra + ".png");
                System.IO.File.WriteAllBytes(putanja, Convert.FromBase64String(slika.Zapis!));
                return Ok("Uspješno pohranjena slika");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("Generiraj/{broj:int}")]
        public IActionResult Generiraj(int broj)
        {
            var random = new Random();

            var kategorije = _context.Kategorije.ToList();

            for (int i = 0; i < broj; i++)
            {
                var randomKategorija = kategorije[random.Next(kategorije.Count)];

                var p = new Vjezbac
                {
                    Ime = Faker.Name.First(),
                    Prezime = Faker.Name.Last(),
                    Email = Faker.Internet.Email(),
                    Kategorija = randomKategorija
                };

                _context.Vjezbaci.Add(p);
            }

            _context.SaveChanges();
            return Ok();
        }




    }
}