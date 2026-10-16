using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineAuction.Models
{
    public class Bid
    {
        public int Id { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        public DateTime BidTime { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public int AuctionItemId { get; set; }
        public AuctionItem AuctionItem { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
