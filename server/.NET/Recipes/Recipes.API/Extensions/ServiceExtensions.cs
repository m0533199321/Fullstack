using Recipes.API;
using Recipes.Core;
using Recipes.Core.Interfaces.IRepository;
using Recipes.Core.Interfaces.IServices;
using Recipes.Data.Repositories;
using Recipes.Data.Repository;
using Recipes.Service.Services;
using Microsoft.EntityFrameworkCore;

namespace Recipes.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddDependencyInjectoions(this IServiceCollection services)
        {

            services.AddAutoMapper(typeof(MappingProfile), typeof(MappingPostProfile));

            // Register repositories
            services.AddScoped<IRepositoryManager, RepositoryManager>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRecipeRepository, RecipeRepository>();
            services.AddScoped<ICommentRepository, CommentRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IAllergiesRepository, AllergiesRepository>();
            services.AddScoped<IPreferencesRepository, PreferencesRepository>();

            // Register services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IS3Service, S3Service>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRecipeService, RecipeService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IRequestService,  RequestService>();
            services.AddScoped<IAllergiesService, AllergiesService>();
            services.AddScoped<IPreferencesService, PreferencesService>();

        }


    }
}
