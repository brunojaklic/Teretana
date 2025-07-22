namespace BACKEND.Models
{
    public class Kategorija : Entitet
    {

        public string Naziv { get; set; } = "";
        public decimal Cijena { get; set; }
        public ICollection<Vjezbac> Vjezbaci { get; set; } = [];
    }
}
