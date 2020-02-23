using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatumNet.Models.Contracts.Accounting
{
    public class AccountMovementDTO
    {
        public string AccountCode { get; set; }
        public int PolicyId { get; set; }
        public string PolicyCode { get; set; } 
        public DateTime PolicyDate { get; set; }
        public string Reference { get; set;  }
        public string Description { get; set;  } 
        public decimal Amount { get; set;  }
    }
}
