using System;
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
//using SendGrid.Helpers.Mail;
//using Syncfusion.XlsIO;
using System.Collections;
using System.Data;
using System.IO;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

using DatumNet.Data;
using DatumNet.Models.Models.Application;
//using DatumNet.Models.Contracts.Accounting;
using DatumNet.Models.Contracts;

namespace DatumNet.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        /// 
        private ApplicationRepository  _repo;
        public ApplicationController(ApplicationRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("organization")]
        public Task<IList<Organization>> GetOrganizations()
        {
            return _repo.GetOrganizations();
        }

        [HttpGet("users")]
        public Task<IList<ApplicationUser>> GetUsers()
        {
            return _repo.GetUsers();
        }

        //[HttpGet("movements/{id}/{start}/{end}")]
        //public Task<IList<AccountMovementDTO>> GetAccountMovement(string id, DateTime start, DateTime end )
        //{
        //    return _repo.GetAccountMovements( id, start , end );
        //}

    }
}
