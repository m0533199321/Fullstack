using AutoMapper;
using Org.BouncyCastle.Asn1.Ocsp;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IRepository;
using Recipes.Core.Interfaces.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Recipes.Service.Services
{
    public class RecipeService(IRepositoryManager repositoryManager, IMapper mapper) : IRecipeService
    {
        private readonly IRepositoryManager _iManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

        public async Task<IEnumerable<RecipeDto>> GetAsync()
        {
            var recipes = await _iManager._recipeRepository.GetAsync();
            var RecipesDto = _mapper.Map<IEnumerable<RecipeDto>>(recipes);
            return RecipesDto;
        }

        public async Task<IEnumerable<Recipe>> GetFullAsync()
        {
            var recipes = await _iManager._recipeRepository.GetFullAsync();
            return recipes;
        }

        public async Task<Recipe?> GetFullByIdAsync(int id)
        {
            var recipe = await _iManager._recipeRepository.GetFullByIdAsync(id);
            return recipe;
        }

        public async Task<RecipeDto?> GetByIdAsync(int id)
        {
            var recipe = await _iManager._recipeRepository.GetByIdAsync(id);
            var recipeDto = _mapper.Map<RecipeDto>(recipe);
            return recipeDto;
        }

        //public async Task<IEnumerable<RecipeDto>> GetByCategoryAsync(string category)
        //{
        //    var recipes = await _iManager._recipeRepository.GetByCategoryAsync(category);
        //    var recipesDto = _mapper.Map<IEnumerable<RecipeDto>>(recipes);
        //    return recipesDto;
        //}

        public async Task<IEnumerable<RecipeDto>> GetPublicRecipesAsync()
        {
            var recipes = await _iManager._recipeRepository.GetPublicRecipesAsync();
            var recipesDto = _mapper.Map<IEnumerable<RecipeDto>>(recipes);
            return recipesDto;
        }
        public async Task<IEnumerable<RecipeDto>> GetPrivateRecipesAsync(int id)
        {
            var recipes = await _iManager._recipeRepository.GetPrivateRecipesAsync(id);
            var recipesDto = _mapper.Map<IEnumerable<RecipeDto>>(recipes);
            return recipesDto;
        }

        public async Task<RecipeDto> AddAsync(RecipeDto recipeDto)
        {
            var recipe = _mapper.Map<Recipe>(recipeDto);
            recipe = await _iManager._recipeRepository.AddAsync(recipe);
            if (recipe != null)
            {
                await _iManager.SaveAsync();
                recipeDto = _mapper.Map<RecipeDto>(recipe);
                return recipeDto;
            }
            return null;
        }

        //public async Task<RecipeDto> AddRecipeToUserAsync(int userId, RecipeDto recipeDto)
        //{
        //    var user = await _iManager._userRepository.GetFullByIdAsync(userId);
        //    var recipe = _mapper.Map<Recipe>(recipeDto);
        //    recipe = await _iManager._recipeRepository.AddRecipeToUserAsync(user, recipe);
        //    if (recipe != null)
        //    { 
        //        await _iManager.SaveAsync();
        //    }
        //    recipeDto = _mapper.Map<RecipeDto>(recipe);
        //    return recipeDto;
        //}

        public async Task<RecipeDto> AddNewRecipeToUserAsync(int userId, RecipeDto recipeDto)
        {
            var user = await _iManager._userRepository.GetFullByIdAsync(userId);
            //var recipe = await _iManager._recipeRepository.GetByIdAsync(recipeId);
            var recipe = _mapper.Map<Recipe>(recipeDto);
            recipe = await _iManager._recipeRepository.AddRecipeToUserAsync(user, recipe);
            if (recipe != null)
            {
                await _iManager.SaveAsync();
                recipeDto = _mapper.Map<RecipeDto>(recipe);
                return recipeDto;
            }
            return null;
        }

        public async Task<RecipeDto> AddRecipeToUserAsync(int userId, int recipeId)
        {
            var user = await _iManager._userRepository.GetFullByIdAsync(userId);
            var recipe = await _iManager._recipeRepository.GetByIdAsync(recipeId);
            recipe = await _iManager._recipeRepository.AddRecipeToUserAsync(user, recipe);
            if (recipe != null)
            {
                await _iManager.SaveAsync();
                var recipeDto = _mapper.Map<RecipeDto>(recipe);
                return recipeDto;
            }
            return null;
        }

        public async Task<RecipeDto> UpdateAsync(int id, RecipeDto recipeDto)
        {
            var recipe = _mapper.Map<Recipe>(recipeDto);
            recipe = await _iManager._recipeRepository.UpdateAsync(id, recipe);
            if (recipe != null)
            {
                await _iManager.SaveAsync();
                recipeDto = _mapper.Map<RecipeDto>(recipe);
                return recipeDto;
            }
            return null;
        }
        public async Task<RecipeDto> UpdateImgAsync(int recipeId, string url)
        {
            var recipe = await _iManager._recipeRepository.UpdateImgAsync(recipeId, url);
            if (recipe != null)
            {
                await _iManager.SaveAsync();
                var recipeDto = _mapper.Map<RecipeDto>(recipe);
                return recipeDto;
            }
            return null;

        }

        public async Task<bool> UpdatePublicAsync(int id)
        {
            var update = await _iManager._recipeRepository.UpdatePublicAsync(id);
            await _iManager.SaveAsync();
            return update;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var recipe = await GetFullByIdAsync(id);
            if (recipe != null)
            {
                await _iManager._recipeRepository.DeleteAsync(id);
                await _iManager.SaveAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteRecipeAsync(User user, Recipe recipe)
        {
            //if (user.RecipesList.Any(r => r.Id == recipe.Id))
            //{
            user.RecipesList.Remove(recipe);
            if (!recipe.IsPublic)
                await _iManager._recipeRepository.DeleteAsync(recipe.Id);
            await _iManager.SaveAsync();
            return true;
            //}
            //return false;
        }

    }
}
