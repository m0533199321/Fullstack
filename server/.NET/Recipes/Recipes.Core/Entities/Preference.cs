using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Entities
{
    public enum PreferenceType
    {
        None = 0,
        Spicy = 1,
        Sweet = 2,
        Salty = 3,
        Sour = 4,
        Umami = 5,
        Tangy = 6,
        Herby = 7,
        Smoky = 8,
        ToastedCrunchy = 9,
        Aromatic = 10
    }
    public class Preference
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int PreferenceId { get; set; }
    }
}
