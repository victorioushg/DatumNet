
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Dapper;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using DatumNet.Data.Interfaces;
using DatumNet.Models.Models.Accounting;
using DatumNet.Models.Contracts.Accounting;
using System.Threading.Tasks;
using System;

namespace DatumNet.Data
{
    public class AccountingRepository : IAccountingReporsitory
    {
        private readonly string _connectionString;

        public AccountingRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IList<Account>> GetAccounts()
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<Account>("SELECT a.* FROM acc_accounts_codes a ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }

        public async Task<IList<AccountMovementDTO>> GetAccountMovements(string AccountCode, DateTime from, DateTime To)
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                // Todo Get Fiscal Period And Organization
                var queryResults = await connection.QueryAsync<AccountMovementDTO>(
                           " select SUBSTRING(b.AccountCode, 1, " + AccountCode.Length + ") AccountCode, a.Id PolicyId, a.PolicyCode, a.PolicyDate, b.Reference, b.Description, b.Amount "
                           + " from acc_policy_header a "
                           + " left join acc_policy_rows b on (a.Id = b.PolicyId) "
                           + " Where "
                           + " a.PolicyDate >= '" + from.ToString("yyyy-MM-dd") + "' and "
                           + " a.PolicyDate <= '" + To.ToString("yyyy-MM-dd") + "' and "
                           + " a.Conciliated = 1 and "
                           + " SUBSTRING(b.AccountCode, 1, " + AccountCode.Length + ") = '" + AccountCode + "' and "
                           //+ " ( isnull(a.FiscalPeriod)  or a.FiscalPeriod = " + 1 + ") and " 
                           + " a.Organization = " + 1 + " "
                           + " order by a.PolicyDate desc, a.PolicyCode ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }
        
        public async Task<IList<Policy>> GetPolicies(DateTime startDate, DateTime endDate)
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<Policy>("SELECT a.* FROM acc_policy_header a "  +
                    " Where PolicyDate Between '" + startDate.ToString("yyyy-MM-dd")
                    + "' and '" + endDate.ToString("yyyy-MM-dd")
                    + "'  ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }

        public async Task<IList<PolicyLinePlus>> GetPolicyLines(int PolicyId)
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                // Todo Get Fiscal Period And Organization
                var queryResults = await connection.QueryAsync<PolicyLinePlus>(
                           "select * from acc_policy_rows where policyId=" + PolicyId + " order by RowOrder").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }

    }
}