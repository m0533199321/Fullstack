using Recipes.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IServices
{
    public interface IPreferencesService
    {
        Task<IEnumerable<PreferenceDto>> GetUserPreferencesAsync(int userId);
        Task UpdateUserPreferencesAsync(int userId, IEnumerable<int> PreferenceIds);
        Task AddUserPreferenceAsync(int userId, int PreferenceId);
        Task RemoveUserPreferenceAsync(int userId, int PreferenceId);
        IEnumerable<PreferenceTypeDto> GetPreferenceTypes();
    }
}
