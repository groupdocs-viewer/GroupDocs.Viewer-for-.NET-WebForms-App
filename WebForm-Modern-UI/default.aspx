<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="WebForm_Modern_UI._default" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>GroupDocs.Viewer for .NET (Web Forms)</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Roboto+Condensed:400,700">
    <link href="Content/style.css" rel="stylesheet"/>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-aria.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-resource.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js"></script>
    <script src="Content/custom.js"></script>
    <script>

        // For complete documentation, please visit: https://docs.groupdocs.com/display/viewernet/GroupDocs.Viewer+for+.NET+-+WebForm+Modern+UI
        // Custom.js should be called before this JS parameter configurationns.

        ///// ********************************* //////
        ///// DYNAMIC CONFIGURATIONS JS PARAMETERS
        ///// By Default all properties are set to visible all tools.
        ///// ********************************* //////

        // Un-comment to Show/Hide Toolbar Controls
        //ShowWatermark = false;
        //ShowImageToggle = false;
        //ShowZooming = false;
        //ShowDownloads = false;
        //ShowPrint = false;
        //ShowFileSelection = false;
        //ShowThubmnailPanel = false;
        //ShowPagingPanel = false;
        //EnableContextMenu = true;

        // Set Default values
        // DefaultFilePath: leave empty to skip default file loading, defined file name should be available in application 'App_Data' folder
        DefaultFilePath = 'calibre.docx';
        isImageToggle = false; // set true to display image mode rendering by default.
        RotateAngel = 0; // integer value e.g 0 or 90 or 180 or 270.
        ZoomValue = 100; // integer values, zoom level default value in percentage (%) 5% to 600%.

        // Set Watermark properties.
        WatermarkText = "my watermark text";
        WatermarkColor = 4366342; // integer values represents the ARGB color.
        // WatermarkPosition: may be Diagonal, TopLeft, TopCenter, TopRight, BottomLeft, BottomCenter, BottomRight
        WatermarkPosition = 'Diagonal';
        WatermarkWidth = 70.0; // float values.
        WatermarkOpacity = 180; // integer values.
    </script>
    <script src="/Content/app.js"></script>
    <script src="app.directive.autoresize.js"></script>
    <script src="app.controller.toolbar.js"></script>
    <script src="app.controller.pages.js"></script>
    <script src="app.run.js"></script>
</head>
<body oncontextmenu="if (!EnableContextMenu) return false;">

<div ng-app="GroupDocsViewerApp" ng-cloak flex layout="column" style="height: 100%;">
<md-toolbar ng-controller="ToolbarController" layout="row" hide-print md-whiteframe="4" class="md-toolbar-tools md-scroll-shrink">
    <md-button class="md-icon-button" ng-click="toggleLeft()" ng-hide="ShowHideTools.IsThubmnailPanel">
        <md-icon>menu</md-icon>
    </md-button>
    <a href="/">
        <img src="/Content/GDVLogo.png"/>
    </a>
    <span flex></span>
    <md-switch ng-change="onSwitchChange(data.toggleView)" ng-model="data.toggleView" aria-label="HTML View" ng-hide="ShowHideTools.IsShowImageToggle" ng-true-value="'Image View'" ng-false-value="'HTML View'">
        {{ data.toggleView }}
        <md-tooltip>Toggle <span ng-hide="isImage">Image</span><span ng-hide="!isImage">HTML</span> View</md-tooltip>
    </md-switch>
    <md-button ng-click="rotateDocument()" class="md-icon-button" ng-disabled="!isImage" ng-hide="ShowHideTools.IsShowRotateImage">
        <md-icon>rotate_left</md-icon>
        <md-tooltip>Rotate</md-tooltip>
    </md-button>
    <md-button ng-click="nextSearch()" ng-disabled="isImage" class="md-icon-button" ng-disabled="!selectedFile" ng-hide="ShowHideTools.IsFileSelection">
        <md-icon>keyboard_arrow_down</md-icon>
        <md-tooltip>Search Downward</md-tooltip>
    </md-button>
    <input id="searchBox" ng-disabled="isImage" my-enter="navigateSearch()" value="" placeholder="search..." class="input_search"/>

    <md-button ng-click="previousSearch()" ng-disabled="isImage" class="md-icon-button" ng-disabled="!selectedFile" ng-hide="ShowHideTools.IsFileSelection">
        <md-icon>keyboard_arrow_up</md-icon>
        <md-tooltip>Search Upward</md-tooltip>
    </md-button>
    <md-button class="md-icon-button" ng-click="showTabDialog($event)" ng-hide="ShowHideTools.IsFileSelection">
        <md-icon md-menu-origin md-menu-align-target>library_books</md-icon>
        <md-tooltip>File Manager</md-tooltip>
    </md-button>

    <md-button ng-click="previousDocument()" class="md-icon-button" ng-disabled="!selectedFile" ng-hide="ShowHideTools.IsFileSelection">
        <md-icon>navigate_before</md-icon>
        <md-tooltip>Previous Document</md-tooltip>
    </md-button>
    <span>{{ selectedFile }} <md-tooltip>Current Selected File</md-tooltip></span>
    <md-button ng-click="nextDocument()" class="md-icon-button" ng-disabled="!selectedFile" ng-hide="ShowHideTools.IsFileSelection">
        <md-icon>navigate_next</md-icon>
        <md-tooltip>Next Document</md-tooltip>
    </md-button>
    <md-menu ng-hide="ShowHideTools.IsShowDownloads">
        <md-button class="md-icon-button" ng-click="this.openMenu($mdOpenMenu, $event)">
            <md-icon>file_download</md-icon>
            <md-tooltip>Download Document</md-tooltip>
        </md-button>
        <md-menu-content width="4">
            <md-menu-item ng-hide="ShowHideTools.IsShowDownloads">
                <md-button ng-href="/downloadpdf?file={{ selectedFile }}&watermarkText={{Watermark.Text}}&watermarkColor={{Watermark.Color}}&watermarkPosition={{Watermark.Position}}&watermarkWidth={{Watermark.Width}}&watermarkOpacity={{Watermark.Opacity}}&isdownload=false"
                           target="_blank" ng-disabled="!selectedFile">
                    <md-icon md-menu-origin md-menu-align-target>picture_as_pdf</md-icon>
                    Open as PDF
                </md-button>
            </md-menu-item>
            <md-menu-item ng-hide="ShowHideTools.IsShowDownloads">
                <md-button ng-href="/downloadpdf?file={{ selectedFile }}&watermarkText={{Watermark.Text}}&watermarkColor={{Watermark.Color}}&watermarkPosition={{Watermark.Position}}&watermarkWidth={{Watermark.Width}}&watermarkOpacity={{Watermark.Opacity}}&isdownload=true"
                           target="_blank" ng-disabled="!selectedFile">
                    <md-icon md-menu-origin md-menu-align-target>picture_as_pdf</md-icon>
                    Download as PDF
                </md-button>
            </md-menu-item>
            <md-menu-item ng-hide="ShowHideTools.IsShowDownloads">
                <md-button ng-href="/downloadoriginal?file={{ selectedFile }}" ng-disabled="!selectedFile">
                    <md-icon md-menu-origin md-menu-align-target>file_download</md-icon>
                    Download Original
                </md-button>
            </md-menu-item>
        </md-menu-content>
    </md-menu>
    <md-menu ng-hide="ShowHideTools.IsShowPrint">
        <md-button class="md-icon-button" ng-click="this.openMenu($mdOpenMenu, $event)">
            <md-icon>print</md-icon>
            <md-tooltip>Print Document</md-tooltip>
        </md-button>
        <md-menu-content width="4">
            <md-menu-item ng-hide="ShowHideTools.IsShowPrint">
                <md-button ng-click="printPdf(false)" ng-disabled="!selectedFile">
                    <md-icon md-menu-origin md-menu-align-target>print</md-icon>
                    Print Document
                </md-button>
            </md-menu-item>
            <md-menu-item ng-hide="ShowHideTools.IsShowPrint">
                <md-button ng-click="printPdf(true)" ng-disabled="!selectedFile">
                    <md-icon md-menu-origin md-menu-align-target>print</md-icon>
                </md-button>
            </md-menu-item>
        </md-menu-content>
    </md-menu>
    <md-button class="md-icon-button">
        <md-icon>more_vert</md-icon>
    </md-button>
</md-toolbar>
<md-content flex layout="row">
    <md-content id="content" role="main" layout layout-align="center top">
        <div id="pages-container" ng-controller="PagesController">
            <md-content class="page-content-wrapper" id="page-content-wrapper-{{item.number}}" ng-repeat="item in docInfo.pages">
                <md-card>
                    <a name="page-view-{{ item.number }}"></a>
                    <md-card-content>
                        <iframe ng-show="!isImage" iframe-autoresize ng-src="{{ createPageUrl(selectedFile, item.number) }}" allowTransparency="true"></iframe>
                        <img ng-show="isImage" ng-src="{{ createPageUrl(selectedFile, item.number) }}"/>
                    </md-card-content>
                </md-card>
            </md-content>
            <md-card ng-repeat="attachment in docInfo.attachments">
                <a name="page-view-{{$index + 2}}"></a>
                <iframe iframe-set-dimensions-onload align="middle" ng-src="{{ createAttachmentPageUrl(selectedFile,attachment.name,1) }}" allowTransparency="true"></iframe>
            </md-card>
        </div>
    </md-content>

    <md-sidenav md-component-id="left" hide-print md-whiteframe="4" class="md-sidenav-left">
        <md-tabs md-dynamic-height md-border-bottom>
            <md-tab label="Thumbnails">
                <md-content role="navigation">
                    <div ng-controller="ThumbnailsController">
                        <md-card ng-repeat="item in docInfo.pages" class="thumbnail">
                            <img name="imghumb-{{ item.number }}" ng-class="{selectedthumbnail: item === selected}" ng-src="{{ createThumbnailUrl(selectedFile, item.number) }}" ng-click="onThumbnailClick($event, item)" class="md-card-image page-thumbnail"/>
                        </md-card>
                        <md-card ng-repeat="attachment in docInfo.attachments">
                            <img name="imghumb-{{ $index+2 }}" ng-class="{selectedthumbnail: attachment === selected}" ng-src="{{  createAttachmentThumbnailPageUrl(selectedFile,attachment.name,1) }}" ng-click="onAttachmentThumbnailClick($event,attachment.name,$index+2,attachment)" class="md-card-image page-thumbnail"/>
                        </md-card>
                    </div>
                </md-content>
            </md-tab>
        </md-tabs>
    </md-sidenav>
</md-content>
<footer>
    <md-toolbar ng-controller="ToolbarController" layout="row" hide-print md-whiteframe="4" class="md-toolbar-tools md-scroll-shrink" style="max-height: 40px !important; min-height: 30px !important;">
        <span flex></span>
        <div class="" ng-hide="ShowHideTools.IsShowPagingPanel">
            <md-button ng-click="navigatePage('f')" class="md-icon-button" ng-disabled="!selectedFile">
                <md-icon>first_page</md-icon>
                <md-tooltip md-direction="top">First Page</md-tooltip>
            </md-button>
            <md-button ng-click="navigatePage('-')" class="md-icon-button" ng-disabled="!selectedFile">
                <md-icon>navigate_before</md-icon>
                <md-tooltip md-direction="top">Previous Page</md-tooltip>
            </md-button>
            <input id="inputcurrentpage" my-enter="navigatePage(this.value)" value="0" style="background: transparent; border: solid 1px #ccc; color: #fff !important; width: 50px; text-align: center; height: 18px; font-size: small;"/><span id="spantoolpager" style="font-size: small;"></span>
            <md-button ng-click="navigatePage('+')" class="md-icon-button" ng-disabled="!selectedFile">
                <md-icon>navigate_next</md-icon>
                <md-tooltip md-direction="top">Next Page</md-tooltip>
            </md-button>
            <md-button ng-click="navigatePage('e')" class="md-icon-button" ng-disabled="!selectedFile">
                <md-icon>last_page</md-icon>
                <md-tooltip md-direction="top">Last Page</md-tooltip>
            </md-button>
        </div>
        <span flex></span>

        <md-slider-container>
            <md-button class="md-icon-button" ng-click="zoomOutDocument()" ng-hide="ShowHideTools.IsShowZooming" ng-disabled="$root.gdxcfg.zoomfactor <= 0.2">
                <md-icon>zoom_out</md-icon>
                <md-tooltip md-direction="top">Zoom Out</md-tooltip>
            </md-button>
            <md-slider md-discrete="{{ $root.gdxcfg.zoomfactor * 100 }}" step="0.01" min="0.3" max="3" ng-model="$root.gdxcfg.zoomfactor" aria-label="Zoom"></md-slider>
            <md-button class="md-icon-button" ng-click="zoomInDocument()" ng-hide="ShowHideTools.IsShowZooming">
                <md-icon>zoom_in</md-icon>
                <md-tooltip md-direction="top">Zoom In</md-tooltip>
            </md-button>
            <md-button class="md-icon-button" ng-click="zoomOriginalSizeDocument()" ng-hide="ShowHideTools.IsShowZooming">
                <md-icon>youtube_searched_for</md-icon>
                <md-tooltip md-direction="top">Original Size</md-tooltip>
            </md-button>
        </md-slider-container>
    </md-toolbar>
</footer>
<div style="visibility: hidden">
    <div class="md-dialog-container" id="fuDialog">
        <md-dialog aria-label="File Manager">
            <md-toolbar>
                <div class="md-toolbar-tools">
                    <h2><md-icon md-menu-origin md-menu-align-target>library_books</md-icon> File Manager</h2>
                    <span flex></span>
                    <md-button class="md-icon-button" ng-click="cancel()">
                        <md-icon aria-label="Close dialog">close</md-icon>
                    </md-button>
                </div>
            </md-toolbar>
            <md-dialog-content style="max-width: 800px; max-height: 810px;">
                <md-tabs md-dynamic-height md-border-bottom md-selected="tabselectedIndex">
                    <md-tab label="Upload">
                        <md-content class="md-padding" style="min-width: 500px;">
                            <md-card>
                                <md-card-title>
                                    <md-card-title-text>
                                        <span class="md-headline"><md-icon md-menu-origin md-menu-align-target>file_upload</md-icon> Upload</span>
                                    </md-card-title-text>
                                </md-card-title>
                                <md-card-title-media>

                                    <div ng-controller="ToolbarController">

                                        <div class="md-media-lg card-media md-padding">
                                            <input type="file" id="file" name="file" accept=".png,.gif,.jpeg,.bmp,.doc,.docx,.xls,.xlsx,.pdf,.msg" onchange="angular.element(this).scope().getFileDetails(this)"/>

                                            <md-button class="md-raised md-primary" ng-click="uploadFiles()">
                                                <md-icon md-menu-origin md-menu-align-target>file_upload</md-icon>
                                                Upload
                                                <md-tooltip>Upload Selected File</md-tooltip>
                                            </md-button>
                                            <!--ADD A PROGRESS BAR ELEMENT.-->
                                            <p style="display: none" id="progress">
                                                <md-progress-linear md-mode="indeterminate" determinateValue="0" determinateValue2="0"></md-progress-linear>
                                            </p>

                                        </div>
                                    </div>
                                </md-card-title-media>
                            </md-card>
                        </md-content>
                    </md-tab>
                    <md-tab label="Files">
                        <md-content class="md-padding" style="min-width: 500px;">
                            <md-card>
                                <md-card-title>
                                    <md-card-title-text>
                                        <span class="md-headline"><md-icon md-menu-origin md-menu-align-target>storage</md-icon> Files</span>
                                    </md-card-title-text>
                                </md-card-title>
                                <md-card-title-media>


                                    <div ng-controller="AvailableFilesController">
                                        <div class="md-media-lg card-media md-padding">
                                            <table id="filesList">
                                                <tr>
                                                    <th align="center">#</th>
                                                    <th>File Name</th>
                                                </tr>
                                                <tr ng-repeat="item in list" ng-value="item">
                                                    <td align="center">{{$index + 1}}</td>
                                                    <td>
                                                        <span class="fileLink" ng-click="onChange(item)">{{ item }}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </md-card-title-media>
                            </md-card>
                        </md-content>
                    </md-tab>
                </md-tabs>
            </md-dialog-content>
        </md-dialog>
    </div>
</div>

</div>
</body>
</html>
