using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IRepository;
using Recipes.Core.Interfaces.IServices;
using System.Xml.Linq;
using AutoMapper;
using System.Text.RegularExpressions;
using Recipes.Core.Shared;

namespace Recipes.Service.Services
{
    public class AuthService(IConfiguration configuration, IRepositoryManager repositoryManager, IMapper mapper, IUserService userService) : IAuthService
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly IRepositoryManager _iManager = repositoryManager;
        private readonly IMapper _mapper = mapper;
        private readonly IUserService _userService = userService;

        public string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Add roles as claims
            foreach (var role in user.RolesList.Select(r => r.RoleName))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool ValidateUser(string email, string password, out string[] roles, out User user)
        {
            roles = null;
            user = _iManager._userRepository.GetUserFullRoles(email);
            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                roles = user.RolesList.Select(r => r.RoleName).ToArray();
                return true;
            }
            return false;
        }

        public Result<LoginResponseDto?> Login(string email, string password)
        {
            if (ValidateUser(email, password, out var roles, out var user))
            {
                var token = GenerateJwtToken(user);
                var response = new LoginResponseDto
                {
                    User = user,
                    Token = token
                };
                return Result<LoginResponseDto?>.Success(response);
            }
            return Result<LoginResponseDto?>.NotFound("User does not exist.");
        }

        //public async Task<Result<UserDto>> Register(UserDto userDto)
        //{
        //    return await _userService.AddAsync(userDto);
        //}

        public async Task<Result<LoginResponseDto?>> Register(UserDto userDto)
        {
            var result = await _userService.AddAsync(userDto);
            if (result == null)
                return null;
            var user = _mapper.Map<User>(result.Data);

            if (result.IsSuccess)
            {
                //var defaultRole = await _iManager._roleRepository.GetByNameAsync("user");

                //if (defaultRole == null)
                //{
                //    return Result<LoginResponseDto>.BadRequest("Default role 'user' not found.");
                //}

                //user.RolesList.Add(defaultRole);
                //await _iManager.SaveAsync();

                var token = GenerateJwtToken(user);
                var response = new LoginResponseDto
                {
                    User = user,
                    Token = token
                };
                return Result<LoginResponseDto>.Success(response);
            }

            return Result<LoginResponseDto>.NotFound("User registration failed.");
        }

        public async Task<User> GetOrCreateUserAsync(string email, string name, string googleId)
        {
            var user = await _iManager._userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                var role = await _iManager._roleRepository.GetByIdAsync(2);
                user = new User
                {
                    Email = email,
                    FName = name,
                    LName = "",
                    Password = "",
                    Profile = "https://malismartchef.s3.amazonaws.com/images/profile-smartChef.png1745511305206",
                    CreatedAt = DateTime.UtcNow,
                    IsDeleted = false,
                    RolesList = new List<Role> { role },
                    //GoogleId = googleId
                };
                await _iManager._userRepository.AddAsync(user);
                await _iManager.SaveAsync();
            }
            return user;
        }

    }
}
