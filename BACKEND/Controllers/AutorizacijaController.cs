using BACKEND.Data;
using BACKEND.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace BACKEND.Controllers
{
    /// <summary>
    /// Kontroler za autorizaciju operatera i generiranje JWT tokena.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AutorizacijaController(TeretanaContext context) : ControllerBase
    {
        /// <summary>
        /// Kontekst baze podataka za pristup operaterima.
        /// </summary>
        private readonly TeretanaContext _context = context;

        /// <summary>
        /// Generira JWT token za operatera na temelju dostavljenih vjerodajnica (email i lozinka).
        /// Vraća token ako su vjerodajnice ispravne, inače vraća odgovarajuću grešku.
        /// </summary>
        /// <param name="operater">DTO objekt s emailom i lozinkom operatera.</param>
        /// <returns>JWT token ili status greške.</returns>
        [HttpPost("token")]
        public IActionResult GenerirajToken(OperaterDTO operater)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var operBaza = _context.Operateri
                   .Where(p => p.Email!.Equals(operater.Email))
                   .FirstOrDefault();

            if (operBaza == null)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani, ne mogu naći operatera");
            }

            if (!BCrypt.Net.BCrypt.Verify(operater.Password, operBaza.Lozinka))
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Niste autorizirani, lozinka ne odgovara");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("MojKljucKojijeJakoTajan i dovoljno dugačak da se može koristiti");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Expires = DateTime.UtcNow.Add(TimeSpan.FromHours(8)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return Ok(jwt);
        }
    }
}