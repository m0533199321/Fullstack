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
        public Task<IEnumerable<Recipe>> GetByCategoryAsync(string category);
        public Task<IEnumerable<Recipe>> GetPublicRecipesAsync();
        public Task<IEnumerable<Recipe>> GetPrivateRecipesAsync(int id);
        public Task<RecipeDto> AddAsync(RecipeDto r);
        public Task<bool> AddRecipeToUserAsync(int id, RecipeDto r);
        public Task<RecipeDto> UpdateAsync(int id, RecipeDto r);
        public Task<bool> DeleteAsync(int id);
        public Task<bool> UpdatePublicAsync(int id);
    }
}
