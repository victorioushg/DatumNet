﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

using DatumNet.Models.Models.Application; 

namespace DatumNet.Models
{
    public class ApplicationUser
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string NormalizedUserName { get; set; }

        public string Email { get; set; }

        public string NormalizedEmail { get; set; }

        public bool EmailConfirmed { get; set; }

        public string PasswordHash { get; set; }

        public string PhoneNumber { get; set; }

        public bool PhoneNumberConfirmed { get; set; }

        public bool TwoFactorEnabled { get; set; }

    }

    public class ApplicationUserProfile : ApplicationUser
    {
        public string FirstName { get; set;  }
        public string LastName { get; set; }
        public DateTime BirthDay { get; set; }

        public IEnumerable<ApplicationRole> UserRoles { get; set; }
        public IEnumerable<Organization> UserOrgs { get; set; }

    }
}
