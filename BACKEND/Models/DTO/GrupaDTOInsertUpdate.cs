﻿using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models.DTO
{
    public record GrupaDTOInsertUpdate(
        [Required(ErrorMessage = "Naziv obavezno")]
        string Naziv,
        [Range(1, int.MaxValue, ErrorMessage = "{0} mora biti između {1} i {2}")]
        [Required(ErrorMessage = "Program obavezno")]
        int ProgramSifra,
        string Trener
        );


}