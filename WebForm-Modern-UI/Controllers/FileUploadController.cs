using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web;
using System.Net.Http;
using Viewer_Modren_UI.Helpers;

namespace WebForm_Modern_UI
{
    public class FileUploadController : ApiController
    {
        [HttpPost]
        public void Get()
        {
            try
            {
                HttpResponseMessage response = new HttpResponseMessage();
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    foreach (string file in httpRequest.Files)
                    {
                        var postedFile = httpRequest.Files[file];
                        var filePath = Utils._storagePath + "\\" + postedFile.FileName;
                        postedFile.SaveAs(filePath);
                    }
                }
            }
            catch (Exception exc)
            {
                throw exc;
            }
        }
    }
}