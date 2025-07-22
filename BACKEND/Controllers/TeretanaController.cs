using AutoMapper;
using BACKEND.Data;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{

    public abstract class EdunovaController : ControllerBase
    {

        protected readonly EdunovaContext _context;

        protected readonly IMapper _mapper;


        public EdunovaController(EdunovaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

    }
}