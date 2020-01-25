
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Dapper;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using DatumNet.Data.Interfaces;
using DatumNet.Models.Models.Accounting;
using System.Threading.Tasks;

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
                var queryResults = await connection.QueryAsync<Account>("SELECT a.* FROM acc_accounts_codes a ");
                return queryResults.ToList();
            }
        }

    }
}