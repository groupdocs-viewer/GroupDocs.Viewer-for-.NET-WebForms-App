using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Results;
using GroupDocs.Viewer.Domain;
using GroupDocs.Viewer.Handler;
using Viewer_Modren_UI.Helpers;

namespace WebForm_Modern_UI
{
    public class FilesController : ApiController
    {
        public JsonResult<List<string>> Get()
        {
            ViewerHtmlHandler handler = Utils.CreateViewerHtmlHandler();
            List<FileDescription> tree = null;
            tree = handler.GetFileList().Files;
            List<String> result = tree.Where(
                x => x.Name != "README.txt"
                     && !x.IsDirectory
                     && !String.IsNullOrWhiteSpace(x.Name)
                     && !String.IsNullOrWhiteSpace(x.FileFormat)
            ).Select(x => x.Name).ToList();

            return Json(result);
        }
    }
}
