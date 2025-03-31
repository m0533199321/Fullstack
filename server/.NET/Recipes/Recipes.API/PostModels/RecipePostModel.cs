using Recipes.Core.Entities;

namespace Recipes.API.PostModels
{
    public class RecipePostModel
    {
        public string Title { get; set; }

        public int Degree { get; set; }

        public string Path { get; set; }

        //public string Picture { get; set; }

        public CategoryType Category { get; set; }
    }
}
