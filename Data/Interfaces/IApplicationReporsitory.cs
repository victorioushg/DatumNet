using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using DatumNet.Models.Models.Application;
using DatumNet.Models;


namespace DatumNet.Data.Interfaces
{
    public interface IApplicationReporsitory
    {
        Task<IList<Organization>> GetOrganizations();
        Task<IList<ApplicationUserProfile>> GetUsers();
    }
}
