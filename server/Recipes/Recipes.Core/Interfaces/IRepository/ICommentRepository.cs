using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IRepository
{
    public interface ICommentRepository : IRepository<Comment>
    {
       public Task<IEnumerable<Comment>> GetFullAsync();

       public Task<Comment?> GetFullByIdAsync(int id);

       public Task<IEnumerable<Comment>> GetFullByRecipeIdAsync(int recipeId);
    }
}
