using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using DatumNet.Models.Interfaces.Application; 

namespace DatumNet.Models.Models.Application
{
    public class Address  
    {
        public int AddressId { get; set; }
        public string AddressType { get; set; }
        public string Address1 { get; set;  }
        public string Address2 { get; set;  } 
        public string Address3 { get; set;  }
        public string City { get; set;  }
        public string County { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }

    public class AddressTypes
    {
        public string AddressType { get; set; }
        public string TypeDescription { get; set; }
    }

}

