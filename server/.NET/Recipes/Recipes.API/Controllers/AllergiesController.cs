using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recipes.Core.DTOs;
using Recipes.Core.Interfaces.IServices;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Recipes.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class AllergiesController(IAllergiesService allergiesService) : ControllerBase
    {
        private readonly IAllergiesService _allergiesService = allergiesService;

        // GET: api/allergies/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<AllergyDto>>> GetUserAllergies(int userId)
        {
            try
            {
                var allergies = await _allergiesService.GetUserAllergiesAsync(userId);
                return Ok(allergies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה פנימית: {ex.Message}");
            }
        }

        // POST: api/allergies/{userId}
        [HttpPost("{userId}")]
        public async Task<IActionResult> UpdateUserAllergies(int userId, [FromBody] UpdateAllergiesDto updateDto)
        {
            if (updateDto == null || updateDto.Allergies == null)
            {
                return BadRequest("נתונים לא תקינים");
            }

            try
            {
                await _allergiesService.UpdateUserAllergiesAsync(userId, updateDto.Allergies);
                return Ok(new { message = "האלרגיות עודכנו בהצלחה" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה פנימית: {ex.Message}");
            }
        }

        // POST: api/allergies/{userId}/add
        [HttpPost("{userId}/add")]
        public async Task<IActionResult> AddUserAllergy(int userId, [FromBody] AddAllergyDto addDto)
        {
            if (addDto == null)
            {
                return BadRequest("נתונים לא תקינים");
            }

            try
            {
                await _allergiesService.AddUserAllergyAsync(userId, addDto.AllergyId);
                return Ok(new { message = "האלרגיה נוספה בהצלחה" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה פנימית: {ex.Message}");
            }
        }

        // DELETE: api/allergies/{userId}/{allergyId}
        [HttpDelete("{userId}/{allergyId}")]
        public async Task<IActionResult> RemoveUserAllergy(int userId, int allergyId)
        {
            try
            {
                await _allergiesService.RemoveUserAllergyAsync(userId, allergyId);
                return Ok(new { message = "האלרגיה הוסרה בהצלחה" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה פנימית: {ex.Message}");
            }
        }

        // GET: api/allergies/types
        [HttpGet("types")]
        public ActionResult<IEnumerable<AllergyTypeDto>> GetAllergyTypes()
        {
            try
            {
                var allergyTypes = _allergiesService.GetAllergyTypes();
                return Ok(allergyTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה פנימית: {ex.Message}");
            }
        }

        public class AddAllergyDto
        {
            public int AllergyId { get; set; }
        }

        public class UpdateAllergiesDto
        {
            public IEnumerable<int> Allergies { get; set; }
        }
    }
}

