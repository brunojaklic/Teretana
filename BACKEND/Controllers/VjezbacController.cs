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
    public class VjezbacController(EdunovaContext context, IMapper mapper) : TeretanaController(context, mapper)
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



    }
}