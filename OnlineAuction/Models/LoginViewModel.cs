using System.ComponentModel.DataAnnotations;

namespace OnlineAuction.Models
{
    public class LoginViewModel
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, DataType(DataType.Password)]
        public string Password { get; set; }

        // Add Remember Me
        public bool RememberMe { get; set; }
    }
}