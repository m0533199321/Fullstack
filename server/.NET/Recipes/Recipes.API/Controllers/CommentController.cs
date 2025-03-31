using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    public class CommentController(ICommentService iService, IMapper mapper) : ControllerBase
    {
        private readonly ICommentService _iService = iService;
        private readonly IMapper _mapper = mapper;

        // GET: api/<Users>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IEnumerable<CommentDto>> Get()
        {
            return await _iService.GetAsync();
        }

        //GET-FULL: api/<Users>
        [HttpGet("Full")]
        [AllowAnonymous]
        public async Task<IEnumerable<Comment>> GetFull()
        {
            return await _iService.GetFullAsync();
        }

        //GET-FULL: api/<Users>
        [HttpGet("Full/{recipeId}")]
        [AllowAnonymous]
        public async Task<IEnumerable<Comment>> GetFullByRecipeId(int recipeId)
        {
            return await _iService.GetFullByRecipeIdAsync(recipeId);
        }


        // POST api/<Users>
        [HttpPost]
        public async Task<ActionResult<CommentDto>> Post([FromBody] CommentPostModel commentPostModel)
        {
            if (commentPostModel == null)
                return BadRequest("Comment data is required.");
            var commentDto = _mapper.Map<CommentDto>(commentPostModel);
            commentDto.CreatedAt = DateTime.UtcNow;
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            commentDto.UserId = tokenId;
            commentDto = await _iService.AddAsync(commentDto);
            if (commentDto == null)
                return NotFound();
            return commentDto;
        }

        // PUT api/<Users>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<CommentDto>> Put(int id, [FromBody] CommentPostModel commentPostModel)
        {
            if (commentPostModel == null)
                return BadRequest("Comment data is required.");
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            var commentDto = _mapper.Map<CommentDto>(commentPostModel);
            commentDto.UserId = tokenId;
            commentDto = await _iService.UpdateAsync(id, commentDto);
            if (commentDto == null)
                return NotFound();
            return commentDto;
        }

        // DELETE api/<Users>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            var comment = await _iService.GetByIdAsync(id);
            if (comment == null || tokenId != comment.UserId)
                return Forbid();
            return await _iService.DeleteAsync(id);
        }
    }
}

//// GET api/<Users>/5
//[HttpGet("{id}")]
//[AllowAnonymous]
//public async Task<ActionResult<CommentDto>> Get(int id)
//{
//    var commentDto = await _iService.GetByIdAsync(id);
//    if (commentDto == null)
//        return NotFound();
//    return commentDto;
//}

//// GET-FULL: api/<Users>
//[HttpGet("Full/{id}")]
//[AllowAnonymous]
//public async Task<Comment?> GetFullById(int id)
//{
//    return await _iService.GetFullByIdAsync(id);
//}