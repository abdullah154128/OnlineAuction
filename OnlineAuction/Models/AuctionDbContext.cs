using Microsoft.EntityFrameworkCore;

namespace OnlineAuction.Models
{
    public class AuctionDbContext : DbContext
    {
        public AuctionDbContext(DbContextOptions<AuctionDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<AuctionItem> AuctionItems { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<ItemImage> ItemImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. AuctionItem → Bids (cascade delete)
            modelBuilder.Entity<Bid>()
                .HasOne(b => b.AuctionItem)
                .WithMany(a => a.Bids)
                .HasForeignKey(b => b.AuctionItemId)
                .OnDelete(DeleteBehavior.Cascade); // safe, only one path

            // 2. User → Bids (no cascade, prevent multiple cascade paths)
            modelBuilder.Entity<Bid>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bids)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict); // avoids SQL Server error

            // 5. AuctionItem → Category (no cascade)
            modelBuilder.Entity<AuctionItem>()
                .HasOne(a => a.Category)
                .WithMany(c => c.AuctionItems)
                .HasForeignKey(a => a.CategoryId)
                .OnDelete(DeleteBehavior.Restrict); // categories stay even if items are deleted
        }
    }
}