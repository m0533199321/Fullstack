﻿using Microsoft.EntityFrameworkCore;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IRepository;
using Recipes.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Data.Repository
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        private readonly DbSet<User> _dbset;
        public UserRepository(DataContext dataContext)
            : base(dataContext)
        {
            _dbset = dataContext.Set<User>();
        }

        public async Task<IEnumerable<User>> GetFullAsync()
        {
            return await _dbset.Include(u => u.RecipesList).ToListAsync();
        }

        public async Task<User?> GetFullByIdAsync(int id)
        {
            return await _dbset.Where(u => u.Id == id)
                 .Include(u => u.RecipesList).FirstOrDefaultAsync();
        }

        //public bool DeleteUserAsync(User user, Recipe recipe)
        //{
        //    var existUser = recipe.UsersList.Any(u => u.Id == user.Id);
        //    if (existUser)
        //    {
        //        if (user.RecipesList.Contains(recipe))
        //        {
        //            user.RecipesList.Remove(recipe);
        //        }
        //        return true;
        //    }
        //    return false;
        //}

        public User? GetUserFullRoles(string email)
        {
            return _dbset.Where(u => u.Email == email).Include(u => u.RecipesList)
                .Include(u => u.RolesList).FirstOrDefault();
        }

        public IEnumerable<Role> GetRolesToUser(int id)
        {
            var user = _dbset.Where(u => u.Id == id)
                .Include(u => u.RolesList).FirstOrDefault();
            return user?.RolesList ?? Enumerable.Empty<Role>();
        }
    }
}
