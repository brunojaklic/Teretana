using AutoMapper;
using BACKEND.Models;
using BACKEND.Models.DTO;

namespace BACKEND.Mapping
{
    public class TeretanaMappingProfile : Profile
    {
        public TeretanaMappingProfile()
        {
            CreateMap<TreningProgram, ProgramDTORead>();
            CreateMap<ProgramDTOInsertUpdate, TreningProgram>();
            CreateMap<TreningProgram, ProgramDTOInsertUpdate>();

            CreateMap<Grupa, GrupaDTORead>()
                .ForCtorParam("ProgramNaziv", opt => opt.MapFrom(src => src.Program.Naziv));
            CreateMap<Grupa, GrupaDTOInsertUpdate>()
                .ForMember(dest => dest.ProgramSifra, opt => opt.MapFrom(src => src.Program.Sifra));
            CreateMap<GrupaDTOInsertUpdate, Grupa>();

            CreateMap<Kategorija, KategorijaDTORead>();
            CreateMap<KategorijaDTOInsertUpdate, Kategorija>();
            CreateMap<Kategorija, KategorijaDTOInsertUpdate>();

            CreateMap<Vjezbac, VjezbacDTORead>()
                .ForMember(dest => dest.KategorijaNaziv, opt => opt.MapFrom(src => src.Kategorija.Naziv));
            CreateMap<VjezbacDTOInsertUpdate, Vjezbac>()
                .ForMember(dest => dest.Kategorija, opt => opt.Ignore());
            CreateMap<Vjezbac, VjezbacDTOInsertUpdate>();
        }
    }
}
