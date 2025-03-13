using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IRepository
{
    public interface IRecipeRepository: IRepository<Recipe>
    {
        public Task<IEnumerable<Recipe>> GetFullAsync();

        public Task<Recipe?> GetFullByIdAsync(int id);

        public Task<IEnumerable<Recipe>> GetPublicRecipesAsync();

        public Task<IEnumerable<Recipe>> GetPrivateRecipesAsync(int id);
         
        public Task<IEnumerable<Recipe>> GetByCategoryAsync(string category);

        public Task<Recipe> AddRecipeToUserAsync(User user, Recipe recipe);

        public Task<bool> UpdatePublicAsync(int id);
    }
}

//public Task<bool> DeleteRecipeAsync(User user,Recipe recipe);