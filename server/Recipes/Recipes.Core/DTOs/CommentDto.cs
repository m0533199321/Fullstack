using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.DTOs
{
    public class CommentDto
    {
        public string Id { get; set; }

        public string RecipeId { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
