namespace Recipes.API.PostModels
{
    public class CommentPostModel
    {
        public int RecipeId { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
