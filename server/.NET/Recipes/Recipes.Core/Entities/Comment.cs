using Recipes.Core.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Entities
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        public int RecipeId { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public Comment()
        {
            CreatedAt = DateTime.UtcNow;
        }
    }
}
