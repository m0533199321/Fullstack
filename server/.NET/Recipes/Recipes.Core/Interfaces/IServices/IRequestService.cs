using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipes.Core.Interfaces.IServices
{
    public interface IRequestService
    {
        public Task<(string recipeName, byte[] fileData)> CallPythonApi(string request);
    }
}
