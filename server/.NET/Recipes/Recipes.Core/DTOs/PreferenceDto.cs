using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.DTOs
{
    public class PreferenceDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PreferenceId { get; set; }
    }
}
