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
    public class UserController : ControllerBase
    {
        private readonly IUserService _iService;
        private readonly IMapper _mapper;

        public UserController(IUserService iService, IMapper mapper)
        {
            _iService = iService;
            _mapper = mapper;
        }

        // GET: api/<Users>
        [HttpGet]
        public async Task<IEnumerable<UserDto>> Get()
        {
            return await _iService.GetAsync();
        }

        // GET-FULL: api/<Users>
        [HttpGet("Full")]
        public async Task<IEnumerable<User>> GetFull()
        {
            return await _iService.GetFullAsync();
        }

        // GET-FULL api/<Users>/5
        [HttpGet("Full/{id}")]
        public async Task<ActionResult<User>> GetFullById(int id)
        {
            User user = await _iService.GetFullByIdAsync(id);
            if (user == null)
                return NotFound();
            return user;
        }

        // GET api/<Users>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> Get(int id)
        {
            UserDto userDto = await _iService.GetByIdAsync(id);
            if (userDto == null)
                return NotFound();
            return userDto;
        }

        // POST api/<Users>
        [HttpPost]
        public async Task<ActionResult<UserDto>> Post([FromBody] UserPostModel userPostModel)
        {
            UserDto userDto = _mapper.Map<UserDto>(userPostModel);
            userDto = await _iService.AddAsync(userDto);
            if (userDto == null)
                return NotFound();
            return userDto;
        }

        // PUT api/<Users>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Put(int id, [FromBody] UserPostModel userPostModel)
        {
            UserDto userDto = _mapper.Map<UserDto>(userPostModel);
            userDto = await _iService.UpdateAsync(id, userDto);
            if (userDto == null)
                return NotFound();
            return userDto;
        }

        // DELETE api/<Users>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            return await _iService.DeleteAsync(id);
        }
    }
}
