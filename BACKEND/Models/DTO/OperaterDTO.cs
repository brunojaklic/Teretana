using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    public record OperaterDTO(
       [Required(ErrorMessage = "Email je obavezan.")]
            string Email,
       [Required(ErrorMessage = "Lozinka je obavezna.")]
            string Password);
}