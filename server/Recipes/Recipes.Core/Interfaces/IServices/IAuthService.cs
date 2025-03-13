using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IServices
{
    public interface IAuthService
    {
        public string GenerateJwtToken(User user);

        public bool ValidateUser(string email, string password, out string[] roles, out User user);
        
        public Result<LoginResponseDto?> Login(string email, string password);
        
        public Task<Result<LoginResponseDto?>> Register(UserDto userDto);
    }
}
