using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    public record ProgramDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
        string Naziv,
        [Range(0, 10000, ErrorMessage = "Vrijednost {0} mora biti između {1} i {2}")]
        decimal? Cijena,
        bool Aktivan
        );
}