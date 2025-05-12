using AutoMapper;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();

            CreateMap<Recipe, RecipeDto>().ReverseMap();

            CreateMap<Comment, CommentDto>().ReverseMap();

            CreateMap<Allergy, AllergyDto>().ReverseMap();

            CreateMap<Preference, PreferenceDto>().ReverseMap();
        }
    }
}
