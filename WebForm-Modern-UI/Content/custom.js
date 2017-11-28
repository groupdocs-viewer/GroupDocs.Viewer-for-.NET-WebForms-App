///// ***************************************************** //////
///// DYNAMIC CONFIGURATIONS PARAMETERS WITH DEFAULT VALUES
///// ***************************************************** //////

// All veriables are utilized in Index.cshtml & app.js files.

var DefaultFilePath = 'calibre.docx';
var isImageToggle = false;
var RotateAngel = 0;
var ZoomValue = 100;
var WatermarkText = "Watermark Text";
var WatermarkColor = 16711680;
var WatermarkPosition = "Diagonal";
var WatermarkWidth = null;
var WatermarkOpacity = 255;
var EnableContextMenu = false;
var ShowWatermark = true;
var ShowImageToggle = true;
var ShowZooming = true;
var ShowRotateImage = true;
var ShowDownloads = true;
var ShowFileSelection = true;
var ShowThubmnailPanel = true;

function resizeIFrame() {

    ZoomValue = (ZoomValue > 10 ? ZoomValue / 100 : ZoomValue);
    ZoomValue = (ZoomValue <= 0.05 ? 0.05 : ZoomValue);
    ZoomValue = (ZoomValue >= 6 ? 6 : ZoomValue);

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

        //iframes[i].contentWindow.document.body += "<style type='text/css'>.doc-page{position:relative !important;}</style>";
        //alert(iframes[i].contentWindow.document.body);
        height = parseInt(height) + 50;

        if (!ShowWatermark)
            iframes[i].contentWindow.document.body.style = "text-align: center !important;";

        if (isImageToggle)
            iframes[i].contentWindow.document.body.style = "text-align: center !important;";

        iframes[i].style = "height:" + parseInt(height) + "px!important; width:100%!important; ";

        height = (height * (parseFloat(ZoomValue) < 1 ? 1 : parseFloat(ZoomValue)));
        height = parseInt(height);
        height = parseInt(height) + 10;

        if (ZoomValue > 1) {
            mdcards[i].style = "zoom: " + ZoomValue + "; -moz-transform: scale(" + ZoomValue + "); -moz-transform-origin: 0 0; -o-transform: scale(" + ZoomValue + "); -o-transform-origin: 0 0; -webkit-transform: scale(" + ZoomValue + "); -webkit-transform-origin: 0 0; height:" + height + "px !important; width:100%!important; overflow: visible !important;";
        }
        else {
            mdcards[i].style = "zoom: " + ZoomValue + "; -moz-transform: scale(" + ZoomValue + "); -o-transform: scale(" + ZoomValue + "); -webkit-transform: scale(" + ZoomValue + "); height:" + height + "px !important; width:100%!important; overflow: visible !important;";
        }
    }

    var selectObj = document.getElementById('zoomselect');
    if (selectObj != undefined) {
        for (var i = 0; i < selectObj.options.length; i++) {
            if (selectObj.options[i].value == ZoomValue) {
                selectObj.options[i].selected = true;
            }
        }
    }
}