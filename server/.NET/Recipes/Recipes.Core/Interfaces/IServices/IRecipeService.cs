using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IServices
{
    public interface IRecipeService
    {
        public Task<IEnumerable<Recipe>> GetFullAsync();

        public Task<Recipe?> GetFullByIdAsync(int id);

        public Task<IEnumerable<RecipeDto>> GetAsync();

        public Task<RecipeDto?> GetByIdAsync(int id);

        //public Task<IEnumerable<RecipeDto>> GetByCategoryAsync(string category);

        public Task<IEnumerable<RecipeDto>> GetPublicRecipesAsync();

        public Task<IEnumerable<RecipeDto>> GetPrivateRecipesAsync(int id);

        public Task<RecipeDto> AddAsync(RecipeDto r);

        public Task<RecipeDto> AddRecipeToUserAsync(int userId, int recipeId);
        
        public Task<RecipeDto> AddNewRecipeToUserAsync(int userId, RecipeDto recipeDto);

        public Task<RecipeDto> UpdateAsync(int id, RecipeDto r);

        public Task<RecipeDto> UpdateImgAsync(int recipeId, string url);

        public Task<bool> DeleteAsync(int id);

        public Task<bool> DeleteImageAsync(int id);

        public Task<bool> DeleteRecipeAsync(User user, Recipe recipe);

        public Task<bool> UpdatePublicAsync(int id);
    }
}

//public Task<RecipeDto> AddRecipeToUserAsync(int userId, RecipeDto recipeDto);