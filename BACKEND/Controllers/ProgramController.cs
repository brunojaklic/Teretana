using BACKEND.Data;
using Microsoft.AspNetCore.Mvc;

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




    }
}
