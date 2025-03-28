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

        public Task<User?> UpdateNameAsync(int id, string fName, string lName);
        
        public Task<User?> UpdateProfileAsync(int id, string profile);

        public Task<User?> UpdatePasswordAsync(int id, string password);

        public User? GetUserFullRoles(string email);

        public IEnumerable<Role> GetRolesToUser(int id);

        public Task<User?> GetByEmailAsync(string email);
    }
}

//public bool DeleteUserAsync(User user, Recipe recipe);