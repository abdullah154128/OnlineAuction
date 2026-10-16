using System.ComponentModel.DataAnnotations;

namespace OnlineAuction.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required, MaxLength(80)]
        public string Name { get; set; }

        public string Description { get; set; }

        // Navigation
        public ICollection<AuctionItem> AuctionItems { get; set; }
    }
}
