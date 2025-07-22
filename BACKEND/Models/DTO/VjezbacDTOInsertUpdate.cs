using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
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