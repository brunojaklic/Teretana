 namespace BACKEND.Models.DTO
{
    /// <summary>
    /// DTO (Data Transfer Object) koji predstavlja grupu za grafički prikaz,
    /// sadrži naziv grupe i ukupan broj vježbača u toj grupi.
    /// </summary>
    public record GrafGrupaDTO(string NazivGrupe, int UkupnoVjezbaca);
}