using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Entities
{
    public enum CategoryType
    { BreakFast, Starters, Main_dishes, Extras, Soups, Salads, Pastries_breads, Desserts, Drinks }
    public class Recipe
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; }

        public bool IsPublic { get; set; }

        public int Degree { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Path { get; set; }

        public string Picture { get; set; }

        public bool IsDeleted { get; set; }

        //public CategoryType Category { get; set; }

        public List<Comment> CommentsList { get; set; }

        public List<User> UsersList { get; set; }

        public Recipe()
        {
            CommentsList = new List<Comment>();
            UsersList = new List<User>();
            CreatedAt = DateTime.UtcNow;
        }
    }
}
