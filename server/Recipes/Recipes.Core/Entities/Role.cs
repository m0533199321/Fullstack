using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Entities
{
    public class Role
    {
        public int Id { get; set; }

        public string RoleName { get; set; }

        public List<User> UsersList { get; set; }

        public List<Permission> PermissionsList { get; set; }

        public Role() 
        {
            UsersList = new List<User>();
            PermissionsList = new List<Permission>();
        }
    }
}
