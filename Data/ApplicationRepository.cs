
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
using DatumNet.Models.Interfaces.Application;

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
                var queryResults = await connection.QueryAsync<Organization>("SELECT a.*, b.Starts FiscalPeriodFrom, b.Ends FiscalPeriodTo " +
                    " FROM app_organization a " +
                    " LEFT JOIN (SELECT * FROM acc_fiscal_period ORDER BY ENDS DESC LIMIT 1) b ON (a.Id = b.OrganizationId) ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }

        public async Task<IList<ApplicationUserProfile>> GetUsers()
        {

            using (var connection = new MySqlConnection(_connectionString))
            {
                var users = await connection.QueryAsync<ApplicationUserProfile>("SELECT a.* FROM app_user a ").ConfigureAwait(false);

                foreach ( var u in users)
                {
                    var roles = await connection.QueryAsync<ApplicationRole>("SELECT ar.* FROM app_user_role aur " +
                        " INNER JOIN app_role ar ON(aur.roleId = ar.Id) " +
                        " WHERE " +
                        " aur.UserId = " + u.Id + "  ").ConfigureAwait(false);
                    u.UserRoles = roles;

                    var orgs = await connection.QueryAsync<Organization>("SELECT ao.Id, ao.Name FROM app_user_org auo " +
                        " INNER JOIN app_organization ao ON (auo.OrganizationId = ao.Id) " +
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
                var queryResults = await connection.QueryAsync<ApplicationRole>("SELECT a.* FROM app_role a ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }

        public async Task<IList<TypeOrganization>> GetOrganizationTypes()
        {

            using (var connection = new MySqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<TypeOrganization>("SELECT a.* FROM app_organization_type a ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }

        public async Task<IList<TypeAssosiation>> GetAssosiationTypes()
        {

            using (var connection = new MySqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<TypeAssosiation>("SELECT a.* FROM app_assosiation_type a ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }

        

        #region Addresses

        public async Task<IList<AddressTypes>> GetAddressTypes()
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<AddressTypes>("SELECT a.* FROM app_address_type a ").ConfigureAwait(false);
                return queryResults.ToList();
            }
        }                                                                                                      

        public async Task<IList<FullAddress>> GetAddressesByEntity(int entityId)
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<FullAddress>("app_Addresses_GetByEntity", new { 
                    _EntityId = entityId
                }, commandType: CommandType.StoredProcedure).ConfigureAwait(false);
                return queryResults.ToList();
            }
        } 

        public async Task<int> InsertAddress(Address address, int entityId)
        {

            using (var connection = new MySqlConnection(_connectionString))
            {
                connection.Open();
                int InsertedAddressId = 0;   
                 await connection.ExecuteAsync("app_Address_Insert",
                    new { 
                        _AddressType = address.AddressType,
                        _Address1 = address.Address1, 
                        _Address2 = address.Address2, 
                        _Address3 = address.Address3,
                        _City = address.City, 
                        _County = address.County, 
                        _State = address.State, 
                        _Country = address.County,
                        _PostalCode = address.PostalCode, 
                        _EntityAddressId = entityId, 
                        InsertedAddressId
                    }, commandType: CommandType.StoredProcedure).ConfigureAwait(false);

                return InsertedAddressId;

            }

        }

        #endregion
    }
}