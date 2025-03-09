using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IRepository
{
    public interface IUserRepository : IRepository<User>
    {
        public Task<IEnumerable<User>> GetFullAsync();

        public Task<User?> GetFullByIdAsync(int id);

        public bool DeleteUserAsync(User user, Recipe recipe);
    }
}
