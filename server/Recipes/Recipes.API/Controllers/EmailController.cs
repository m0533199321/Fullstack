using Microsoft.AspNetCore.Mvc;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IServices;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Recipes.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController(IEmailService emailService, IUserService userService) : ControllerBase
    {
        private readonly IEmailService _emailService = emailService;
        private readonly IUserService _userService = userService;

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            if (request.Body == "שחזור סיסמה")
            {
                var user = await _userService.GetByEmailAsync(request.To);
                if (user == null)
                    return Forbid();
                Random random = new Random();
                int randomNumber = random.Next(100000, 1000000);
                request.Body += randomNumber.ToString();
                await _emailService.SendEmailAsync(request);
                return Ok(new { randomPassword = randomNumber });
            }
            await _emailService.SendEmailAsync(request);
            return Ok();
        }
    }
}
