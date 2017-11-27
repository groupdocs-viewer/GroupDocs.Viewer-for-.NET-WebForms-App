///// ***************************************************** //////
///// DYNAMIC CONFIGURATIONS PARAMETERS WITH DEFAULT VALUES
///// ***************************************************** //////

// All veriables are utilized in Index.cshtml & app.js files.

var DefaultFilePath = 'calibre.docx';
var isImageToggle = false;
var RotateAngel = 0;
var WatermarkText = "Watermark Text";
var WatermarkColor = 16711680;
var WatermarkPosition = "Diagonal";
var WatermarkWidth = null;
var WatermarkOpacity = 255;
var EnableContextMenu = false;
var ShowWatermark = true;
var ShowImageToggle = true;
var ShowRotateImage = false;
var ShowDownloads = true;
var ShowFileSelection = true;
var ShowThubmnailPanel = true;

function resizeIFrame() {

    var mdcards = document.querySelectorAll("md-card");
    var iframes = document.querySelectorAll("iframe");

    for (var i = 0; i < iframes.length; i++) {
        var body = iframes[i].contentWindow.document.body,
        html = iframes[i].contentWindow.document.documentElement,
        height = Math.max(
       body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight
        ),
        width = Math.max(
            body.scrollWidth,
            body.offsetWidth,
            html.clientWidth,
            html.scrollWidth,
            html.offsetWidth
        );

        if (!EnableContextMenu)
            iframes[i].contentWindow.document.body.setAttribute("oncontextmenu", "return false;");

        height = parseInt(height) + 50;

        if (!ShowWatermark)
            iframes[i].contentWindow.document.body.style = "text-align: center !important;";

        if (isImageToggle)
            iframes[i].contentWindow.document.body.style = "text-align: center !important;";

        iframes[i].style = "height:" + parseInt(height) + "px!important; width:100%!important; ";

        mdcards[i].style = "height:" + parseInt(height) + "px !important; width:100%!important; overflow: visible !important;";
    }
}