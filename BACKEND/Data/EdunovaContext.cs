using BACKEND.Models;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Data
{
    public class EdunovaContext : DbContext
    {
        public EdunovaContext(DbContextOptions<EdunovaContext> opcije) : base(opcije)
        {

        }


        public DbSet<BACKEND.Models.TreningProgram> Programi { get; set; }

        public DbSet<Vjezbac> Vjezbaci { get; set; }

        public DbSet<Grupa> Grupe { get; set; }

        public DbSet<Kategorija> Kategorije { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Grupa>().HasOne(g => g.Program);

            modelBuilder.Entity<Vjezbac>().HasOne(v => v.Kategorija);

            modelBuilder.Entity<Grupa>()
                .HasMany(g => g.Vjezbaci)
                .WithMany(v => v.Grupe)
                .UsingEntity<Dictionary<string, object>>(
                    "clanovi",
                    c => c.HasOne<Vjezbac>().WithMany().HasForeignKey("vjezbac"),
                    c => c.HasOne<Grupa>().WithMany().HasForeignKey("grupa"),
                    c => c.ToTable("clanovi")
                );
        }



    }
}