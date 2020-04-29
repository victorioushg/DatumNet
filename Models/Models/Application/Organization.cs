using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using DatumNet.Models.Interfaces.Application; 

namespace DatumNet.Models.Models.Application
{
    public class Organization : IOrganization
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Activity { get; set;  }
        public string FiscalID { get; set;  } 
        public string OrganizationType { get; set;  }
        public string AssosiationType { get; set;  }
        public bool Deactivated { get; set; }
        public DateTime AddedOn { get; set; }
        public string AddedBy { get; set; }
        public DateTime LastUpdatedOn { get; set; }
        public string LastUpdatedBy { get; set; }
        public DateTime FiscalPeriodFrom { get; set; }
        public DateTime FiscalPeriodTo { get; set; }
    }

    public class TypeOrganization : IOrganizationType
    {
        public string OrganizationType { get; set; }
        public string TypeDescription { get; set; }
    }

    public class TypeAssosiation : IAssosiationType
    {
        public string AssosiationType { get; set; }
        public string TypeDescription { get; set; }
    }
}

