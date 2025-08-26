namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis za prikaz podataka o vježbaču.
    /// Sadrži šifru, ime, prezime, email, sliku i naziv kategorije.
    /// </summary>
    public record VjezbacDTORead(
        int Sifra,
        string Ime,
        string Prezime,
        string? Email,
        string? Slika,
        string KategorijaNaziv
        );


}