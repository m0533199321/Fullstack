using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Data
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public DbSet<Recipe> Recipes { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<Allergy> Allergies { get; set; }

        public DbSet<Preference> Preferences { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=recipes_db");
        }

    }
}
