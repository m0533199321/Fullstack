using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Entities
{
    public enum AllergyType
    {
        None = 0,
        Gluten = 1,
        Dairy = 2,
        Eggs = 3,
        Peanuts = 4,
        Soy = 5,
        Sesame = 6,
        Fish = 7,
        Shellfish = 8,
        Mustard = 9,
        Corn = 10
    }

    public class Allergy
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int AllergyId { get; set; }
    }
}
