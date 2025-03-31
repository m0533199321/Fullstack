using Recipes.Core.Interfaces.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        DataContext _dataContext;
        public IUserRepository _userRepository { get; set; }

        public IRecipeRepository _recipeRepository { get; set; }

        public ICommentRepository _commentRepository { get; set; }

        public RepositoryManager(DataContext dataContext,
                                 IUserRepository userRepository,
                                 IRecipeRepository recipeRepository,
                                 ICommentRepository commentRepository)
        {
            _dataContext = dataContext;
            _userRepository = userRepository;
            _recipeRepository = recipeRepository;
            _commentRepository = commentRepository;
        }
        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }
    }
}
