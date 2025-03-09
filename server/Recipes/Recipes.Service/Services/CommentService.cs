using AutoMapper;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IRepository;
using Recipes.Core.Interfaces.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Service.Services
{
    public class CommentService: ICommentService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;

        public CommentService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _iManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CommentDto>> GetAsync()
        {
            var comments = await _iManager._commentRepository.GetAsync();
            var commentDto = _mapper.Map<IEnumerable<CommentDto>>(comments);
            return commentDto;
        }

        public async Task<IEnumerable<Comment>> GetFullAsync()
        {
            return await _iManager._commentRepository.GetFullAsync();
        }

        public async Task<CommentDto?> GetByIdAsync(int id)
        {
            var comments = await _iManager._commentRepository.GetByIdAsync(id);
            var commentDto = _mapper.Map<CommentDto>(comments);
            return commentDto;
        }

        public async Task<Comment?> GetFullByIdAsync(int id)
        {
            return await _iManager._commentRepository.GetFullByIdAsync(id);
        }

        public async Task<CommentDto> AddAsync(CommentDto commentDto)
        {
            var comment = _mapper.Map<Comment>(commentDto);
            comment = await _iManager._commentRepository.AddAsync(comment);
            if (comment != null)
            {
                await _iManager.saveAsync();
                return commentDto;
            }
            return null;
        }

        public async Task<CommentDto> UpdateAsync(int id, CommentDto commentDto)
        {
            var comment = _mapper.Map<Comment>(commentDto);
            comment = await _iManager._commentRepository.UpdateAsync(id, comment);
            if (comment != null)
            {
                await _iManager.saveAsync();
                commentDto = _mapper.Map<CommentDto>(comment);
                return commentDto;
            }
            return null;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            bool isDeleted = await _iManager._commentRepository.DeleteAsync(id);
            if (isDeleted)
                await _iManager.saveAsync();
            return isDeleted;
        }
    }
}
