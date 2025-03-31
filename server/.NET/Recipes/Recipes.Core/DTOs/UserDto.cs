using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }

        public string FName { get; set; }

        public string LName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string Profile { get; set; }

        public string Information { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
