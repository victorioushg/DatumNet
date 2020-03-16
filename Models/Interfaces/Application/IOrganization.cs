using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatumNet.Models.Interfaces.Application
{
    interface IOrganization
    {
        int Id { get; set; }
        string Name { get; set; }
        string Activity { get; set; }
        string FiscalID { get; set; }
        string OrganizationType { get; set; }
    }
}
