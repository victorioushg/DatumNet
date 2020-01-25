using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatumNet.Models.Interfaces.Accounting
{
    interface IAccount
    {
        int Id { get; set; }
        string AccountCode { get; set; }
        string Description { get; set; }
        int Level { get; set; }
        int OutcomeAccount { get; set; }
        int Organization { get; set; }
    }
}
