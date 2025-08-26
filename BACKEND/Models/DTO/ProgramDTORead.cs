namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis za prikaz podataka o programu.
    /// Sadrži šifru, naziv, cijenu i status aktivnosti programa.
    /// </summary>
    public record ProgramDTORead(
        int Sifra,
        string Naziv,
        decimal? Cijena,
        bool Aktivan
        );


}