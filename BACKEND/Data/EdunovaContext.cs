using Microsoft.EntityFrameworkCore;

namespace BACKEND.Data
{
    public class EdunovaContext : DbContext
    {
        public EdunovaContext(DbContextOptions<EdunovaContext> options) : base(options)
        {
            // ovdje se mogu fino postaviti opcije, ali ne za sada
        }

        public DbSet<BACKEND.Models.Program> Programi { get; set; }
    }
}
