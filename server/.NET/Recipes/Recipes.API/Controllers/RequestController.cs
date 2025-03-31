using Microsoft.AspNetCore.Mvc;
using Recipes.Core.Interfaces.IServices;
using Recipes.Core.Entities;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Recipes.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RequestController(IRequestService requestService) : ControllerBase
    {
        private readonly IRequestService _requestService = requestService;

        [HttpPost("Request")]
        public async Task<IActionResult> HandleRecipeRequest([FromBody] string request)
        {
            if (request == null || string.IsNullOrEmpty(request))
            {
                return BadRequest("Invalid request");
            }

            var result = await _requestService.CallPythonApi(request);
            if (result.recipeName == null || result.fileData == null)
            {
                return StatusCode(500, "Error calling Python API");
            }

            var base64File = Convert.ToBase64String(result.fileData);
            var responseArray = new object[]
            {
                result.recipeName,
                base64File
            };

            return Ok(responseArray);
        }
    }
}
