
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
        public async Task<IList<ApplicationUserProfile>> GetUsers()
        {

            using (var connection = new MySqlConnection(_connectionString))
            {
                var users = await connection.QueryAsync<ApplicationUserProfile>("SELECT a.* FROM application_user a ").ConfigureAwait(false);

                foreach ( var u in users)
                {
                    var roles = await connection.QueryAsync<ApplicationRole>("SELECT ar.* FROM application_user_role aur " +
                        " INNER JOIN application_role ar ON(aur.roleId = ar.Id) " +
                        " WHERE " +
                        " aur.UserId = " + u.Id + "  ").ConfigureAwait(false);
                    u.UserRoles = roles;

                    var orgs = await connection.QueryAsync<Organization>("SELECT ao.Id, ao.Name FROM application_user_org auo " +
                        " INNER JOIN application_organization ao ON (auo.OrganizationId = ao.Id) " +
                        " WHERE " +
                        " auo.UserId = " + u.Id + "  ").ConfigureAwait(false);
                    u.UserOrgs = orgs;
                }

                return users.ToList();
            }
        }
        public async Task<IList<ApplicationRole>> GetRoles()
        {

            using (var connection = new MySqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<ApplicationRole>("SELECT a.* FROM application_role a ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }
    }
}