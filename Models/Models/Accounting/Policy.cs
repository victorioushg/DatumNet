using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatumNet.Models.Models.Accounting
{
    public class Policy
    {
        public int Id { get; set; }
        public string PolicyCode { get; set; }
        public DateTime PolicyDate { get; set;  }
        public string Description { get; set;  } 
        public float? Debits { get; set;  }
        public float? Credits { get; set; }
        public int Conciliated { get; set; }
        public int? SourceRule { get; set; }
        public DateTime BlockDate { get; set; }
        public int? FiscalPeriod { get; set; }
        public int? Organization { get; set;  }
        public float? Due { get { return Debits + Credits; } }
    }

    public class PolicyLine
    {
        public int PolicyId { get; set; }
        public int RowOrder { get; set; }
        public string AccountCode { get; set; }
        public string Reference { get; set; }
        public string Description { get; set; }
        public double Amount { get; set; }
        public int DebitCredit { get; set; }
        public int? SourceRule { get; set; } 
    }

    public class PolicyLinePlus : PolicyLine
    {
        public double Debit { get { return DebitCredit == 0 ? Amount : 0.00; } }
        public double Credit { get { return DebitCredit == 1 ? Math.Abs(Amount) : 0.00; } }
    }
}
