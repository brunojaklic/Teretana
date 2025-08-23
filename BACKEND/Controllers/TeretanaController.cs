using AutoMapper;
using BACKEND.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    //[Authorize]
    public abstract class TeretanaController : ControllerBase
    {

        protected readonly TeretanaContext _context;

        protected readonly IMapper _mapper;


        public TeretanaController(TeretanaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

    }
}