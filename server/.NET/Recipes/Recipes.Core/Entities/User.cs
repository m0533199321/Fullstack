using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string FName { get; set; }

        public string LName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public string Profile { get; set; }

        //public string Information { get; set; }

        //public bool IsDeleted { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<Recipe> RecipesList { get; set; }

        public List<Role> RolesList { get; set; }

        public User()
        {
            RecipesList = new List<Recipe>();
            RolesList = new List<Role>();
            CreatedAt = DateTime.UtcNow;
        }

        public override bool Equals(object obj)
        {
            if (obj is User user)
            {
                return this.Id == user.Id &&
                       this.FName == user.FName &&
                       this.LName == user.LName &&
                       this.Email == user.Email &&
                       this.Password == user.Password &&
                       this.Profile == user.Profile &&
                       //this.Information == user.Information &&
                       this.CreatedAt == user.CreatedAt;
            }
            return false;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, FName, LName, Email, Password, Profile, CreatedAt);
            //return HashCode.Combine(Id, FName, LName, Email, Password, Profile, Information, CreatedAt);
        }
    }
}
