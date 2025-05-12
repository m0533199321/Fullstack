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
    public class PreferencesRepository : Repository<Preference>, IPreferencesRepository
    {
        private readonly DbSet<Preference> _dbset;

        public PreferencesRepository(DataContext dataContext)
           : base(dataContext)
        {
            _dbset = dataContext.Set<Preference>();
        }

        public async Task<IEnumerable<Preference>> GetUserPreferencesAsync(int userId)
        {
            return await _dbset
                .Where(a => a.UserId == userId)
                .ToListAsync();
        }

        public async Task AddUserPreferenceAsync(Preference preference)
        {
            await AddAsync(preference);
        }

        public async Task AddUserPreferencesAsync(IEnumerable<Preference> preferences)
        {
            await AddRangeAsync(preferences);
        }

        public async Task RemoveUserPreferenceAsync(int userId, int preferenceId)
        {
            var preference = await _dbset
                .FirstOrDefaultAsync(a => a.UserId == userId && a.PreferenceId == preferenceId);

            if (preference != null)
            {
                _dbset.Remove(preference);
            }
        }

        public async Task RemoveAllUserPreferencesAsync(int userId)
        {
            var preferences = await _dbset
                .Where(a => a.UserId == userId)
                .ToListAsync();

            await DeleteRangeAsync(preferences);
        }
    }
}
