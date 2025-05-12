using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.DTOs
{
    public class AllergyDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AllergyId { get; set; }
    }
}
