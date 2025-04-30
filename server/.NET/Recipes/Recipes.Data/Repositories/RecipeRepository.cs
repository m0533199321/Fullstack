using Microsoft.EntityFrameworkCore;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IRepository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Data.Repositories
{
    public class RecipeRepository : Repository<Recipe>, IRecipeRepository
    {
        private readonly DbSet<Recipe> _dbset; 
        public RecipeRepository(DataContext dataContext)
            : base(dataContext)
        {
            _dbset = dataContext.Set<Recipe>();
        }

        public async Task<IEnumerable<Recipe>> GetFullAsync()
        {
            return await _dbset.Include(r => r.UsersList).Include(r => r.CommentsList).ToListAsync();
        }

        public async Task<Recipe?> GetFullByIdAsync(int id)
        {
            return await _dbset.Where(u => u.Id == id)
                 .Include(r => r.UsersList).Include(r => r.CommentsList).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Recipe>> GetPublicRecipesAsync()
        {
            var allRecipes = await _dbset.Include(r => r.CommentsList).ToListAsync();
            return allRecipes.Where(r => r.IsPublic);
        }

        public async Task<IEnumerable<Recipe>> GetPrivateRecipesAsync(int id)
        {
            var allRecipes = await _dbset.Include(r => r.UsersList).ToListAsync();
            return allRecipes.Where(r => r.UsersList.Find(u => u.Id == id) != null);
        }

        //public async Task<IEnumerable<Recipe>> GetByCategoryAsync(string category)
        //{
        //    if (Enum.TryParse<CategoryType>(category, out var categoryType))
        //    {
        //        var categoryAll =  await _dbset.Where(c => c.Category == categoryType).ToListAsync();
        //        return categoryAll.Where(c => c.IsPublic);
        //    }
        //    else
        //    {
        //        return null;
        //    }
        //}

        public async Task<Recipe> AddRecipeAsync(User user, Recipe r)
        {
            r.UsersList.Add(user);
            await _dbset.AddAsync(r);
            return r;
        }

        public async Task<Recipe> AddRecipeToUserAsync(User user, Recipe recipe)
        {
            var recipes = await GetPrivateRecipesAsync(user.Id);
            var existsRecipe = recipes.Where(r => r.Id == recipe.Id).FirstOrDefault();
            if (existsRecipe == null)
            {
                user.RecipesList.Add(recipe);
                return recipe;
            }
            return null;
        }

        //public async Task<bool> DeleteRecipeAsync(User user, Recipe recipe)
        //{
        //    var existRecipe = user.RecipesList.Any(r => r.Id == recipe.Id);

        //    if (existRecipe)
        //    {
        //        if (recipe.UsersList.Contains(user))
        //        {
        //            recipe.UsersList.Remove(user);
        //        }
        //        if (!recipe.IsPublic && !recipe.UsersList.Any())
        //        {
        //            await DeleteAsync(recipe.Id);
        //        }
        //        return true;
        //    }
        //    return false;
        //}

        public async Task<bool> UpdatePublicAsync(int id)
        {
            var recipe = await GetByIdAsync(id);
            if (recipe != null)
            {
                recipe.IsPublic = true;
                return true;
            }
            return false;
        }

        public async Task<Recipe?> UpdateImgAsync(int recipeId, string url)
        {
            var recipe = await GetByIdAsync(recipeId);
            if (recipe != null)
            {
                recipe.Picture = url;
                return recipe;
            }
            return null;
        }


    }
}
