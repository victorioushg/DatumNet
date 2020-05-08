﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DatumNet.Models;
using Microsoft.AspNetCore.Authorization;
using System.Web;
using Newtonsoft.Json;
using System.Collections;
using System.Data;
using System.IO;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

using BaseLib.Api;
using BaseLib.Helpers;
using BaseLib.Models; 

using DatumNet.Data;
using DatumNet.Models.Models.Application;

namespace DatumNet.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : BaseApiController
    {
        /// 
        private ApplicationRepository _repo;
        public ApplicationController(ApplicationRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("organization")]
        public Task<IList<Organization>> GetOrganizations()
        {
            return _repo.GetOrganizations();
        }

        [HttpGet("organization/types")]
        public Task<IList<TypeOrganization>> GetOrganizationTypes()
        {
            return _repo.GetOrganizationTypes();
        }

        [HttpGet("assosiations")]
        public Task<IList<TypeAssosiation>> GetAssosiationTypes()
        {
            return _repo.GetAssosiationTypes();
        }

        [HttpGet("users")]
        public Task<IList<ApplicationUserProfile>> GetUsers()
        {
            return _repo.GetUsers();
        }

        [HttpGet("roles")]
        public Task<IList<ApplicationRole>> GetRoles()
        {
            return _repo.GetRoles();
        }

        [HttpGet("address/types")]
        public Task<IList<AddressTypes>> GetAddressTypes()
        {
            return _repo.GetAddressTypes();
        }

        [HttpPost("{id}/address")]
        public IActionResult InsertAddress(int id, [FromBody] Address address)
        {
            return Results(() =>
            {
                return _repo.InsertAddress(address, id);
            });
        }

        [HttpGet("{id}/addresses")]
        public IActionResult GetAddressesByEntity(int id)
        {
            return Results(() =>
            {
                return _repo.GetAddressesByEntity(id);
            });
        }

        [HttpGet("phonetypes")]
        public IActionResult GetPhoneTypes()
        {
            return Results(() =>
            {
                return EnumHelper.Enumerate<PhoneType>();
            });
        }

    }
}
