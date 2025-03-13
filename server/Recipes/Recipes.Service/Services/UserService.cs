using AutoMapper;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IRepository;
using Recipes.Core.Interfaces.IServices;
using Recipes.Core.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Recipes.Service.Services
{
    public class UserService(IRepositoryManager repositoryManager, IMapper mapper) : IUserService
    {
        private readonly IRepositoryManager _iManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

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

        public async Task<Result<UserDto>> AddAsync(UserDto userDto)
        {
            if (!IsValidEmail(userDto.Email))
            {
                return Result<UserDto>.BadRequest("Email address is invalid.");
            }

            if (!IsValidPassword(userDto.Password))
            {
                return Result<UserDto>.BadRequest("Password is invalid.");
            }
            
            var user = mapper.Map<User>(userDto);

            var users = await _iManager._userRepository.GetAsync();
            if (users.Any(u => u.Email == user.Email))
            {
                return Result<UserDto>.Failure("User already exists.");
            }

            var result = await _iManager._userRepository.AddAsync(user);
            if (result == null)
            {
                return Result<UserDto>.Failure("Unable to add the user at this time.");
            }

            var resultDto = _mapper.Map<UserDto>(result);

            await _iManager.SaveAsync();
            return Result<UserDto>.Success(resultDto);
        }

        public async Task<UserDto> UpdateAsync(int id, UserDto userDto)
        {
            userDto.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            var user = _mapper.Map<User>(userDto);
            user = await _iManager._userRepository.UpdateAsync(id, user);
            if (user != null)
            {
                await _iManager.SaveAsync();
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
                await _iManager._userRepository.DeleteAsync(id);
                await _iManager.SaveAsync();
                return true;
            }
            return false;
        }

        private static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;
            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
        }

        public bool IsValidPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
                return false;
            bool hasLetter = password.Any(char.IsLetter);
            bool hasDigit = password.Any(char.IsDigit);

            return hasLetter && hasDigit;
        }

    }
}
