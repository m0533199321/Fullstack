using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IServices
{
    public interface ICommentService
    {
        public Task<IEnumerable<CommentDto>> GetAsync();

        public Task<IEnumerable<Comment>> GetFullAsync();

        public Task<IEnumerable<Comment>> GetFullByRecipeIdAsync(int recipeId);

        public Task<CommentDto?> GetByIdAsync(int id);

        public Task<CommentDto> AddAsync(CommentDto c);

        public Task<CommentDto> UpdateAsync(int id, CommentDto c);

        public Task<bool> DeleteAsync(int id);

    }
}

//public Task<Comment?> GetFullByIdAsync(int id);
