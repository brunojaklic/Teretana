using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis koji predstavlja sliku kodiranu u Base64 formatu.
    /// </summary>
    public record SlikaDTO(
        [Required(ErrorMessage = "Zapis slike obavezno")] string Base64);
}
