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
    public class PreferencesService(IRepositoryManager repositoryManager, IMapper mapper) : IPreferencesService
    {
        private readonly IRepositoryManager _iManager = repositoryManager;
        private readonly IMapper _mapper = mapper;

        public async Task<IEnumerable<PreferenceDto>> GetUserPreferencesAsync(int userId)
        {
            var preferences = await _iManager._preferencesRepository.GetUserPreferencesAsync(userId);
            var preferencesDto = _mapper.Map<IEnumerable<PreferenceDto>>(preferences);
            return preferencesDto;
        }

        public async Task UpdateUserPreferencesAsync(int userId, IEnumerable<int> preferenceIds)
        {
            await _iManager._preferencesRepository.RemoveAllUserPreferencesAsync(userId);

            if (preferenceIds != null && preferenceIds.Any())
            {
                var preferences = preferenceIds.Select(preferenceId => new Preference
                {
                    UserId = userId,
                    PreferenceId = preferenceId
                });

                await _iManager._preferencesRepository.AddUserPreferencesAsync(preferences);
                await _iManager.SaveAsync();
            }
        }

        public async Task AddUserPreferenceAsync(int userId, int preferenceId)
        {
            var existingPreferences = await _iManager._preferencesRepository.GetUserPreferencesAsync(userId);
            if (existingPreferences.Any(a => a.PreferenceId == preferenceId))
            {
                return;
            }

            var preference = new Preference
            {
                UserId = userId,
                PreferenceId = preferenceId
            };

            await _iManager._preferencesRepository.AddUserPreferenceAsync(preference);
            await _iManager.SaveAsync();
        }

        public async Task RemoveUserPreferenceAsync(int userId, int preferenceId)
        {
            await _iManager._preferencesRepository.RemoveUserPreferenceAsync(userId, preferenceId);
            await _iManager.SaveAsync();
        }

        public IEnumerable<PreferenceTypeDto> GetPreferenceTypes()
        {
            return Enum.GetValues(typeof(PreferenceType))
                .Cast<PreferenceType>()
                .Select(a => new PreferenceTypeDto
                {
                    Id = (int)a,
                    Name = a.ToString(),
                    DisplayName = GetPreferenceDisplayName(a)
                });
        }

        private string GetPreferenceDisplayName(PreferenceType preferenceType)
        {
            return preferenceType switch
            {
                PreferenceType.None => "ללא אלרגיות",
                PreferenceType.Spicy => "חריף",
                PreferenceType.Sweet => "מתוק",
                PreferenceType.Salty => "מלוח",
                PreferenceType.Sour => "חמוץ",
                PreferenceType.Umami => "אומאמי",
                PreferenceType.Tangy => "פיקנטי",
                PreferenceType.Herby => "עשבוני",
                PreferenceType.Smoky => "מעושן",
                PreferenceType.ToastedCrunchy => "קלוי",
                PreferenceType.Aromatic => "ארומטי",
                _ => preferenceType.ToString()
            };
        }
    }
}
