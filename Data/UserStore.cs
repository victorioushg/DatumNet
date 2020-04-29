using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using DatumNet.Models;

namespace DatumNet.Data
{
    public class UserStore : IUserStore<ApplicationUser>, IUserEmailStore<ApplicationUser>, IUserPhoneNumberStore<ApplicationUser>,
        IUserTwoFactorStore<ApplicationUser>, IUserPasswordStore<ApplicationUser>, IUserRoleStore<ApplicationUser>
    {
        private readonly string _connectionString;

        public UserStore(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
                // T-SQL
                //user.Id = await connection.QuerySingleAsync<int>($@"INSERT INTO [app_user] ([UserName], [NormalizedUserName], [Email],
                //    [NormalizedEmail], [EmailConfirmed], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled])
                //    VALUES (@{nameof(ApplicationUser.UserName)}, @{nameof(ApplicationUser.NormalizedUserName)}, @{nameof(ApplicationUser.Email)},
                //    @{nameof(ApplicationUser.NormalizedEmail)}, @{nameof(ApplicationUser.EmailConfirmed)}, @{nameof(ApplicationUser.PasswordHash)},
                //    @{nameof(ApplicationUser.PhoneNumber)}, @{nameof(ApplicationUser.PhoneNumberConfirmed)}, @{nameof(ApplicationUser.TwoFactorEnabled)});
                //    SELECT CAST(SCOPE_IDENTITY() as int)", user);

                // MySQL
                user.Id = await connection.QuerySingleAsync<int>($@"INSERT INTO app_User (UserName, NormalizedUserName, Email,
                    NormalizedEmail, EmailConfirmed, PasswordHash, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled)
                    VALUES (@{nameof(ApplicationUser.UserName)}, @{nameof(ApplicationUser.NormalizedUserName)}, @{nameof(ApplicationUser.Email)},
                    @{nameof(ApplicationUser.NormalizedEmail)}, @{nameof(ApplicationUser.EmailConfirmed)}, @{nameof(ApplicationUser.PasswordHash)},
                    @{nameof(ApplicationUser.PhoneNumber)}, @{nameof(ApplicationUser.PhoneNumberConfirmed)}, @{nameof(ApplicationUser.TwoFactorEnabled)});
                    SELECT LAST_INSERT_ID() ", user).ConfigureAwait(false);
            }

            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
                //T-SQL 
                //await connection.ExecuteAsync($"DELETE FROM [ApplicationUser] WHERE [Id] = @{nameof(ApplicationUser.Id)}", user);

                //MySQL
                await connection.ExecuteAsync($"DELETE FROM app_user WHERE Id = @{nameof(ApplicationUser.Id)}", user).ConfigureAwait(false);
            }

            return IdentityResult.Success;
        }

        public async Task<ApplicationUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
                // T-SQL
                //return await connection.QuerySingleOrDefaultAsync<ApplicationUser>($@"SELECT * FROM [ApplicationUser]
                //    WHERE [Id] = @{nameof(userId)}", new { userId });

                // MySQL
                return await connection.QuerySingleOrDefaultAsync<ApplicationUser>($@"SELECT * FROM app_user
                    WHERE Id = @{nameof(userId)}", new { userId }).ConfigureAwait(false);
            }
        }

        public async Task<ApplicationUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
                // T-SQL
                //return await connection.QuerySingleOrDefaultAsync<ApplicationUser>($@"SELECT * FROM [app_user]
                //    WHERE [NormalizedUserName] = @{nameof(normalizedUserName)}", new { normalizedUserName });

                // MySQL
                return await connection.QuerySingleOrDefaultAsync<ApplicationUser>($@"SELECT * FROM app_user
                    WHERE NormalizedUserName = @{nameof(normalizedUserName)}", new { normalizedUserName }).ConfigureAwait(false);
            }
        }

        public Task<string> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedUserName);
        }

        public Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id.ToString());
        }

        public Task<string> GetUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task SetNormalizedUserNameAsync(ApplicationUser user, string normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            return Task.FromResult(0);
        }

        public Task SetUserNameAsync(ApplicationUser user, string userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            return Task.FromResult(0);
        }

        public async Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
                //T-SQL
                //await connection.ExecuteAsync($@"UPDATE [ApplicationUser] SET
                //    [UserName] = @{nameof(ApplicationUser.UserName)},
                //    [NormalizedUserName] = @{nameof(ApplicationUser.NormalizedUserName)},
                //    [Email] = @{nameof(ApplicationUser.Email)},
                //    [NormalizedEmail] = @{nameof(ApplicationUser.NormalizedEmail)},
                //    [EmailConfirmed] = @{nameof(ApplicationUser.EmailConfirmed)},
                //    [PasswordHash] = @{nameof(ApplicationUser.PasswordHash)},
                //    [PhoneNumber] = @{nameof(ApplicationUser.PhoneNumber)},
                //    [PhoneNumberConfirmed] = @{nameof(ApplicationUser.PhoneNumberConfirmed)},
                //    [TwoFactorEnabled] = @{nameof(ApplicationUser.TwoFactorEnabled)}
                //    WHERE [Id] = @{nameof(ApplicationUser.Id)}", user);

                //MySQL
                await connection.ExecuteAsync($@"UPDATE app_User SET
                    UserName = @{nameof(ApplicationUser.UserName)},
                    NormalizedUserName = @{nameof(ApplicationUser.NormalizedUserName)},
                    Email = @{nameof(ApplicationUser.Email)},
                    NormalizedEmail = @{nameof(ApplicationUser.NormalizedEmail)},
                    EmailConfirmed = @{nameof(ApplicationUser.EmailConfirmed)},
                    PasswordHash = @{nameof(ApplicationUser.PasswordHash)},
                    PhoneNumber = @{nameof(ApplicationUser.PhoneNumber)},
                    PhoneNumberConfirmed = @{nameof(ApplicationUser.PhoneNumberConfirmed)},
                    TwoFactorEnabled = @{nameof(ApplicationUser.TwoFactorEnabled)}
                    WHERE Id = @{nameof(ApplicationUser.Id)}", user).ConfigureAwait(false);
            }

            return IdentityResult.Success;
        }

        public Task SetEmailAsync(ApplicationUser user, string email, CancellationToken cancellationToken)
        {
            user.Email = email;
            return Task.FromResult(0);
        }

        public Task<string> GetEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task SetEmailConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken cancellationToken)
        {
            user.EmailConfirmed = confirmed;
            return Task.FromResult(0);
        }

        public async Task<ApplicationUser> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                //T-SQL
                //return await connection.QuerySingleOrDefaultAsync<ApplicationUser>($@"SELECT * FROM [ApplicationUser]
                //    WHERE [NormalizedEmail] = @{nameof(normalizedEmail)}", new { normalizedEmail });

                //MySQL
                return await connection.QuerySingleOrDefaultAsync<ApplicationUser>($@"SELECT * FROM app_user
                    WHERE NormalizedEmail = @{nameof(normalizedEmail)}", new { normalizedEmail }).ConfigureAwait(false);
            }
        }

        public Task<string> GetNormalizedEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedEmail);
        }

        public Task SetNormalizedEmailAsync(ApplicationUser user, string normalizedEmail, CancellationToken cancellationToken)
        {
            user.NormalizedEmail = normalizedEmail;
            return Task.FromResult(0);
        }

        public Task SetPhoneNumberAsync(ApplicationUser user, string phoneNumber, CancellationToken cancellationToken)
        {
            user.PhoneNumber = phoneNumber;
            return Task.FromResult(0);
        }

        public Task<string> GetPhoneNumberAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumber);
        }

        public Task<bool> GetPhoneNumberConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumberConfirmed);
        }

        public Task SetPhoneNumberConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken cancellationToken)
        {
            user.PhoneNumberConfirmed = confirmed;
            return Task.FromResult(0);
        }

        public Task SetTwoFactorEnabledAsync(ApplicationUser user, bool enabled, CancellationToken cancellationToken)
        {
            user.TwoFactorEnabled = enabled;
            return Task.FromResult(0);
        }

        public Task<bool> GetTwoFactorEnabledAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.TwoFactorEnabled);
        }

        public Task SetPasswordHashAsync(ApplicationUser user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.FromResult(0);
        }

        public Task<string> GetPasswordHashAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash != null);
        }

        public async Task AddToRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
                var normalizedName = roleName.ToUpper();

                //T-SQL
                //var roleId = await connection.ExecuteScalarAsync<int?>($"SELECT [Id] FROM [ApplicationRole] WHERE [NormalizedName] = @{nameof(normalizedName)}", new { normalizedName });
                //if (!roleId.HasValue)
                //    roleId = await connection.ExecuteAsync($"INSERT INTO [ApplicationRole]([Name], [NormalizedName]) VALUES(@{nameof(roleName)}, @{nameof(normalizedName)})",
                //        new { roleName, normalizedName });

                //await connection.ExecuteAsync($"IF NOT EXISTS(SELECT 1 FROM [ApplicationUserRole] WHERE [UserId] = @userId AND [RoleId] = @{nameof(roleId)}) " +
                //    $"INSERT INTO [ApplicationUserRole]([UserId], [RoleId]) VALUES(@userId, @{nameof(roleId)})",
                //    new { userId = user.Id, roleId });

                //MySQL
                var roleId = await connection.ExecuteScalarAsync<int?>($"SELECT Id FROM app_Role WHERE NormalizedName = @{nameof(normalizedName)}", new { normalizedName }).ConfigureAwait(false);
                if (!roleId.HasValue)
                    roleId = await connection.ExecuteAsync($"INSERT INTO ApplicationRole(Name, NormalizedName) VALUES(@{nameof(roleName)}, @{nameof(normalizedName)})",
                        new { roleName, normalizedName }).ConfigureAwait(false);

                await connection.ExecuteAsync($"IF NOT EXISTS(SELECT 1 FROM app_user_role WHERE UserId = @userId AND RoleId = @{nameof(roleId)}) " +
                    $"INSERT INTO ApplicationUserRole(UserId, RoleId) VALUES(@userId, @{nameof(roleId)})",
                    new { userId = user.Id, roleId }).ConfigureAwait(false);
            }
        }

        public async Task RemoveFromRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                //T-SQL
                //await connection.OpenAsync(cancellationToken);
                //var roleId = await connection.ExecuteScalarAsync<int?>("SELECT [Id] FROM [ApplicationRole] WHERE [NormalizedName] = @normalizedName", new { normalizedName = roleName.ToUpper() });
                //if (!roleId.HasValue)
                //    await connection.ExecuteAsync($"DELETE FROM [ApplicationUserRole] WHERE [UserId] = @userId AND [RoleId] = @{nameof(roleId)}", new { userId = user.Id, roleId });

                //MySQL
                await connection.OpenAsync(cancellationToken);
                var roleId = await connection.ExecuteScalarAsync<int?>("SELECT Id FROM app_Role WHERE NormalizedName = @normalizedName", 
                    new { normalizedName = roleName.ToUpper() }).ConfigureAwait(false);
                if (!roleId.HasValue)
                    await connection.ExecuteAsync($"DELETE FROM app_user_role WHERE UserId = @userId AND RoleId = @{nameof(roleId)}", 
                        new { userId = user.Id, roleId }).ConfigureAwait(false);

            }
        }

        public async Task<IList<string>> GetRolesAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);

                //T-SQL
                //var queryResults = await connection.QueryAsync<string>("SELECT r.[Name] FROM [ApplicationRole] r INNER JOIN [ApplicationUserRole] ur ON ur.[RoleId] = r.Id " +
                //    "WHERE ur.UserId = @userId", new { userId = user.Id });

                //MySQL
                var queryResults = await connection.QueryAsync<string>("SELECT r.Name FROM app_Role r INNER JOIN app_user_role ur ON ur.RoleId = r.Id " +
                    "WHERE ur.UserId = @userId", new { userId = user.Id }).ConfigureAwait(false);

                return queryResults.ToList();
            }
        }

        public async Task<bool> IsInRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                //T-SQL
                //var roleId = await connection.ExecuteScalarAsync<int?>("SELECT [Id] FROM [ApplicationRole] WHERE [NormalizedName] = @normalizedName", new { normalizedName = roleName.ToUpper() });
                //if (roleId == default(int)) return false;
                //var matchingRoles = await connection.ExecuteScalarAsync<int>($"SELECT COUNT(*) FROM [ApplicationUserRole] WHERE [UserId] = @userId AND [RoleId] = @{nameof(roleId)}",
                //    new { userId = user.Id, roleId });

                //MySQL
                var roleId = await connection.ExecuteScalarAsync<int?>("SELECT Id FROM app_Role WHERE NormalizedName = @normalizedName", 
                    new { normalizedName = roleName.ToUpper() }).ConfigureAwait(false);
                if (roleId == default(int)) return false;
                var matchingRoles = await connection.ExecuteScalarAsync<int>($"SELECT COUNT(*) FROM app_user_role WHERE UserId = @userId AND RoleId = @{nameof(roleId)}",
                    new { userId = user.Id, roleId }).ConfigureAwait(false);

                return matchingRoles > 0;
            }
        }

        public async Task<IList<ApplicationUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new MySqlConnection(_connectionString))
            {
                //T-SQL
                //var queryResults = await connection.QueryAsync<ApplicationUser>("SELECT u.* FROM [ApplicationUser] u " +
                //    "INNER JOIN [ApplicationUserRole] ur ON ur.[UserId] = u.[Id] INNER JOIN [ApplicationRole] r ON r.[Id] = ur.[RoleId] WHERE r.[NormalizedName] = @normalizedName",
                //    new { normalizedName = roleName.ToUpper() });

                //MySQL
                var queryResults = await connection.QueryAsync<ApplicationUser>("SELECT u.* FROM app_user u " +
                    "INNER JOIN app_user_role ur ON ur.UserId = u.Id INNER JOIN app_Role r ON r.Id = ur.RoleId WHERE r.NormalizedName = @normalizedName",
                    new { normalizedName = roleName.ToUpper() }).ConfigureAwait(false);

                return queryResults.ToList();
            }
        }

        public void Dispose()
        {
            // Nothing to dispose.
        }
    }
}
