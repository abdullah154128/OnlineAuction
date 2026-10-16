using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace OnlineAuction.Controllers
{
    public class AdminController : Controller
    {
        private bool IsAdmin()
        {
            return HttpContext.Session.GetString("UserRole") == "Admin";
        }

        public IActionResult Index()
        {
            if (!IsAdmin())
                return RedirectToAction("Index", "Home");

            return View();
        }

        public IActionResult Users()
        {
            if (!IsAdmin())
                return RedirectToAction("Index", "Home");

            return View();
        }

        public IActionResult Auctions()
        {
            if (!IsAdmin())
                return RedirectToAction("Index", "Home");

            return View();
        }

        public IActionResult Reports()
        {
            if (!IsAdmin())
                return RedirectToAction("Index", "Home");

            return View();
        }
    }
}