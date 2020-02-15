using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatumNet.Models.Contracts 
{ 

    public class CodeDateFromDateToDTO
    {
        public int CodeInt { get; set; }
        public string CodeStr { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set;  }
    }
}
