using System.ComponentModel.DataAnnotations;

namespace OnlineAuction.Models
{
    public class ItemImage
    {
        public int Id { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        public bool IsPrimary { get; set; } = false;

        // Foreign Key
        public int AuctionItemId { get; set; }
        public AuctionItem AuctionItem { get; set; }
    }
}
