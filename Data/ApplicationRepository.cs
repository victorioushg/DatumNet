
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Dapper;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using DatumNet.Data.Interfaces;
using DatumNet.Models.Models.Application;
using DatumNet.Models;
using System.Threading.Tasks;
using System;

namespace DatumNet.Data
{
    public class ApplicationRepository : IApplicationReporsitory 
    {

        private readonly string _connectionString;

        public ApplicationRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IList<Organization>> GetOrganizations()
        {

            using (var connection = new MySqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<Organization>("SELECT a.* FROM application_organization a ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }
        public async Task<IList<ApplicationUser>> GetUsers()
        {

            using (var connection = new MySqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<ApplicationUser>("SELECT a.* FROM application_user a ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }
    }
}