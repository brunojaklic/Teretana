using AutoMapper;
using BACKEND.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    /// <summary>
    /// Apstraktna bazna klasa za sve kontrolere vezane uz teretanu.
    /// Sadrži zajedničke resurse kao što su kontekst baze podataka i mapper.
    /// </summary>
    [Authorize]
    public abstract class TeretanaController : ControllerBase
    {
        /// <summary>
        /// Kontekst baze podataka za pristup podacima teretane.
        /// </summary>
        protected readonly TeretanaContext _context;

        /// <summary>
        /// Mapper za mapiranje između entiteta i DTO objekata.
        /// </summary>
        protected readonly IMapper _mapper;

        /// <summary>
        /// Inicijalizira novu instancu klase TeretanaController s navedenim kontekstom i mapperom.
        /// </summary>
        /// <param name="context">Kontekst baze podataka.</param>
        /// <param name="mapper">Mapper za mapiranje objekata.</param>
        public TeretanaController(TeretanaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
    }
}