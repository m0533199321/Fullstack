using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IServices;
using System.ComponentModel.Design;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Recipes.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class PreferencesController(IPreferencesService preferencesService) : ControllerBase
    {
        private readonly IPreferencesService _preferencesService = preferencesService;

        // GET: api/allergies/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<PreferenceDto>>> GetUserPreferences(int userId)
        {
            try
            {
                var preferences = await _preferencesService.GetUserPreferencesAsync(userId);
                return Ok(preferences);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה פנימית: {ex.Message}");
            }
        }

        // POST: api/allergies/{userId}
        [HttpPost("{userId}")]
        public async Task<IActionResult> UpdateUserPreferences(int userId, [FromBody] UpdatePreferencesDto updateDto)
        {
            if (updateDto == null || updateDto.Preferences == null)
            {
                return BadRequest("נתונים לא תקינים");
            }

            try
            {
                await _preferencesService.UpdateUserPreferencesAsync(userId, updateDto.Preferences);
                return Ok(new { message = "ההעדפות עודכנו בהצלחה" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה פנימית: {ex.Message}");
            }
        }

        // POST: api/allergies/{userId}/add
        [HttpPost("{userId}/add")]
        public async Task<IActionResult> AddUserPreferences(int userId, [FromBody] AddPreferencesDto addDto)
        {
            if (addDto == null)
            {
                return BadRequest("נתונים לא תקינים");
            }

            try
            {
                await _preferencesService.AddUserPreferenceAsync(userId, addDto.PreferencesId);
                return Ok(new { message = "ההעדפה נוספה בהצלחה" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה פנימית: {ex.Message}");
            }
        }

        // DELETE: api/allergies/{userId}/{allergyId}
        [HttpDelete("{userId}/{allergyId}")]
        public async Task<IActionResult> RemoveUserPreferences(int userId, int preferencesId)
        {
            try
            {
                await _preferencesService.RemoveUserPreferenceAsync(userId, preferencesId);
                return Ok(new { message = "ההעדפה הוסרה בהצלחה" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה פנימית: {ex.Message}");
            }
        }

        // GET: api/allergies/types
        [HttpGet("types")]
        public ActionResult<IEnumerable<PreferenceTypeDto>> GetPreferencesTypes()
        {
            try
            {
                var preferencesTypes = _preferencesService.GetPreferenceTypes();
                return Ok(preferencesTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"שגיאה פנימית: {ex.Message}");
            }
        }

        public class AddPreferencesDto
        {
            public int PreferencesId { get; set; }
        }

        public class UpdatePreferencesDto
        {
            public IEnumerable<int> Preferences { get; set; }
        }
    }
}
