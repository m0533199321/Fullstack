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
                request.Body = $@"
                <div style='direction: rtl; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; text-align: center;'>
                 <div style='background-color: #FFA500; padding: 15px 0; border-radius: 8px;'>
                 <h1 style='margin: 0; font-size: 28px; color: white;'>שחזור סיסמה</h1>
                 </div>
                <div style='background-color: white; border: 1px solid #eee; margin-top: 15px; padding: 20px; border-radius: 8px;'>
                 <p style='font-size: 20px; color: #333;'>הקוד שלך לאיפוס הסיסמה הוא:</p>
                 <p style='font-size: 32px; font-weight: bold; color: #FFA500; margin: 20px 0;'>{randomNumber}</p>
                 <p style='font-size: 16px; color: #666;'>אם לא ביקשת את הקוד, אנא התעלם מהודעה זו.</p>
                 </div>
                 <p style='font-size: 14px; color: gray; margin-top: 30px;'>ההודעה נשלחה אוטומטית מאפליקציית ניהול המתכונים - Smart Chef</p>
                </div>
                 ";
                //request.Body += randomNumber.ToString();
                await _emailService.SendEmailAsync(request);
                return Ok(new { randomPassword = randomNumber });
            }
            await _emailService.SendEmailAsync(request);
            return Ok();
        }
    }
}
