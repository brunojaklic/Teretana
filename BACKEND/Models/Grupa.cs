using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Grupa : Entitet
    {

        public string Naziv { get; set; } = "";

        [ForeignKey("program")]
        public required Program Program { get; set; }
        public string Trener { get; set; } = "";
        public ICollection<Vjezbac>? Vjezbaci { get; set; } = [];


    }
}
