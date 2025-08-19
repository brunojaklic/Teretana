namespace BACKEND.Models.DTO
{
    public record VjezbacDTORead(
        int Sifra,
        string Ime,
        string Prezime,
        string? Email,
        string? Slika,
        string KategorijaNaziv
        );


}