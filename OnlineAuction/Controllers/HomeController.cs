using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineAuction.Models;

namespace OnlineAuction.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AuctionDbContext _context;

        public HomeController(ILogger<HomeController> logger, AuctionDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            var products = _context.AuctionItems
                .Include(p => p.Category)
                .Include(p => p.Bids)
                .Include(p => p.Images)
                .Where(p => !p.IsClosed) // only active auctions
                .OrderByDescending(p => p.StartTime) // newest first
                .Take(12) // homepage limit
                .ToList();

            return View(products);
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Detail(int id)
        {
            var product = _context.AuctionItems
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Bids)
                    .ThenInclude(b => b.User) // 🔥 THIS FIX
                .FirstOrDefault(p => p.Id == id);

            if (product == null) return NotFound();

            return View(product);
        }

        public IActionResult Store()
        {
            // Load all products for store page
            var products = _context.AuctionItems
                .Include(p => p.Category)
                .Include(p => p.Bids)
                .Include(p => p.Images)
                .ToList();

            return View(products);
        }

        public IActionResult Contact()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }


        [HttpPost]
        public async Task<IActionResult> PlaceBid(int itemId, decimal amount)
        {
            // Get logged in user (IMPORTANT: adjust if needed)
            var userId = HttpContext.Session.GetInt32("UserId");

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

            // ❌ Validation
            if (amount <= currentPrice)
            {
                TempData["Error"] = "Bid must be higher than current price!";
                return RedirectToAction("Detail");
            }

            if (item.IsClosed || item.EndTime < DateTime.Now)
            {
                TempData["Error"] = "Auction ended!";
                return RedirectToAction("Detail");
            }

            // ✅ Create bid
            var bid = new Bid
            {
                AuctionItemId = itemId,
                Amount = amount,
                UserId = userId.Value,
                BidTime = DateTime.Now
            };

            // ✅ Update item price
            item.CurrentPrice = amount;

            _context.Bids.Add(bid);
            _context.AuctionItems.Update(item);

            await _context.SaveChangesAsync();

            TempData["Success"] = "Bid placed successfully!";

            return RedirectToAction("Detail", new { id = itemId });

        }
    }
}