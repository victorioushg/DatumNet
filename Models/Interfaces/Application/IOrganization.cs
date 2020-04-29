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
        string AssosiationType { get; set; }
        bool Deactivated { get; set; }
        DateTime AddedOn { get; set; }
        string AddedBy { get; set; }
        DateTime LastUpdatedOn { get; set; }
        string LastUpdatedBy { get; set; }
        DateTime FiscalPeriodFrom { get; set; }
        DateTime FiscalPeriodTo { get; set; }
    }

    interface IOrganizationType
    {
        string OrganizationType { get; set; }
        string TypeDescription { get; set; }
    }

    interface IAssosiationType
    {
        string AssosiationType { get; set; }
        string TypeDescription { get; set; }
    }
}
