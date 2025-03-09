namespace Recipes.API.PostModels
{
    public class CommentPostModel
    {
        public string Id { get; set; }

        public string RecipeId { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
