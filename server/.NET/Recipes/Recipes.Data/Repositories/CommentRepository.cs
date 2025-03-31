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
    public class CommentRepository:Repository<Comment>, ICommentRepository
    {
        private readonly DbSet<Comment> _dbset;
        public CommentRepository(DataContext dataContext)
            : base(dataContext)
        {
            _dbset = dataContext.Set<Comment>();
        }

        public async Task<IEnumerable<Comment>> GetFullAsync()
        {
            return await _dbset.Include(c=>c.User).ToListAsync();
        }

        public async Task<Comment?> GetFullByIdAsync(int id)
        {
            return await _dbset.Include(c => c.User).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Comment>> GetFullByRecipeIdAsync(int recipeId)
        {
            var comments = await GetFullAsync();
            return comments.Where(c => c.RecipeId == recipeId);
        }
    }
}
