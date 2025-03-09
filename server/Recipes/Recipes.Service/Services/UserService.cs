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
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;

        public UserService(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _iManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<IEnumerable<User>> GetFullAsync()
        {
            var users = await _iManager._userRepository.GetFullAsync();
            return users;
        }

        public async Task<User?> GetFullByIdAsync(int id)
        {
            var user = await _iManager._userRepository.GetFullByIdAsync(id);
            return user;
        }

        public async Task<IEnumerable<UserDto>> GetAsync()
        {
            var users = await _iManager._userRepository.GetAsync();
            var usersDto = _mapper.Map<IEnumerable<UserDto>>(users);
            return usersDto;
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _iManager._userRepository.GetByIdAsync(id);
            var userDto = _mapper.Map<UserDto>(user);
            return userDto;
        }

        public async Task<UserDto> AddAsync(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            user = await _iManager._userRepository.AddAsync(user);
            if (user != null)
            {
                await _iManager.saveAsync();
                return userDto;
            }
            return null;
        }

        public async Task<UserDto> UpdateAsync(int id, UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            user = await _iManager._userRepository.UpdateAsync(id, user);
            if (user != null)
            {
                await _iManager.saveAsync();
                userDto = _mapper.Map<UserDto>(user);
                return userDto;
            }
            return null;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await GetFullByIdAsync(id);
            if (user != null)
            {
                foreach (var item in user.RecipesList.ToList())
                {
                    await _iManager._recipeRepository.DeleteRecipeAsync(user, item);
                }
                await _iManager._userRepository.DeleteAsync(id);
                await _iManager.saveAsync();
                return true;
            }
            return false;
        }
    }
}
