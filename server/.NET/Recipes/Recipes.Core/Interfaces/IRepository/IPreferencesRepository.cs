using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IRepository
{
    public interface IPreferencesRepository: IRepository<Preference>
    {
        Task<IEnumerable<Preference>> GetUserPreferencesAsync(int userId);

        Task AddUserPreferenceAsync(Preference preference);

        Task AddUserPreferencesAsync(IEnumerable<Preference> preferences);

        Task RemoveUserPreferenceAsync(int userId, int PreferenceId);

        Task RemoveAllUserPreferencesAsync(int userId);
    }
}
