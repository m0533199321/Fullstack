using Recipes.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IServices
{
    public interface IAllergiesService
    {
        Task<IEnumerable<AllergyDto>> GetUserAllergiesAsync(int userId);
        Task UpdateUserAllergiesAsync(int userId, IEnumerable<int> allergyIds);
        Task AddUserAllergyAsync(int userId, int allergyId);
        Task RemoveUserAllergyAsync(int userId, int allergyId);
        IEnumerable<AllergyTypeDto> GetAllergyTypes();
    }
}
