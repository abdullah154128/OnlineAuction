using System.Collections.Generic;

namespace OnlineAuction.Models
{
    public class ProfileViewModel
    {
        public User User { get; set; }
        public List<AuctionItem> Listings { get; set; }
        public List<Bid> Bids { get; set; }
    }
}