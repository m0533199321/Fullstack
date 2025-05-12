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
    public class AllergiesRepository: Repository<Allergy>, IAllergiesRepository
    {
        private readonly DbSet<Allergy> _dbset;

        public AllergiesRepository(DataContext dataContext)
           : base(dataContext)
        {
            _dbset = dataContext.Set<Allergy>();
        }

        public async Task<IEnumerable<Allergy>> GetUserAllergiesAsync(int userId)
        {
            return await _dbset
                .Where(a => a.UserId == userId)
                .ToListAsync();
        }

        public async Task AddUserAllergyAsync(Allergy allergy)
        {
            await AddAsync(allergy);
        }

        public async Task AddUserAllergiesAsync(IEnumerable<Allergy> allergies)
        {
            await AddRangeAsync(allergies);
        }

        public async Task RemoveUserAllergyAsync(int userId, int allergyId)
        {
            var allergy = await _dbset
                .FirstOrDefaultAsync(a => a.UserId == userId && a.AllergyId == allergyId);

            if (allergy != null)
            {
                _dbset.Remove(allergy);
            }
        }

        public async Task RemoveAllUserAllergiesAsync(int userId)
        {
            var allergies = await _dbset
                .Where(a => a.UserId == userId)
                .ToListAsync();

            await DeleteRangeAsync(allergies);
        }
    }
}
