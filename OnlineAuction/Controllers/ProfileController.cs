using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineAuction.Models;

namespace OnlineAuction.Controllers
{
    public class ProfileController : Controller
    {
        private readonly AuctionDbContext _context;

        public ProfileController(AuctionDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return RedirectToAction("Login", "Account");

            var user = _context.Users.Find(userId);

            var listings = _context.AuctionItems
                .Include(a => a.Category)
                .Include(a => a.Images)
                .Where(a => a.SellerId == userId)
                .ToList();

            var bids = _context.Bids
                .Include(b => b.AuctionItem)
                .ThenInclude(a => a.Category)
                .Where(b => b.UserId == userId)
                .ToList();

            // Load categories for the form
            ViewBag.Categories = _context.Categories.ToList();

            var model = new ProfileViewModel
            {
                User = user,
                Listings = listings,
                Bids = bids
            };

            return View(model);
        }

        [HttpPost]
        public IActionResult CreateListing(AuctionItem item, int DurationDays, List<IFormFile> images)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return RedirectToAction("Login", "Account");

            item.SellerId = (int)userId;
            item.StartTime = DateTime.Now;
            item.EndTime = DateTime.Now.AddDays(DurationDays); // <-- use duration
            item.CurrentPrice = item.StartingPrice;
            item.IsClosed = false;

            _context.AuctionItems.Add(item);
            _context.SaveChanges();

            if (images != null && images.Count > 0)
            {
                foreach (var img in images)
                {
                    var fileName = Path.GetFileName(img.FileName);
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        img.CopyTo(stream);
                    }

                    _context.ItemImages.Add(new ItemImage
                    {
                        AuctionItemId = item.Id,
                        ImageUrl = "/uploads/" + fileName
                    });
                }
                _context.SaveChanges();
            }

            return RedirectToAction("Index");

        }

        [HttpPost]
        public IActionResult EditListing([FromBody] AuctionItem updated)
        {
            var item = _context.AuctionItems.Find(updated.Id);
            if (item == null) return NotFound();

            item.Title = updated.Title;
            item.Description = updated.Description;
            item.StartingPrice = updated.StartingPrice;

            // Find Category by Name
            var category = _context.Categories.FirstOrDefault(c => c.Name == updated.Category.Name);
            if (category != null) item.CategoryId = category.Id;

            _context.SaveChanges();
            return Ok();
        }

        [HttpPost]
        public IActionResult DeleteListing(int id)
        {
            var item = _context.AuctionItems.Include(a => a.Images).FirstOrDefault(a => a.Id == id);
            if (item == null) return NotFound();

            // Delete images first
            _context.ItemImages.RemoveRange(item.Images);
            _context.AuctionItems.Remove(item);
            _context.SaveChanges();
            return Ok();
        }
    }
}
