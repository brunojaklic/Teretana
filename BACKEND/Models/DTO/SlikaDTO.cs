using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    public record SlikaDTO([Required(ErrorMessage = "Zapis slike obavezno")] string Zapis);
}
