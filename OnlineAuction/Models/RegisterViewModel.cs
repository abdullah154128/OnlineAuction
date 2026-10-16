using System.ComponentModel.DataAnnotations;

namespace OnlineAuction.Models
{
    public class RegisterViewModel
    {
        [Required, MaxLength(100)]
        public string FullName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, DataType(DataType.Password)]
        public string Password { get; set; }

        [Required, DataType(DataType.Password), Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }

        // Add Accept Terms
        [Required(ErrorMessage = "You must accept the terms")]
        public bool AcceptTerms { get; set; }
    }
}