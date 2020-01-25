using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatumNet.Models.Models.Accounting
{
    public class Account
    {
        public int Id { get; set; }
        public string AccountCode { get; set; }
        public string Description { get; set;  }
        public int Level { get; set;  } 
        public int OutcomeAccount { get; set;  }
        public int Organization { get; set; }
    }
}
