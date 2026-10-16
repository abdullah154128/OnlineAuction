using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;

namespace OnlineAuction.Models
{
    public class AuctionItem
    {
        public int Id { get; set; }

        [Required, MaxLength(150)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal StartingPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? CurrentPrice { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public bool IsClosed { get; set; } = false;

        // Foreign Keys
        public int SellerId { get; set; }
        public User Seller { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        // Navigation
        public ICollection<Bid> Bids { get; set; }
        public ICollection<ItemImage> Images { get; set; }
    }
}
