'use strict';

angular.module('GroupDocsViewerApp', [
    'ngMaterial',
    'ngResource',
]);

var ngApp = angular.module('GroupDocsViewerApp');
ngApp.value('FilePath', DefaultFilePath);
ngApp.value('tabselectedIndex', 0);
ngApp.value('isImage', isImageToggle);
ngApp.value('Rotate', RotateAngel);
ngApp.value('totalDisplayed', 3);

ZoomValue = (ZoomValue > 10 ? ZoomValue / 100 : ZoomValue);
ZoomValue = (ZoomValue <= 0.05 ? 0.05 : ZoomValue);
ZoomValue = (ZoomValue >= 6 ? 6 : ZoomValue);
ZoomValue = parseFloat(ZoomValue);

ngApp.value('Zoom', ZoomValue);
ngApp.value('TotalPages', TotalDocumentPages);
ngApp.value('CurrentPage', 1);
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
    IsShowPagingPanel: !ShowPagingPanel,
    IsShowDownloads: !ShowDownloads,
    IsShowPrint: !ShowPrint
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
                $scope.CurrentPage = parseInt(item.number);
                CurrentDocumentPage = $scope.CurrentPage;
                UpdatePager();
                location.hash = 'page-view-' + item.number;
                $rootScope.$broadcast('md-sidenav-toggle-complete', $mdSidenav('left'));
                $scope.selected = item;
            });
        };

        $scope.onAttachmentThumbnailClick = function ($event, name, number, attachment) {
            $mdSidenav('left').toggle().then(function () {
                $scope.CurrentPage = parseInt(number);
                CurrentDocumentPage = $scope.CurrentPage;
                UpdatePager();
                location.hash = 'page-view-' + number;
                $rootScope.$broadcast('md-sidenav-toggle-complete', $mdSidenav('left'));
                $scope.selected = attachment;
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

ngApp.factory('PagesHtmlFactory', function ($resource, $rootScope, Watermark, FilePath) {
    return $resource('/pageshtml?file='
        + FilePath + '&page=' + 1
        + '&watermarkText=' + Watermark.Text
        + '&watermarkColor=' + Watermark.Color
        + '&watermarkPosition=' + Watermark.Position
        + '&watermarkWidth=' + Watermark.Width
        + '&watermarkOpacity=' + Watermark.Opacity, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});


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
                    element[0].contentWindow.document.body.style.cssText = "text-align: center !important;";

                if (isImageToggle)
                    element[0].contentWindow.document.body.style.cssText = "text-align: center !important;";

                element[0].style.cssText = "height:" + parseInt(height) + "px!important";

                height = (height * (parseFloat(ZoomValue) < 1 ? 1 : parseFloat(ZoomValue)));
                height = parseInt(height);
                height = parseInt(height) + 10;

                if (ZoomValue > 1) {
                    element[0].style.cssText = "zoom: " + ZoomValue + "; -moz-transform: scale(" + ZoomValue + "); -moz-transform-origin: 0 0; -o-transform: scale(" + ZoomValue + "); -o-transform-origin: 0 0; -webkit-transform: scale(" + ZoomValue + "); -webkit-transform-origin: 0 0; height:" + height + "px !important;";
                }
                else {
                    element[0].style.cssText = "zoom: " + ZoomValue + "; -moz-transform: scale(" + ZoomValue + "); -o-transform: scale(" + ZoomValue + "); -webkit-transform: scale(" + ZoomValue + "); height:" + height + "px !important;";
                }

                var selectObj = document.getElementById('zoomselect');
                if (selectObj != undefined) {
                    for (var i = 0; i < selectObj.options.length; i++) {
                        if (selectObj.options[i].value == ZoomValue) {
                            selectObj.options[i].selected = true;
                        }
                    }
                }

                UpdatePager();
            });
        }
    }
}]);

ngApp.controller('AvailableFilesController', function AvailableFilesController($rootScope, $scope, FilesFactory, DocumentPagesFactory, FilePath, $mdDialog) {
    $rootScope.list = FilesFactory.query();

    $scope.onOpen = function () {
        $rootScope.list = FilesFactory.query();
    };

    $scope.onChange = function (item) {
        $mdDialog.hide();
        $rootScope.$broadcast('selected-file-changed', item);
    };

});

ngApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});

function zoomelement(element, factor) {
    //element.style.cssText = " zoom: " + factor + ";zoom: " + factor * 100 + "%;-moz-transform: scale(" + factor + ")";
    element.style.cssText = "transform: scale(" + factor + ")";
}

