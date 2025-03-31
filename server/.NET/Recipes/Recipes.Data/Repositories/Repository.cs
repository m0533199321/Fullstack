using Microsoft.EntityFrameworkCore;
using Recipes.Core.Interfaces.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Data.Repositories
{
    public class Repository<T>(DataContext dataContext) : IRepository<T> where T : class
    {
        private readonly DbSet<T> _dataSet = dataContext.Set<T>();

        public async Task<IEnumerable<T>> GetAsync()
        {
            return await _dataSet.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dataSet.FindAsync(id);
        }

        public async Task<T> AddAsync(T t)
        {
            await _dataSet.AddAsync(t);
            return t;
        }

        public async Task<T> UpdateAsync(int id, T updatedEntity)
        {
            var existingEntity = await _dataSet.FindAsync(id);
            if (existingEntity == null)
            {
                return null;
            }
            //var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance)
            //                          .Where(prop => prop.Name != "Id");
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance)
                          .Where(prop => prop.Name != "Id" && prop.Name != "CreatedAt");

            foreach (var property in properties)
            {
                var updatedValue = property.GetValue(updatedEntity);

                if (updatedValue != null)
                {
                    property.SetValue(existingEntity, updatedValue);
                }
            }
            return existingEntity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var find = await _dataSet.FindAsync(id);
            if (find != null)
            {
                _dataSet.Remove(find);
                return true;
            }
            return false;
        }
    }
}
