namespace Recipes.API.PostModels
{
    public class CommentPostModel
    {
        public int RecipeId { get; set; }

        public int UserId { get; set; }

        public string Content { get; set; }
    }
}
