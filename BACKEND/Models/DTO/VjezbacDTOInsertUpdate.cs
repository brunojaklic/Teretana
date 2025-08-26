using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis za unos ili ažuriranje podataka o vježbaču.
    /// Sadrži osnovne informacije: ime, prezime, email i šifru kategorije.
    /// </summary>
    public record VjezbacDTOInsertUpdate(
        [Required(ErrorMessage = "Ime obavezno")]
            string Ime,
        [Required(ErrorMessage = "Prezime obavezno")]
            string Prezime,
        [EmailAddress(ErrorMessage ="Email nije dobrog formata")]
            string? Email,
        int KategorijaSifra
    );
}