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
using DatumNet.Models.Models.Accounting;
using DatumNet.Models.Contracts.Accounting;
using DatumNet.Models.Contracts;

namespace DatumNet.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountingController : ControllerBase
    {
        /// 
        private AccountingRepository   _repo;
        public AccountingController(AccountingRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("accounts")]
        public Task<IList<Account>> GetAccounts()
        {
            return _repo.GetAccounts();
        }

        [HttpGet("movements/{id}")]
        public Task<IList<AccountMovementDTO>> GetAccountMovement(string id)
        {
            var from = new DateTime(2019, 1, 1);
            var to = new DateTime(2019, 12, 31);
            return _repo.GetAccountMovements( id, from , to );
        }

    }
}
