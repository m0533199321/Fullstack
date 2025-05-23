using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    public class UserController(IUserService iService, IMapper mapper, IS3Service s3Service) : ControllerBase
    {
        private readonly IUserService _iService = iService;
        private readonly IMapper _mapper = mapper;
        private readonly IS3Service _s3Service = s3Service;

        // GET: api/<Users>
        [HttpGet]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<UserDto>> Get()
        {
            return await _iService.GetAsync();
        }

        // GET-FULL: api/<Users>
        [HttpGet("Full")]
        [Authorize(Policy = "Admin")]
        public async Task<IEnumerable<User>> GetFull()
        {
            return await _iService.GetFullAsync();
        }

        // GET api/<Users>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            var userDto = await _iService.GetByIdAsync(id);
            if (userDto == null)
                return NotFound();
            return userDto;
        }

        // GET-FULL api/<Users>/5
        [HttpGet("Full/{id}")]
        public async Task<ActionResult<User>> GetFullById(int id)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            var isAdmin = HttpContext.User.Claims.Any(c => c.Type == "role" && c.Value == "Admin");

            if (tokenId != id && !isAdmin)
                return Forbid();
            var user = await _iService.GetFullByIdAsync(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        // POST api/<Users>
        [HttpPost]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<UserDto>> Post([FromBody] UserPostModel userPostModel)
        {
            if (userPostModel == null)
                return BadRequest("User data is required.");

            var userDto = _mapper.Map<UserDto>(userPostModel);
            userDto.CreatedAt = DateTime.UtcNow;
            var result = await _iService.AddAsync(userDto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return StatusCode(result.StatusCode, result.ErrorMessage);
        }

        // PUT api/<Users>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Put(int id, [FromBody] UserPostModel userPostModel)
        {
            if (userPostModel == null)
                return BadRequest("User data is required.");
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != id)
                return Forbid();
            var userDto = _mapper.Map<UserDto>(userPostModel);
            userDto = await _iService.UpdateAsync(id, userDto);
            if (userDto == null)
                return NotFound();
            return userDto;
        }

        // PUT api/<Users>/5
        [HttpPut("Name/{id}")]
        public async Task<ActionResult<UserDto?>> PutName(int id, string fName, string lName)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != id)
                return Forbid();
            var userDto = await _iService.UpdateNameAsync(id, fName, lName);
            if (userDto == null)
                return NotFound();
            return userDto;
        }

        // PUT api/<Users>/5
        [HttpPut("Profile/{id}")]
        public async Task<ActionResult<UserDto?>> PutProfile(int id, string profile)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
            var tokenId = int.Parse(HttpContext.User.Claims.First(claim => claim.Type == "id").Value);
            if (tokenId != id)
                return Forbid();
            var userDto = await _iService.UpdateProfileAsync(id, profile);
            if (userDto == null)
                return NotFound();
            return userDto;
        }

        // PUT api/<Users>/5
        [HttpPut("Password")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto?>> PutPassword([FromBody] EmailPassword emailPassword)
        {
            var user = await _iService.GetByEmailAsync(emailPassword.Email);
            if (user == null)
                return Forbid();
            var userDto = await _iService.UpdatePasswordAsync(user.Id, emailPassword.Password);
            if (userDto == null)
                return NotFound();
            return userDto;
        }


        // DELETE api/<Users>/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            return await _iService.DeleteAsync(id);
        }

        // ⬆️ שלב 1: קבלת URL להעלאת קובץ ל-S3
        [HttpGet("Upload-url")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("Missing file name");
            var url = await _s3Service.GeneratePresignedUrlAsync("images/" + fileName, contentType);
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
