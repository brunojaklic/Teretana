using BACKEND.Models;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Data
{
    /// <summary>
    /// Predstavlja kontekst baze podataka za teretanu, omogućuje pristup entitetima i konfiguraciju modela.
    /// </summary>
    public class TeretanaContext : DbContext
    {
        /// <summary>
        /// Inicijalizira novi primjerak TeretanaContext klase s navedenim opcijama.
        /// </summary>
        /// <param name="opcije">Opcije za konfiguraciju konteksta baze podataka.</param>
        public TeretanaContext(DbContextOptions<TeretanaContext> opcije) : base(opcije)
        {

        }

        /// <summary>
        /// Skup podataka za entitet TreningProgram.
        /// </summary>
        public DbSet<BACKEND.Models.TreningProgram> Programi { get; set; }

        /// <summary>
        /// Skup podataka za entitet Vjezbac.
        /// </summary>
        public DbSet<Vjezbac> Vjezbaci { get; set; }

        /// <summary>
        /// Skup podataka za entitet Grupa.
        /// </summary>
        public DbSet<Grupa> Grupe { get; set; }

        /// <summary>
        /// Skup podataka za entitet Kategorija.
        /// </summary>
        public DbSet<Kategorija> Kategorije { get; set; }

        /// <summary>
        /// Skup podataka za entitet Operater.
        /// </summary>
        public DbSet<Operater> Operateri { get; set; }

        /// <summary>
        /// Konfigurira odnose između entiteta i dodatne postavke modela.
        /// </summary>
        /// <param name="modelBuilder">Objekt za izgradnju modela.</param>
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