namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis koji predstavlja podatke o kategoriji za čitanje.
    /// Sadrži šifru, naziv i opcionalnu cijenu kategorije.
    /// </summary>
    public record KategorijaDTORead(
        int Sifra,
        string Naziv,
        decimal? Cijena);


}