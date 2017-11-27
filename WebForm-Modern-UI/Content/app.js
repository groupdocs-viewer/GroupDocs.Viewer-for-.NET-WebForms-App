'use strict';

var ngApp = angular.module('GroupDocsViewer', ['ngMaterial', 'ngResource']);
ngApp.value('FilePath', DefaultFilePath);
ngApp.value('isImage', isImageToggle);
ngApp.value('Rotate', RotateAngel);
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

ngApp.controller('ToolbarController', function ToolbarController($rootScope, $scope, $mdSidenav, isImage, Watermark, ShowHideTools, FilePath) {

    $scope.toggleLeft = function () {
        $mdSidenav('left').toggle().then(function () {
            $rootScope.$broadcast('md-sidenav-toggle-complete', $mdSidenav('left'));
        });
    };

    $scope.openMenu = function ($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

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
    function ThumbnailsController($rootScope, $scope, $sce, $mdSidenav, DocumentPagesFactory, FilePath, Watermark, ShowHideTools, Rotate) {
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
                    + '&rotate=' + Rotate);
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
    function ThumbnailsController($rootScope, $scope, $sce, $document, DocumentPagesFactory, FilePath, Watermark, ShowHideTools, isImage, Rotate) {
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
                        + '&rotate=' + Rotate);
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
                var body = element[0].contentWindow.document.body,
                            html = element[0].contentWindow.document.documentElement,
                            height = Math.max(
                                body.scrollHeight,
                                body.offsetHeight,
                                html.clientHeight,
                                html.scrollHeight,
                                html.offsetHeight
                            );

                element.css('width', '100%');
                element.css('height', parseInt(height) + 'px');
                if ($scope.isImage) {
                    element[0].contentWindow.document.body.style = "text-align: center !important;";
                }
                resizeIFrame();
            });
        }
    }
}]);

ngApp.directive('cardSetDimensions', function ($window) {
    return {
        link: function ($scope, element, attrs) {
            resizeIFrame();
        }
    }
});

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