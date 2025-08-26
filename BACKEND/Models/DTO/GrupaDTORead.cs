namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis za prikaz podataka o grupi, uključujući šifru, naziv, naziv programa i trenera.
    /// </summary>
    public record GrupaDTORead(
        int Sifra,
        string Naziv,
        string ProgramNaziv,
        string Trener
        );


}