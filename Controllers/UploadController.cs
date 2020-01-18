//using System;
//using System.Collections.Generic;
//using System.Diagnostics;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Logging;
//using DatumNet.Models;
//using Microsoft.AspNetCore.Authorization;
//using System.Web;
//using Newtonsoft.Json;
////using SendGrid.Helpers.Mail;
////using Syncfusion.XlsIO;
//using System.Collections;
//using System.Data;
//using System.IO;

//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Hosting;

//namespace DatumNet.Controllers
//{
//    [Authorize]
//    public class UploadController : Controller
//    {
//        /// 
//        private IHostingEnvironment _env;
//        public UploadController(IHostingEnvironment env)
//        {
//            _env = env;
//        }

//        public void SaveDefault(IEnumerable<IFormFile> EmployeeGridPhoto)

//        {

//            foreach (var file in EmployeeGridPhoto)

//            {

//                //var fileName = Path.GetFileName(file.FileName);

//                //var destinationPath = Path.Combine(Server.MapPath("~/Content/ejThemes/images/Employees"), fileName);

//                //file.SaveAs(destinationPath);

//                var webRoot = _env.WebRootPath;
//                var fileName = System.IO.Path.Combine(webRoot, "test.txt");
//                System.IO.File.WriteAllText(fileName, "Hello World!");


//            }

//        }

//        public void RemoveDefault(string[] fileNames)

//        {

//            foreach (var fullName in fileNames)

//            {

//                var fileName = Path.GetFileName(fullName);

//                var physicalPath = Path.Combine(Server.MapPath("~/Content/ejThemes/images/Employees"), fileName);

//                if (System.IO.File.Exists(physicalPath))

//                {

//                    System.IO.File.Delete(physicalPath);

//                }

//            }
//        }


//        protected bool additionalClient = false;
//        protected string filePath = "";

//        public void ProcessRequest(HttpContext context)
//        {
//            try
//            {
//                string targetFolder = HttpContext.Current.Server.MapPath("") + "\\UploadExcel";
//                if (!Directory.Exists(targetFolder))
//                {
//                    Directory.CreateDirectory(targetFolder);
//                }
//                HttpRequest request = context.Request;
//                HttpFileCollection uploadedFiles = context.Request.Files;
//                if (uploadedFiles != null && uploadedFiles.Count > 0)
//                {
//                    for (int i = 0; i < uploadedFiles.Count; i++)
//                    {
//                        string fileName = uploadedFiles[i].FileName;
//                        int indx = fileName.LastIndexOf("\\");
//                        if (indx > -1)
//                        {
//                            fileName = fileName.Substring(indx + 1);
//                        }
//                        uploadedFiles[i].SaveAs(targetFolder + "\\" + fileName);
//                        filePath = (targetFolder + "\\" + fileName);
//                    }

//                    // parameters from uploader
//                    var param = HttpContext.Current.Request.Headers;
//                    var preheaders = int.Parse(param["numberOfPreHeaders"]);

//                    ExcelEngine excelEngine = new ExcelEngine();

//                    IWorkbook workbook = excelEngine.Excel.Workbooks.Open(targetFolder + "\\" + uploadedFiles[0].FileName);
//                    IWorksheet worksheet = workbook.Worksheets[0];

//                    var caller = context.Request.UrlReferrer.Segments.Last();
//                    var gData = GetData(worksheet, caller, preheaders);

//                    DataTable table = worksheet.ExportDataTable(gData,
//                        ExcelExportDataTableOptions.ColumnNames |
//                        ExcelExportDataTableOptions.ComputedFormulaValues);
//                    var data = Syncfusion.JavaScript.Utils.DataTableToJson(table);

//                    // To Do Sanitized DATA

//                    var FinalData = JsonConvert.SerializeObject(data); // data should be sanitized

//                    context.Response.Write(FinalData);
//                }

//            }
//            catch (Exception ex)
//            {
//                // todo make sure we always send user-friendly info
//                context.Response.StatusCode = 400;
//                context.Response.Write(ex.Message.Replace("\n", "<br />"));
//            }
//        }

//        public bool IsReusable
//        {
//            get
//            {
//                return false;
//            }
//        }

//        private IRange GetData(IWorksheet worksheet, string caller, int numberOfPreHeaders = 0)
//        {
//            // return data with columns names
//            var range = worksheet.UsedRange;
//            return range[numberOfPreHeaders, 1, range.LastRow, range.LastColumn];
//        }
//    }
//}
