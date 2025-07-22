using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Vjezbac : Entitet
    {

        public string Ime { get; set; } = "";
        public string Prezime { get; set; } = "";
        public string? Email { get; set; }

        [ForeignKey("kategorija")]
        public required Kategorija Kategorija { get; set; }

        public ICollection<Grupa>? Grupe { get; set; } = [];

    }
}
