using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Recipes.API.PostModels;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IRepository;
using Recipes.Core.Interfaces.IServices;
using Recipes.Data.Repositories;
using Recipes.Service.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Recipes.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService, IMapper mapper, IS3Service s3Service, IRepositoryManager repositoryManager) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly IMapper _mapper = mapper;
        private readonly IS3Service _s3Service = s3Service;
        private readonly IRepositoryManager _iManager = repositoryManager;

        [HttpPost("login")]
        public ActionResult<LoginResponseDto> Login([FromBody] LoginModel model)
        {
            if (model.Password == "" || model.Password == null)
            {
                return BadRequest("User password is required.");
            }
            if (model.Email == "" || model.Email == null)
            {
                return BadRequest("User password is required.");
            }
            var result = _authService.Login(model.Email, model.Password);
            if (result.IsSuccess)
            {
                return StatusCode(result.StatusCode, result.Data);
            }
            return StatusCode(result.StatusCode, result.ErrorMessage);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] UserPostModel user)
        {
            if (user == null)
                return BadRequest("User data is required.");

            var userDto = _mapper.Map<UserDto>(user);
            userDto.CreatedAt = DateTime.UtcNow;
            var result = await _authService.Register(userDto);
            if (result != null && result.IsSuccess)
            {
                return Ok(result.Data);
            }
            if (result == null)
                return BadRequest("Cant add");
            return StatusCode(result.StatusCode, result.ErrorMessage);
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInRequest request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest(new { message = "Google token is required." });
            }

            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? "YOUR_GOOGLE_CLIENT_ID" }
                });

                var existingUser = await _iManager._userRepository.GetByEmailAsync(payload.Email);
                string profilePictureUrlS3 = null;
                if (existingUser == null && !string.IsNullOrEmpty(payload.Picture))
                {
                    using (var httpClient = new HttpClient())
                    {
                        try
                        {
                            var response = await httpClient.GetAsync(payload.Picture);
                            response.EnsureSuccessStatusCode();
                            string contentType = response.Content.Headers.ContentType?.ToString();

                            using (var imageStream = await response.Content.ReadAsStreamAsync())
                            {
                                var fileName = $"{payload.Subject}_{DateTime.UtcNow.Ticks}.jpg";
                                profilePictureUrlS3 = await _s3Service.UploadFileAsync(imageStream, fileName, contentType);

                                //if (profilePictureUrlS3 != null)
                                //{
                                //    Console.WriteLine($"Profile picture uploaded to S3. URL: {profilePictureUrlS3}");
                                //}
                                //else
                                //{
                                //    Console.WriteLine("Failed to upload profile picture to 'images/' in S3.");
                                //}
                            }
                        }
                        catch (HttpRequestException ex)
                        {
                            //Console.WriteLine($"Error downloading Google profile picture: {ex.Message}. Status Code: {ex.StatusCode}");
                            // המשך כרגיל בלי תמונת פרופיל S3
                        }
                        catch (Exception ex)
                        {
                            //Console.WriteLine($"General error during download of Google profile picture: {ex.Message}");
                            // המשך כרגיל בלי תמונת פרופיל S3
                        }
                    }
                }
                else
                {
                    Console.WriteLine("Google payload does not contain a picture URL.");
                }

                var user = await _authService.GetOrCreateUserAsync(payload.Email, payload.GivenName, payload.FamilyName, profilePictureUrlS3, payload.Subject);
                var jwtToken = _authService.GenerateJwtToken(user);

                return Ok(new { user, token = jwtToken });
            }
            catch (InvalidJwtException ex)
            {
                return Unauthorized(new { message = "Invalid Google token", error = ex.Message });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = "Google Sign-In failed", error = ex.Message });
            }
        }

        //[HttpPost("google")]
        //public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInRequest request)
        //{
        //    try
        //    {
        //        if (string.IsNullOrEmpty(request.Token))
        //        {
        //            return BadRequest(new { message = "Google token is required." });
        //        }
        //        // אימות הטוקן מול Google
        //        var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, new GoogleJsonWebSignature.ValidationSettings
        //        {
        //            Audience = new[] { Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? "YOUR_GOOGLE_CLIENT_ID" } // Client ID שלך
        //        });


        //        // בדוק אם המשתמש כבר קיים במערכת
        //        var user = await _authService.GetOrCreateUserAsync(payload.Email, payload.GivenName, payload.FamilyName,payload.Picture, payload.Subject);

        //        // צור JWT Token עבור המשתמש
        //        var jwtToken = _authService.GenerateJwtToken(user);

        //        return Ok(new { user, token = jwtToken });
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Google Sign-In Error: {ex.Message}");
        //        return Unauthorized(new { message = "Invalid Google token", error = ex.Message });
        //    }
        //}
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class GoogleSignInRequest
    {
        public string Token { get; set; }
    }
}
