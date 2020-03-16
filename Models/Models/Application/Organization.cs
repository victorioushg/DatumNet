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
    }
}
