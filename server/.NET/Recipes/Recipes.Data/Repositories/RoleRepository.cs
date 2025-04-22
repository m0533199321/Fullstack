using Microsoft.EntityFrameworkCore;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Data.Repositories
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        private readonly DbSet<Role> _dbset;
        public RoleRepository(DataContext dataContext)
            : base(dataContext)
        {
            _dbset = dataContext.Set<Role>();
        }

        public async Task<Role?> GetByNameAsync(string role)
        {
            return await _dbset.Where(r => r.RoleName.ToLower().Equals(role.ToLower()))
                .FirstOrDefaultAsync();
        }
    }
}
