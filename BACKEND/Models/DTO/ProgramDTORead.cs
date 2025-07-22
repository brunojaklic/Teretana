namespace BACKEND.Models.DTO
{
    public record ProgramDTORead(
        int Sifra,
        string Naziv,
        decimal? Cijena,
        bool Aktivan
        );


}