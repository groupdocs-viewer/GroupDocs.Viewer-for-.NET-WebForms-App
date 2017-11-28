'use strict';

var ngApp = angular.module('GroupDocsViewer', ['ngMaterial', 'ngResource']);
ngApp.value('FilePath', DefaultFilePath);
ngApp.value('isImage', isImageToggle);
ngApp.value('Rotate', RotateAngel);

ZoomValue = (ZoomValue > 10 ? ZoomValue / 100 : ZoomValue);
ZoomValue = (ZoomValue <= 0.05 ? 0.05 : ZoomValue);
ZoomValue = (ZoomValue >= 6 ? 6 : ZoomValue);
ZoomValue = parseFloat(ZoomValue);

ngApp.value('Zoom', ZoomValue);
ngApp.value('Watermark', {
    Text: (ShowWatermark ? WatermarkText : ""),
    Color: WatermarkColor,
    Position: WatermarkPosition,
    Width: WatermarkWidth,
    Opacity: WatermarkOpacity
});

ngApp.value('ShowHideTools', {
    IsFileSelection: !ShowFileSelection,
    IsShowWatermark: !ShowWatermark,
    IsShowImageToggle: !ShowImageToggle,
    IsThubmnailPanel: !ShowThubmnailPanel,
    IsShowZooming: !ShowZooming,
    IsShowRotateImage: !ShowRotateImage,
    IsShowDownloads: !ShowDownloads
});

ngApp.factory('FilesFactory', function ($resource) {
    return $resource('/files', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

ngApp.factory('DocumentPagesFactory', function ($resource) {
    return $resource('/documentinfo?file=:filename', {}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
});

ngApp.controller('ToolbarController', function ToolbarController($rootScope, $scope, $mdSidenav, isImage, Zoom, Watermark, ShowHideTools, FilePath) {

    $scope.toggleLeft = function () {
        $mdSidenav('left').toggle().then(function () {
            $rootScope.$broadcast('md-sidenav-toggle-complete', $mdSidenav('left'));
        });
    };

    $scope.openMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    $scope.Zoom = ZoomValue;

    $scope.Watermark = {
        Text: Watermark.Text,
        Color: Watermark.Color,
        Position: Watermark.Position,
        Width: Watermark.Width,
        Opacity: Watermark.Opacity
    };

    $scope.ShowHideTools = {
        IsShowWatermark: ShowHideTools.IsShowWatermark,
        IsFileSelection: ShowHideTools.IsFileSelection,
        IsShowImageToggle: ShowHideTools.IsShowImageToggle,
        IsThubmnailPanel: ShowHideTools.IsThubmnailPanel,
        IsShowZooming: ShowHideTools.IsShowZooming,
        IsShowRotateImage: ShowHideTools.IsShowRotateImage,
        IsShowDownloads: ShowHideTools.IsShowDownloads
    };

    $scope.isImage = isImage;

    $scope.$on('selected-file-changed', function ($event, selectedFile) {
        $rootScope.selectedFile = selectedFile;
        DefaultFilePath = selectedFile;
    });

    $scope.rotateDocument = function () {
        $rootScope.$broadcast('rotate-file', $rootScope.selectedFile);
    };

    $scope.selected = false;

    $scope.zoomInDocument = function () {
        ZoomValue = (ZoomValue > 10 ? ZoomValue / 100 : ZoomValue);
        ZoomValue = (ZoomValue <= 0 ? 0.05 : ZoomValue);
        ZoomValue = parseFloat(ZoomValue);
        ZoomValue += 0.25;
        Zoom = ZoomValue;
        if ($scope.isImage)
            $rootScope.$broadcast('zin-file', $rootScope.selectedFile);
        else
            resizeIFrame();
    };

    $scope.zoomOutDocument = function () {
        ZoomValue = (ZoomValue > 10 ? ZoomValue / 100 : ZoomValue);
        ZoomValue = (ZoomValue <= 0 ? 0.05 : ZoomValue);
        ZoomValue = parseFloat(ZoomValue);
        ZoomValue -= 0.25;
        Zoom = ZoomValue;
        if ($scope.isImage)
            $rootScope.$broadcast('zout-file', $rootScope.selectedFile);
        else
            resizeIFrame();
    };

    $scope.zoomLevels = function (selectedzoomlevel) {
        console.log(selectedzoomlevel);
        ZoomValue = parseFloat(selectedzoomlevel);
        Zoom = ZoomValue;
        if ($scope.isImage)
            $rootScope.$broadcast('zin-file', $rootScope.selectedFile);
        else
            resizeIFrame();
    }

    $scope.togelToImageDocument = function () {
        $rootScope.$broadcast('toggle-file', $rootScope.selectedFile);
        isImageToggle = !$scope.isImage;
        resizeIFrame();
        $scope.isImage = !$scope.isImage;
    };

    $scope.onSwitchChange = function (cbState) {
        $rootScope.$broadcast('toggle-file', $rootScope.selectedFile);
        isImageToggle = !$scope.isImage;
        resizeIFrame();
        $scope.isImage = !$scope.isImage;
    };

    $scope.nextDocument = function () {
        if ($rootScope.list.indexOf($rootScope.selectedFile) + 1 == $rootScope.list.length) {
            $rootScope.$broadcast('selected-file-changed', $rootScope.list[0]);
        }
        else {
            $rootScope.$broadcast('selected-file-changed', $rootScope.list[$rootScope.list.indexOf($rootScope.selectedFile) + 1]);
        }
    };

    $scope.previousDocument = function () {
        if ($rootScope.list.indexOf($rootScope.selectedFile) - 1 == -1) {
            $rootScope.$broadcast('selected-file-changed', $rootScope.list[$rootScope.list.length - 1]);
        }
        else {
            $rootScope.$broadcast('selected-file-changed', $rootScope.list[$rootScope.list.indexOf($rootScope.selectedFile) - 1]);
        }
    };
});

ngApp.controller('ThumbnailsController',
    function ThumbnailsController($rootScope, $scope, $sce, $mdSidenav, DocumentPagesFactory, FilePath, Watermark, ShowHideTools, Rotate, Zoom) {
        $scope.isLeftSidenavVislble = false;
        if (FilePath) {
            $rootScope.selectedFile = FilePath;
            $scope.docInfo = DocumentPagesFactory.query({
                filename: FilePath
            });

        }
        $scope.$on('selected-file-changed', function (event, selectedFile) {
            $rootScope.selectedFile = selectedFile;
            $scope.docInfo = DocumentPagesFactory.query({
                filename: selectedFile
            });

        });
        $scope.$on('md-sidenav-toggle-complete', function ($event, component) {
            $scope.isLeftSidenavVislble = component.isOpen();
        });


        $scope.onThumbnailClick = function ($event, item) {
            $mdSidenav('left').toggle().then(function () {
                location.hash = 'page-view-' + item.number;
                $rootScope.$broadcast('md-sidenav-toggle-complete', $mdSidenav('left'));
                $scope.selected = item;
            });
        };
        $scope.onAttachmentThumbnailClick = function ($event, name, number) {
            $mdSidenav('left').toggle().then(function () {
                location.hash = 'page-view-' + name + '-' + number;
                $rootScope.$broadcast('md-sidenav-toggle-complete', $mdSidenav('left'));
            });
        };
        $scope.createThumbnailUrl = function (selectedFile, itemNumber) {
            if ($scope.isLeftSidenavVislble) {
                return $sce.trustAsResourceUrl('/pageimage?width=300&file=' + selectedFile
                    + '&page=' + itemNumber
                    + '&watermarkText=' + Watermark.Text
                    + '&watermarkColor=' + Watermark.Color
                    + '&watermarkPosition=' + Watermark.Position
                    + '&watermarkWidth=' + Watermark.Width
                    + '&watermarkOpacity=' + Watermark.Opacity
                    + '&rotate=' + Rotate
                    + '&zoom=' + parseInt(Zoom * 100));
            }
        };
        $scope.createAttachmentThumbnailPageUrl = function (selectedFile, attachment, itemNumber) {
            if ($scope.isLeftSidenavVislble) {
                return $sce.trustAsResourceUrl('/attachmentimage?width=300&file=' + selectedFile
                    + '&attachment=' + attachment
                    + '&page=' + itemNumber
                    + '&watermarkText=' + Watermark.Text
                    + '&watermarkColor=' + Watermark.Color
                    + '&watermarkPosition=' + Watermark.Position
                    + '&watermarkWidth=' + Watermark.Width
                    + '&watermarkOpacity=' + Watermark.Opacity);
            }
        };

    }
);

ngApp.controller('PagesController',
    function ThumbnailsController($rootScope, $scope, $sce, $document, DocumentPagesFactory, FilePath, Watermark, ShowHideTools, isImage, Rotate, Zoom) {
        if (FilePath) {
            $rootScope.selectedFile = FilePath;
            $scope.docInfo = DocumentPagesFactory.query({
                filename: FilePath
            });
        }

        $scope.$on('selected-file-changed', function (event, selectedFile) {
            $rootScope.selectedFile = selectedFile;
            $scope.docInfo = DocumentPagesFactory.query({
                filename: selectedFile
            });
        });

        $scope.$on('rotate-file', function (event, selectedFile) {
            $rootScope.selectedFile = selectedFile;
            if (Rotate <= 270)
                Rotate += 90;
            else
                Rotate = 0;
        });

        $scope.$on('zin-file', function (event, selectedFile) {
            $rootScope.selectedFile = selectedFile;
            Zoom = ZoomValue;
        });

        $scope.$on('zout-file', function (event, selectedFile) {
            $rootScope.selectedFile = selectedFile;
            Zoom = ZoomValue;
        });

        $scope.$on('toggle-file', function (event, selectedFile) {
            $rootScope.selectedFile = selectedFile;
            isImage = !isImage;
        });

        $scope.createPageUrl = function (selectedFile, itemNumber) {
            if (isImage) {
                return $sce.trustAsResourceUrl('/pageimage?file='
                        + selectedFile + '&width=700&page=' + itemNumber
                        + '&watermarkText=' + Watermark.Text
                        + '&watermarkColor=' + Watermark.Color
                        + '&watermarkPosition=' + Watermark.Position
                        + '&watermarkWidth=' + Watermark.Width
                        + '&watermarkOpacity=' + Watermark.Opacity
                        + '&rotate=' + Rotate
                        + '&zoom=' + parseInt(Zoom * 100));
            }
            else {
                return $sce.trustAsResourceUrl('/pagehtml?file='
                        + selectedFile + '&page=' + itemNumber
                        + '&watermarkText=' + Watermark.Text
                        + '&watermarkColor=' + Watermark.Color
                        + '&watermarkPosition=' + Watermark.Position
                        + '&watermarkWidth=' + Watermark.Width
                        + '&watermarkOpacity=' + Watermark.Opacity);
            }
        };

        $scope.createAttachmentPageUrl = function (selectedFile, attachmentName, itemNumber) {
            return $sce.trustAsResourceUrl('/attachmenthtml?file=' + selectedFile
                    + '&attachment=' + attachmentName
                    + '&page=' + itemNumber
                    + '&watermarkText=' + Watermark.Text
                    + '&watermarkColor=' + Watermark.Color
                    + '&watermarkPosition=' + Watermark.Position
                    + '&watermarkWidth=' + Watermark.Width
                    + '&watermarkOpacity=' + Watermark.Opacity);
        };
    }
);

ngApp.directive('iframeSetDimensionsOnload', [function () {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            element.on('load', function () {
                ZoomValue = (ZoomValue > 10 ? ZoomValue / 100 : ZoomValue);
                ZoomValue = (ZoomValue <= 0.05 ? 0.05 : ZoomValue);
                ZoomValue = (ZoomValue >= 6 ? 6 : ZoomValue);

                var body = element[0].contentWindow.document.body,
                            html = element[0].contentWindow.document.documentElement,
                            height = Math.max(
                                body.scrollHeight,
                                body.offsetHeight,
                                html.clientHeight,
                                html.scrollHeight,
                                html.offsetHeight
                        );

                if (!EnableContextMenu)
                    element[0].contentWindow.document.body.setAttribute("oncontextmenu", "return false;");

                height = parseInt(height) + 50;

                if (!ShowWatermark)
                    element[0].contentWindow.document.body.style = "text-align: center !important;";

                if (isImageToggle)
                    element[0].contentWindow.document.body.style = "text-align: center !important;";

                element[0].style = "height:" + parseInt(height) + "px!important; width:100%!important; ";

                height = (height * (parseFloat(ZoomValue) < 1 ? 1 : parseFloat(ZoomValue)));
                height = parseInt(height);
                height = parseInt(height) + 10;

                if (ZoomValue > 1) {
                    element[0].style = "zoom: " + ZoomValue + "; -moz-transform: scale(" + ZoomValue + "); -moz-transform-origin: 0 0; -o-transform: scale(" + ZoomValue + "); -o-transform-origin: 0 0; -webkit-transform: scale(" + ZoomValue + "); -webkit-transform-origin: 0 0; height:" + height + "px !important; width:100%!important; overflow: visible !important;";
                }
                else {
                    element[0].style = "zoom: " + ZoomValue + "; -moz-transform: scale(" + ZoomValue + "); -o-transform: scale(" + ZoomValue + "); -webkit-transform: scale(" + ZoomValue + "); height:" + height + "px !important; width:100%!important; overflow: visible !important;";
                }

                var selectObj = document.getElementById('zoomselect');
                if (selectObj != undefined) {
                    for (var i = 0; i < selectObj.options.length; i++) {
                        if (selectObj.options[i].value == ZoomValue) {
                            selectObj.options[i].selected = true;
                        }
                    }
                }
            });
        }
    }
}]);

//ngApp.directive('cardSetDimensions', function ($window) {
//    return {
//        link: function ($scope, element, attrs) {

//            ZoomValue = (ZoomValue > 10 ? ZoomValue / 100 : ZoomValue);
//            ZoomValue = (ZoomValue <= 0.05 ? 0.05 : ZoomValue);
//            ZoomValue = (ZoomValue >= 6 ? 6 : ZoomValue);

//            var body = element[0].contentWindow.document.body,
//                        html = element[0].contentWindow.document.documentElement,
//                        height = Math.max(
//                            body.scrollHeight,
//                            body.offsetHeight,
//                            html.clientHeight,
//                            html.scrollHeight,
//                            html.offsetHeight
//                    );

//            height = parseInt(height) + 50;
//            height = (height * (parseFloat(ZoomValue) < 1 ? 1 : parseFloat(ZoomValue)));
//            height = parseInt(height);
//            height = parseInt(height) + 10;

//            if (ZoomValue > 1) {
//                element[0].style = "zoom: " + ZoomValue + "; -moz-transform: scale(" + ZoomValue + "); -moz-transform-origin: 0 0; -o-transform: scale(" + ZoomValue + "); -o-transform-origin: 0 0; -webkit-transform: scale(" + ZoomValue + "); -webkit-transform-origin: 0 0; height:" + height + "px !important; width:100%!important; overflow: visible !important;";
//            }
//            else {
//                element[0].style = "zoom: " + ZoomValue + "; -moz-transform: scale(" + ZoomValue + "); -o-transform: scale(" + ZoomValue + "); -webkit-transform: scale(" + ZoomValue + "); height:" + height + "px !important; width:100%!important; overflow: visible !important;";
//            }

//            //if (ZoomValue > 1) {
//            //    element.css("zoom", ZoomValue);
//            //    element.css("-moz-transform", "scale(" + ZoomValue + ")");
//            //    element.css("-moz-transform-origin", "0 0");
//            //    element.css("-o-transform", "scale(" + ZoomValue + ")");
//            //    element.css("-o-transform-origin", "0 0");
//            //    element.css("-webkit-transform", "scale(" + ZoomValue + ")");
//            //    element.css("-webkit-transform-origin", "0 0");
//            //    element.css("height", height + "px");
//            //    element.css("width", "100%");
//            //    element.css("overflow", "visible");
//            //}
//            //else {
//            //    element.css("zoom", ZoomValue);
//            //    element.css("-moz-transform", "scale(" + ZoomValue + ")");
//            //    element.css("-o-transform", "scale(" + ZoomValue + ")");
//            //    element.css("-webkit-transform", "scale(" + ZoomValue + ")");
//            //    element.css("height", height + "px");
//            //    element.css("width", "100%");
//            //    element.css("overflow", "visible");
//            //}
//        }
//    }
//});

ngApp.controller('AvailableFilesController', function AvailableFilesController($rootScope, $scope, FilesFactory, DocumentPagesFactory, FilePath) {
    $rootScope.list = FilesFactory.query();
    if (FilePath) {
        $rootScope.list = [FilePath];
        $rootScope.selectedFile = $rootScope.list[0];
        $rootScope.$broadcast('selected-file-changed', $rootScope.selectedFile);
        $scope.docInfo = DocumentPagesFactory.query({
            filename: FilePath
        });
    }

    $scope.onOpen = function () {
        $rootScope.list = FilesFactory.query();

    };
    $scope.onChange = function (item) {
        $rootScope.$broadcast('selected-file-changed', item);
    };

});