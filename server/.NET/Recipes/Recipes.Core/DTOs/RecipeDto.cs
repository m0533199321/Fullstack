using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.DTOs
{
    public class RecipeDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public bool IsPublic { get; set; }

        public int Degree { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Path { get; set; }

        //public string Picture { get; set; }

        //public CategoryType Category { get; set; }
    }
}
