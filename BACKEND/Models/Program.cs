﻿using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models
{
    public class Program : Entitet
    {
        public string Naziv { get; set; } = "";
        public decimal? Cijena { get; set; }
        public bool Aktivan { get; set; }

    }
}
