using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using OnlineAuction.Models;

namespace OnlineAuction.Area.Admin.Controllers
{
    public class AuctionItemsController : Controller
    {
        private readonly AuctionDbContext _context;

        public AuctionItemsController(AuctionDbContext context)
        {
            _context = context;
        }

        // GET: AuctionItems
        public async Task<IActionResult> Index()
        {
            var auctionDbContext = _context.AuctionItems.Include(a => a.Category).Include(a => a.Seller);
            return View(await auctionDbContext.ToListAsync());
        }

        // GET: AuctionItems/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var auctionItem = await _context.AuctionItems
                .Include(a => a.Category)
                .Include(a => a.Seller)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (auctionItem == null)
            {
                return NotFound();
            }

            return View(auctionItem);
        }

        // GET: AuctionItems/Create
        public IActionResult Create()
        {
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name");
            ViewData["SellerId"] = new SelectList(_context.Users, "Id", "Email");
            return View();
        }

        // POST: AuctionItems/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Title,Description,StartingPrice,CurrentPrice,StartTime,EndTime,IsClosed,SellerId,CategoryId")] AuctionItem auctionItem)
        {
            if (ModelState.IsValid)
            {
                _context.Add(auctionItem);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", auctionItem.CategoryId);
            ViewData["SellerId"] = new SelectList(_context.Users, "Id", "Email", auctionItem.SellerId);
            return View(auctionItem);
        }

        // GET: AuctionItems/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var auctionItem = await _context.AuctionItems.FindAsync(id);
            if (auctionItem == null)
            {
                return NotFound();
            }
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", auctionItem.CategoryId);
            ViewData["SellerId"] = new SelectList(_context.Users, "Id", "Email", auctionItem.SellerId);
            return View(auctionItem);
        }

        // POST: AuctionItems/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Title,Description,StartingPrice,CurrentPrice,StartTime,EndTime,IsClosed,SellerId,CategoryId")] AuctionItem auctionItem)
        {
            if (id != auctionItem.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(auctionItem);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AuctionItemExists(auctionItem.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", auctionItem.CategoryId);
            ViewData["SellerId"] = new SelectList(_context.Users, "Id", "Email", auctionItem.SellerId);
            return View(auctionItem);
        }

        // GET: AuctionItems/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var auctionItem = await _context.AuctionItems
                .Include(a => a.Category)
                .Include(a => a.Seller)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (auctionItem == null)
            {
                return NotFound();
            }

            return View(auctionItem);
        }

        // POST: AuctionItems/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var auctionItem = await _context.AuctionItems.FindAsync(id);
            if (auctionItem != null)
            {
                _context.AuctionItems.Remove(auctionItem);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AuctionItemExists(int id)
        {
            return _context.AuctionItems.Any(e => e.Id == id);
        }
    }
}
