using AutoMapper;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IRepository;
using Recipes.Core.Interfaces.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Service.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;

        public RecipeService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _iManager = repositoryManager;
            _mapper = mapper;
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

        public async Task<IEnumerable<RecipeDto>> GetAsync()
        {
            var recipes = await _iManager._recipeRepository.GetAsync();
            var RecipesDto = _mapper.Map<IEnumerable<RecipeDto>>(recipes);
            return RecipesDto;
        }

        public async Task<RecipeDto?> GetByIdAsync(int id)
        {
            var recipe = await _iManager._recipeRepository.GetByIdAsync(id);
            var recipeDto = _mapper.Map<RecipeDto>(recipe);
            return recipeDto;
        }

        public async Task<IEnumerable<Recipe>> GetByCategoryAsync(string category)
        {
            return await _iManager._recipeRepository.GetByCategoryAsync(category);
        }

        public async Task<IEnumerable<Recipe>> GetPublicRecipesAsync()
        {
            return await _iManager._recipeRepository.GetPublicRecipesAsync();
        }
        public async Task<IEnumerable<Recipe>> GetPrivateRecipesAsync(int id)
        {
            return await _iManager._recipeRepository.GetPrivateRecipesAsync(id);
        }

        public async Task<RecipeDto> AddAsync(RecipeDto recipeDto)
        {
            var recipe = _mapper.Map<Recipe>(recipeDto);
            recipe = await _iManager._recipeRepository.AddAsync(recipe);
            if (recipe != null)
            {
                await _iManager.saveAsync();
                return recipeDto;
            }
            return null;
        }

        public async Task<bool> AddRecipeToUserAsync(int id, RecipeDto r)
        {
            var user = await _iManager._userRepository.GetFullByIdAsync(id);
            var recipe = _mapper.Map<Recipe>(r);
            await _iManager.saveAsync();
            return _iManager._recipeRepository.AddRecipeToUserAsync(user, recipe);
        }

        public async Task<RecipeDto> UpdateAsync(int id, RecipeDto recipeDto)
        {
            var recipe = _mapper.Map<Recipe>(recipeDto);
            recipe = await _iManager._recipeRepository.UpdateAsync(id, recipe);
            if (recipe != null)
            {
                await _iManager.saveAsync();
                recipeDto = _mapper.Map<RecipeDto>(recipe);
                return recipeDto;
            }
            return null;
        }

        public async Task<bool> UpdatePublicAsync(int id)
        {
            var update = await _iManager._recipeRepository.UpdatePublicAsync(id);
            await _iManager.saveAsync();
            return update;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var recipe = await GetFullByIdAsync(id);
            if (recipe != null)
            {
                foreach (var item in recipe.UsersList.ToList())
                {
                    _iManager._userRepository.DeleteUserAsync(item, recipe);
                }
                await _iManager._recipeRepository.DeleteAsync(id);
                await _iManager.saveAsync();
                return true;
            }
            return false;
        }
    }
}
