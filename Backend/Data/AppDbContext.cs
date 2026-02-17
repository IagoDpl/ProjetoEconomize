using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        { 
        }

        public DbSet<Carteira> Carteiras { get; set; }
        public DbSet<Despesa> Despesas { get; set; }
        public DbSet<Planejamento> Planejamentos { get; set; }
    }
}
