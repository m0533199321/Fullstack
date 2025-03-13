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
    public interface IUserService
    {
        public Task<IEnumerable<UserDto>> GetAsync();

        public Task<IEnumerable<User>> GetFullAsync();

        public Task<UserDto?> GetByIdAsync(int id);

        public Task<User?> GetFullByIdAsync(int id);

        public Task<Result<UserDto>> AddAsync(UserDto u);

        public Task<UserDto> UpdateAsync(int id, UserDto u);

        public Task<bool> DeleteAsync(int id);
    }
}
