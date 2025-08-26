using AutoMapper;
using BACKEND.Models;
using BACKEND.Models.DTO;

namespace BACKEND.Mapping
{
    /// <summary>
    /// AutoMapper profil za mapiranje entiteta i DTO objekata vezanih uz teretanu.
    /// Definira pravila mapiranja između modela baze podataka i DTO klasa.
    /// </summary>
    public class TeretanaMappingProfile : Profile
    {
        /// <summary>
        /// Inicijalizira nova pravila mapiranja između entiteta i DTO objekata.
        /// </summary>
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
                .ConstructUsing(entitet => new VjezbacDTORead(
                    entitet.Sifra ?? 0,
                    entitet.Ime ?? "",
                    entitet.Prezime ?? "",
                    entitet.Email ?? "",
                    PutanjaDatoteke(entitet),
                    entitet.Kategorija.Naziv));
            CreateMap<VjezbacDTOInsertUpdate, Vjezbac>()
                .ForMember(dest => dest.Kategorija, opt => opt.Ignore());
            CreateMap<Vjezbac, VjezbacDTOInsertUpdate>();

            CreateMap<Grupa, GrafGrupaDTO>()
                .ConstructUsing(entitet =>
                    new GrafGrupaDTO(
                        entitet.Naziv ?? "",
                        entitet.Vjezbaci == null ? 0 : entitet.Vjezbaci.Count()));
        }

        /// <summary>
        /// Vraća relativnu putanju do slike vježbača ako slika postoji, inače vraća null.
        /// </summary>
        /// <param name="e">Vježbač za kojeg se traži putanja slike.</param>
        /// <returns>Relativna putanja do slike ili null ako slika ne postoji.</returns>
        private static string? PutanjaDatoteke(Vjezbac e)
        {
            try
            {
                var ds = Path.DirectorySeparatorChar;
                string slika = Path.Combine(Directory.GetCurrentDirectory()
                    + ds + "wwwroot" + ds + "slike" + ds + "vjezbaci" + ds + e.Sifra + ".png");
                return File.Exists(slika) ? "/slike/vjezbaci/" + e.Sifra + ".png" : null;
            }
            catch
            {
                return null;
            }
        }

    }
}
