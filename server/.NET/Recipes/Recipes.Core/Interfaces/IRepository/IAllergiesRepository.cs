using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IRepository
{
    public interface IAllergiesRepository : IRepository<Allergy>
    {
        Task<IEnumerable<Allergy>> GetUserAllergiesAsync(int userId);

        Task AddUserAllergyAsync(Allergy allergy);

        Task AddUserAllergiesAsync(IEnumerable<Allergy> allergies);

        Task RemoveUserAllergyAsync(int userId, int allergyId);

        Task RemoveAllUserAllergiesAsync(int userId);
    }
}
