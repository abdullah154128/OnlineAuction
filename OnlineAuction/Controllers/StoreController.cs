using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineAuction.Models;

namespace OnlineAuction.Controllers
{
    public class StoreController : Controller
    {
        private readonly AuctionDbContext _context;

        public StoreController(AuctionDbContext context)
        {
            _context = context;
        }

        // ✅ STORE PAGE
        public async Task<IActionResult> Index()
        {
            var items = await _context.AuctionItems
                .Include(a => a.Category)
                .Include(a => a.Bids)
                .Include(a => a.Images)
                .OrderByDescending(a => a.StartTime)
                .ToListAsync();

            return View(items);
        }

        // ✅ DETAIL PAGE (same as Home)
        public async Task<IActionResult> Detail(int id)
        {
            var item = await _context.AuctionItems
                .Include(a => a.Category)
                .Include(a => a.Images)
                .Include(a => a.Bids)
                    .ThenInclude(b => b.User) // 🔥 IMPORTANT
                .FirstOrDefaultAsync(a => a.Id == id);

            if (item == null) return NotFound();

            return View(item);
        }

        // ✅ REAL BID SYSTEM (copied + fixed from HomeController)
        [HttpPost]
        public async Task<IActionResult> PlaceBid(int itemId, decimal amount)
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            // ❌ Not logged in
            if (userId == null)
            {
                TempData["Error"] = "Please login first.";
                return RedirectToAction("Login", "Account");
            }

            var item = await _context.AuctionItems
                .Include(a => a.Bids)
                .FirstOrDefaultAsync(a => a.Id == itemId);

            if (item == null)
                return NotFound();

            var currentPrice = item.CurrentPrice ?? item.StartingPrice;

            // ❌ Bid too low
            if (amount <= currentPrice)
            {
                TempData["Error"] = "Bid must be higher than current price!";
                return RedirectToAction("Detail", new { id = itemId });
            }

            // ❌ Auction ended
            if (item.IsClosed || item.EndTime < DateTime.Now)
            {
                TempData["Error"] = "Auction ended!";
                return RedirectToAction("Detail", new { id = itemId });
            }

            // ✅ Create bid
            var bid = new Bid
            {
                AuctionItemId = itemId,
                Amount = amount,
                UserId = userId.Value,
                BidTime = DateTime.Now
            };

            // ✅ Update price
            item.CurrentPrice = amount;

            _context.Bids.Add(bid);
            _context.AuctionItems.Update(item);

            await _context.SaveChangesAsync();

            TempData["Success"] = "Bid placed successfully!";

            return RedirectToAction("Detail", new { id = itemId });
        }
    }
}