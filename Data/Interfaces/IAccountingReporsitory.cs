using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using DatumNet.Models.Models.Accounting;

namespace DatumNet.Data.Interfaces
{
    public interface IAccountingReporsitory
    {
        Task<IList<Account>> GetAccounts();
        Task<IList<Policy>> GetPolicies(DateTime startDate, DateTime endDate);
    }
}
