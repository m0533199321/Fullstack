using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IRepository
{
    public interface IRepositoryManager
    {
        IUserRepository _userRepository { get; set; }

        IRecipeRepository _recipeRepository { get; set; }

        ICommentRepository _commentRepository { get; set; }

        IRoleRepository _roleRepository { get; set; }

        Task SaveAsync();
    }
}
