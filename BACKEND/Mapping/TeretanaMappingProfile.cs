using AutoMapper;
using BACKEND.Models;
using BACKEND.Models.DTO;

namespace BACKEND.Mapping
{
    public class TeretanaMappingProfile : Profile
    {
        public TeretanaMappingProfile()
        {
            CreateMap<Program, ProgramDTORead>();
            CreateMap<ProgramDTOInsertUpdate, Program>();
            CreateMap<Program, ProgramDTOInsertUpdate>();

            CreateMap<Grupa, GrupaDTORead>()
                .ForCtorParam("ProgramNaziv", opt => opt.MapFrom(src => src.Program.Naziv));
            CreateMap<Grupa, GrupaDTOInsertUpdate>()
                .ForMember(dest => dest.ProgramSifra, opt => opt.MapFrom(src => src.Program.Sifra));
            CreateMap<GrupaDTOInsertUpdate, Grupa>();

            CreateMap<Kategorija, KategorijaDTORead>();
            CreateMap<KategorijaDTOInsertUpdate, Kategorija>();
            CreateMap<Kategorija, KategorijaDTOInsertUpdate>();

            CreateMap<Vjezbac, VjezbacDTORead>()
                .ForMember(dest => dest.KategorijaSifra, opt => opt.MapFrom(src => src.Kategorija.Sifra));
            CreateMap<VjezbacDTOInsertUpdate, Vjezbac>()
                .ForMember(dest => dest.Kategorija, opt => opt.Ignore());
            CreateMap<Vjezbac, VjezbacDTOInsertUpdate>();
        }
    }
}
