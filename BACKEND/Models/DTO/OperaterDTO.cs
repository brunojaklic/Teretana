using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO zapis koji predstavlja operatera s obaveznim poljima za email i lozinku.
    /// </summary>
    public record OperaterDTO(
       [Required(ErrorMessage = "Email je obavezan.")]
                string Email,
       [Required(ErrorMessage = "Lozinka je obavezna.")]
                string Password);
}