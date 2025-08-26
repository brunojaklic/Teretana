using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis za umetanje ili ažuriranje grupe.
    /// Sadrži podatke o nazivu grupe, šifri programa i treneru.
    /// </summary>
    public record GrupaDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
            string Naziv,
        [Range(1, int.MaxValue, ErrorMessage = "{0} mora biti između {1} i {2}")]
            [Required(ErrorMessage = "Program obavezno")]
            int ProgramSifra,
        string Trener
    );


}