using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Recipes.API.PostModels;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IServices;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Recipes.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecipeController : ControllerBase
    {
        private readonly IRecipeService _iService;
        private readonly IMapper _mapper;

        public RecipeController(IRecipeService iService, IMapper mapper)
        {
            _iService = iService;
            _mapper = mapper;
        }

        // GET: api/<Users>
        [HttpGet]
        public async Task<IEnumerable<RecipeDto>> Get()
        {
            return await _iService.GetAsync();
        }

        // GET-FULL: api/<Users>
        [HttpGet("Full")]
        public async Task<IEnumerable<Recipe>> GetFull()
        {
            return await _iService.GetFullAsync();
        }

        // GET api/<Users>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RecipeDto>> Get(int id)
        {
            RecipeDto recipeDto = await _iService.GetByIdAsync(id);
            if (recipeDto == null)
                return NotFound();
            return recipeDto;
        }

        // GET-FULL api/<Users>/5
        [HttpGet("Full/{id}")]
        public async Task<ActionResult<Recipe>> GetFull(int id)
        {
            Recipe recipe = await _iService.GetFullByIdAsync(id);
            if (recipe == null)
                return NotFound();
            return recipe;
        }

        // GET-CATEGORY: api/<Users>
        [HttpGet("Category/{category}")]
        public async Task<IEnumerable<Recipe>> GetCategory(string category)
        {
            return await _iService.GetByCategoryAsync(category);
        }

        // GET-PUBLIC: api/<Users>
        [HttpGet("Public")]
        [AllowAnonymous]
        public async Task<IEnumerable<Recipe>> GetPublicRecipes()
        {
            return await _iService.GetPublicRecipesAsync();
        }

        // GET-PRIVATE: api/<Users>/5
        [HttpGet("Private/{id}")]
        public async Task<IEnumerable<Recipe>> GetPrivateRecipes(int id)
        {
            return await _iService.GetPrivateRecipesAsync(id);
        }

        // POST api/<Users>
        [HttpPost]
        public async Task<ActionResult<RecipeDto>> Post([FromBody] RecipePostModel recipePostModel)
        {
            RecipeDto recipeDto = _mapper.Map<RecipeDto>(recipePostModel);
            recipeDto = await _iService.AddAsync(recipeDto);
            if (recipeDto == null)
                return NotFound();
            return recipeDto;
        }

        // POST-TOUSER api/<Users>
        [HttpPost("AddToUser")]
        public async Task<ActionResult<bool>> PostToUser([FromBody] RecipePostModel recipePostModel, int id)
        {
            RecipeDto recipeDto = _mapper.Map<RecipeDto>(recipePostModel);
            return await _iService.AddRecipeToUserAsync(id, recipeDto);
        }

        // PUT api/<Users>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<RecipeDto>> Put(int id, [FromBody] RecipePostModel recipePostModel)
        {
            RecipeDto recipeDto = _mapper.Map<RecipeDto>(recipePostModel);
            recipeDto = await _iService.UpdateAsync(id, recipeDto);
            if (recipeDto == null)
                return NotFound();
            return recipeDto;
        }

        // PUT-PUBLIC api/<Users>/5
        [HttpPut("Public/{id}")]
        public async Task<ActionResult<bool>> Put(int id)
        {
            return await _iService.UpdatePublicAsync(id);
        }

        // DELETE api/<Users>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            return await _iService.DeleteAsync(id);
        }
    }
}
