using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Recipes.API.PostModels;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IServices;
using Recipes.Service.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Recipes.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecipeController(IRecipeService iService, IMapper mapper, IS3Service s3Service) : ControllerBase
    {
        private readonly IRecipeService _iService = iService;
        private readonly IMapper _mapper = mapper;
        private readonly IS3Service _s3Service = s3Service;

        // GET: api/<Users>
        [HttpGet]
        [AllowAnonymous]
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
        [AllowAnonymous]
        public async Task<ActionResult<RecipeDto>> Get(int id)
        {
            var recipeDto = await _iService.GetByIdAsync(id);
            if (recipeDto == null)
                return NotFound();
            return recipeDto;
        }

        // GET-FULL api/<Users>/5
        [HttpGet("Full/{id}")]
        public async Task<ActionResult<Recipe>> GetFull(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != id)
                return Forbid();
            var recipe = await _iService.GetFullByIdAsync(id);
            if (recipe == null)
                return NotFound();
            return recipe;
        }

        // GET-CATEGORY: api/<Users>
        [HttpGet("Category/{category}")]
        [AllowAnonymous]
        public async Task<IEnumerable<RecipeDto>> GetCategory(string category)
        {
            return await _iService.GetByCategoryAsync(category);
        }

        // GET-PUBLIC: api/<Users>
        [HttpGet("Public")]
        [AllowAnonymous]
        public async Task<IEnumerable<RecipeDto>> GetPublicRecipes()
        {
            return await _iService.GetPublicRecipesAsync();
        }

        // GET-PRIVATE: api/<Users>/5
        [HttpGet("Private/{id}")]
        public async Task<IEnumerable<RecipeDto>> GetPrivateRecipes(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != id)
                return Enumerable.Empty<RecipeDto>();
            return await _iService.GetPrivateRecipesAsync(id);
        }

        // POST api/<Users>
        [HttpPost]
        public async Task<ActionResult<RecipeDto>> Post([FromBody] RecipePostModel recipePostModel)
        {
            var recipeDto = _mapper.Map<RecipeDto>(recipePostModel);
            recipeDto.CreatedAt = DateTime.UtcNow;
            recipeDto = await _iService.AddAsync(recipeDto);
            if (recipeDto == null)
                return NotFound();
            return recipeDto;
        }

        // POST-TOUSER api/<Users>
        [HttpPost("AddNewToUser")]
        public async Task<ActionResult<RecipeDto>> PostNewToUser(int userId, RecipePostModel recipePostModel)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != userId)
                return Forbid();
            var recipeDto = _mapper.Map<RecipeDto>(recipePostModel);
            recipeDto.CreatedAt = DateTime.UtcNow;
            return await _iService.AddNewRecipeToUserAsync(userId, recipeDto);
        }

        // POST-TOUSER api/<Users>
        [HttpPost("AddToUser")]
        public async Task<ActionResult<RecipeDto>> PostToUser(int userId, int recipeId)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != userId)
                return Forbid();
            return await _iService.AddRecipeToUserAsync(userId, recipeId);
        }

        // PUT-PUBLIC api/<Users>/5
        [HttpPut("PrivateToPublic/{id}")]
        public async Task<ActionResult<bool>> Put(int id)
        {
            return await _iService.UpdatePublicAsync(id);
        }

        // DELETE api/<Users>/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            return await _iService.DeleteAsync(id);
        }

        // DELETE api/<Users>/5
        [HttpDelete("Recipe/{id}")]
        public async Task<ActionResult<bool>> DeleteRecipe(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            var recipe = await _iService.GetFullByIdAsync(id);
            var user = recipe.UsersList.Where(u => u.Id == tokenId).FirstOrDefault();
            if (user == null)
                return false;
            return await _iService.DeleteRecipeAsync(user, recipe);
        }

        // ⬆️ שלב 1: קבלת URL להעלאת קובץ ל-S3
        [HttpGet("Upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("Missing file name");
            var url = await _s3Service.GeneratePresignedUrlAsync("recipes/" + fileName, contentType);
            return Ok(new { url });
        }

        // ⬇️ שלב 2: קבלת URL להורדת קובץ מה-S3
        [HttpGet("Download-url/{fileName}")]
        public async Task<IActionResult> GetDownloadUrl(string fileName)
        {
            var url = await _s3Service.GetDownloadUrlAsync(fileName);
            return Ok(new { downloadUrl = url });
        }
    }
}


// POST-TOUSER api/<Users>
//[HttpPost("AddToUser")]
//public async Task<ActionResult<RecipeDto>> PostToUser([FromBody] RecipePostModel recipePostModel, int userId)
//{
//    var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
//    var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
//    if (tokenId != userId)
//        return Unauthorized();
//    if (recipePostModel == null)
//        return BadRequest("Recipe data is required.");
//    var recipeDto = _mapper.Map<RecipeDto>(recipePostModel);
//    return await _iService.AddRecipeToUserAsync(userId, recipeDto);
//}


//// PUT api/<Users>/5
//[HttpPut("{id}")]
//public async Task<ActionResult<RecipeDto>> Put(int id, [FromBody] RecipePostModel recipePostModel)
//{
//    var recipeDto = _mapper.Map<RecipeDto>(recipePostModel);
//    recipeDto = await _iService.UpdateAsync(id, recipeDto);
//    if (recipeDto == null)
//        return NotFound();
//    return recipeDto;
//}

//// DELETE api/<Users>/5
//[HttpDelete("Recipe/{id}")]
//public async Task<ActionResult<bool>> DeleteRecipe(int id)
//{
//    var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
//    var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
//    var recipe = await _iService.GetFullByIdAsync(id);
//    var user = recipe.UsersList.Where(u => u.Id == 0).FirstOrDefault();
//    if (user == null)
//        return Unauthorized();
//    return await _iService.DeleteRecipeAsync(user, recipe);
//}