using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Recipes.Core.Interfaces.IServices;

namespace Recipes.Service.Services
{
    public class RequestService : Core.Interfaces.IServices.IRequestService
    {
        private static readonly HttpClient client = new HttpClient();

        public async Task<(string recipeName, byte[] fileData)> CallPythonApi(string request)
        {
            string url = "http://localhost:5000/api/recipe";
            try
            {
                string url1 = url + "/name";
                var payload1 = new { request = request };
                var jsonPayload1 = JsonConvert.SerializeObject(payload1);
                var content1 = new StringContent(jsonPayload1, Encoding.UTF8, "application/json");

                HttpResponseMessage response1 = await client.PostAsync(url1, content1);
                response1.EnsureSuccessStatusCode();

                string responseBody1 = await response1.Content.ReadAsStringAsync();
                dynamic data = JsonConvert.DeserializeObject(responseBody1);
                string recipeName = data.recipe_name;

                string url2 = url + "/file";
                var payload2 = new { request = request, recipe_name = recipeName };
                var jsonPayload2 = JsonConvert.SerializeObject(payload2);
                var content2 = new StringContent(jsonPayload2, Encoding.UTF8, "application/json");

                HttpResponseMessage response2 = await client.PostAsync(url2, content2);
                response2.EnsureSuccessStatusCode();

                byte[] fileData = await response2.Content.ReadAsByteArrayAsync();

                return (recipeName, fileData);
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("Error: " + e.Message);
                return (null, null);
            }
        }
    }
}
