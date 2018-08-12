(function () {
    'use strict';

    function main($rootScope, $scope, $sce, $document, DocumentPagesFactory, FilePath, Watermark, ShowHideTools, isImage, Rotate, Zoom, PagesHtmlFactory) {
        $scope.isImage = isImage = true;

        if (FilePath) {
            $rootScope.selectedFile = FilePath;
            $scope.docInfo = DocumentPagesFactory.query({
                filename: FilePath
            });
            $scope.lstPagesHTML = PagesHtmlFactory.query();
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

    angular.module('GroupDocsViewerApp').controller('PagesController', main);
})();
