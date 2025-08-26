using System;
using AutoMapper;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{

    /// <summary>
    /// Kontroler za upravljanje entitetima Vježbač.
    /// Omogućuje dohvat, pretragu, dodavanje, ažuriranje, brisanje i generiranje vježbača.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class VjezbacController(TeretanaContext context, IMapper mapper) : TeretanaController(context, mapper)
    {
        /// <summary>
        /// Dohvaća sve vježbače iz baze podataka.
        /// </summary>
        /// <returns>Lista DTO objekata vježbača.</returns>
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

        /// <summary>
        /// Dohvaća vježbača prema šifri.
        /// </summary>
        /// <param name="sifra">Šifra vježbača.</param>
        /// <returns>DTO objekt vježbača za unos ili ažuriranje.</returns>
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

        /// <summary>
        /// Dodaje novog vježbača u bazu podataka.
        /// </summary>
        /// <param name="dto">DTO objekt za unos vježbača.</param>
        /// <returns>Status kreiranja i DTO objekt vježbača.</returns>
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

        /// <summary>
        /// Ažurira podatke postojećeg vježbača.
        /// </summary>
        /// <param name="sifra">Šifra vježbača.</param>
        /// <param name="dto">DTO objekt s novim podacima.</param>
        /// <returns>Status ažuriranja.</returns>
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

        /// <summary>
        /// Briše vježbača iz baze podataka.
        /// </summary>
        /// <param name="sifra">Šifra vježbača.</param>
        /// <returns>Status brisanja.</returns>
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

        /// <summary>
        /// Pretražuje vježbače prema uvjetu (ime ili prezime).
        /// </summary>
        /// <param name="uvjet">Uvjet pretrage (najmanje 3 znaka).</param>
        /// <returns>Lista pronađenih vježbača.</returns>
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
                IEnumerable<Vjezbac> query = _context.Vjezbaci.Include(x => x.Kategorija);
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

        /// <summary>
        /// Pretražuje vježbače prema uvjetu s podrškom za stranicenje.
        /// </summary>
        /// <param name="stranica">Broj stranice.</param>
        /// <param name="uvjet">Uvjet pretrage (opcionalno).</param>
        /// <returns>Lista pronađenih vježbača za zadanu stranicu.</returns>
        [HttpGet]
        [Route("traziStranicenje/{stranica}")]
        public IActionResult TraziVjezbacStranicenje(int stranica, string uvjet = "")
        {
            var poStranici = 4;
            uvjet = uvjet.ToLower();
            try
            {
                IEnumerable<Vjezbac> query = _context.Vjezbaci.Include(x => x.Kategorija);

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

        /// <summary>
        /// Postavlja sliku za vježbača.
        /// </summary>
        /// <param name="sifra">Šifra vježbača.</param>
        /// <param name="slika">DTO objekt slike (Base64 string).</param>
        /// <returns>Status pohrane slike.</returns>
        [HttpPut]
        [Route("postaviSliku/{sifra:int}")]
        public IActionResult PostaviSliku(int sifra, SlikaDTO slika)
        {
            if (sifra <= 0)
            {
                return BadRequest("Šifra mora biti veća od nula (0)");
            }
            if (slika.Base64 == null || slika.Base64?.Length == 0)
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
                System.IO.File.WriteAllBytes(putanja, Convert.FromBase64String(slika.Base64!));
                return Ok("Uspješno pohranjena slika");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        /// <summary>
        /// Generira nasumične vježbače i sprema ih u bazu podataka.
        /// </summary>
        /// <param name="broj">Broj vježbača za generiranje.</param>
        /// <returns>Status generiranja.</returns>
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