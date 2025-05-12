using AutoMapper;
using Recipes.Core.DTOs;
using Recipes.Core.Entities;
using Recipes.Core.Interfaces.IRepository;
using Recipes.Core.Interfaces.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Service.Services
{
    public class AllergiesService(IRepositoryManager repositoryManager, IMapper mapper) : IAllergiesService
    {
        private readonly IRepositoryManager _iManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

        public async Task<IEnumerable<AllergyDto>> GetUserAllergiesAsync(int userId)
        {
            var allergies = await _iManager._allergiesRepository.GetUserAllergiesAsync(userId);
            var allergiesDto = _mapper.Map<IEnumerable<AllergyDto>>(allergies);
            return allergiesDto;
        }

        public async Task UpdateUserAllergiesAsync(int userId, IEnumerable<int> allergyIds)
        {
            await _iManager._allergiesRepository.RemoveAllUserAllergiesAsync(userId);

            if (allergyIds != null && allergyIds.Any())
            {
                var allergies = allergyIds.Select(allergyId => new Allergy
                {
                    UserId = userId,
                    AllergyId = allergyId
                });

                await _iManager._allergiesRepository.AddUserAllergiesAsync(allergies);
                await _iManager.SaveAsync();
            }
        }

        public async Task AddUserAllergyAsync(int userId, int allergyId)
        {
            var existingAllergies = await _iManager._allergiesRepository.GetUserAllergiesAsync(userId);
            if (existingAllergies.Any(a => a.AllergyId == allergyId))
            {
                return;
            }

            var allergy = new Allergy
            {
                UserId = userId,
                AllergyId = allergyId
            };

            await _iManager._allergiesRepository.AddUserAllergyAsync(allergy);
            await _iManager.SaveAsync();
        }

        public async Task RemoveUserAllergyAsync(int userId, int allergyId)
        {
            await _iManager._allergiesRepository.RemoveUserAllergyAsync(userId, allergyId);
            await _iManager.SaveAsync();
        }

        public IEnumerable<AllergyTypeDto> GetAllergyTypes()
        {
            return Enum.GetValues(typeof(AllergyType))
                .Cast<AllergyType>()
                .Select(a => new AllergyTypeDto
                {
                    Id = (int)a,
                    Name = a.ToString(),
                    DisplayName = GetAllergyDisplayName(a)
                });
        }

        private string GetAllergyDisplayName(AllergyType allergyType)
        {
            return allergyType switch
            {
                AllergyType.None => "ללא אלרגיות",
                AllergyType.Gluten => "גלוטן",
                AllergyType.Dairy => "חלב ומוצריו",
                AllergyType.Eggs => "ביצים",
                AllergyType.Peanuts => "בוטנים",
                AllergyType.Soy => "סויה",
                AllergyType.Sesame => "שומשום",
                AllergyType.Fish => "דגים",
                AllergyType.Shellfish => "פירות ים",
                AllergyType.Mustard => "חרדל",
                AllergyType.Corn => "תירס",
                _ => allergyType.ToString()
            };
        }
    }
}
