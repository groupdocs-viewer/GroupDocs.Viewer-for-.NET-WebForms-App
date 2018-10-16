(function () {
    'use strict';

    function main($rootScope, $scope, $http, $window, $mdSidenav, isImage, totalDisplayed, Zoom, TotalPages, CurrentPage, Watermark, ShowHideTools, FilePath, $mdDialog, FilesFactory, tabselectedIndex) {

        $rootScope.tabselectedIndex = tabselectedIndex;
        $scope.showTabDialog = function (ev) {
            $mdDialog.show({
                controller: DialogController,
                contentElement: '#fuDialog',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        function DialogController($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        };

        $scope.getFileDetails = function (e) {

            $scope.files = [];
            $scope.$apply(function () {
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i])
                }

            });
        };

        $scope.uploadFiles = function () {
            var data = new FormData();

            if ($scope.files != undefined) {

                for (var i in $scope.files) {
                    data.append("uploadedFile", $scope.files[i]);
                }

                var objXhr = new XMLHttpRequest();
                objXhr.addEventListener("progress", updateProgress, false);
                objXhr.addEventListener("load", transferComplete, false);

                objXhr.open("POST", "/fileUpload/");
                objXhr.send(data);
                document.getElementById('progress').style.display = 'block';
                $scope.files = undefined;
            }
            else {
                alert("Please select file to upload.");
            }
        };

        function updateProgress(e) {
            if (e.lengthComputable) {
                document.getElementById('progress').style.display = 'block';
                document.getElementById('progress').setAttribute('max', e.total);
            }
        };

        function transferComplete(e) {
            $rootScope.list = FilesFactory.query();
            alert("Files uploaded successfully.");
            document.getElementById('progress').style.display = 'none';
            $rootScope.tabselectedIndex = 1;
        };

        $scope.uploadedFile = {};
        $scope.uploadedFile.name = "";

        $scope.toggleLeft = function () {
            $mdSidenav('left').toggle().then(function () {
                $rootScope.$broadcast('md-sidenav-toggle-complete', $mdSidenav('left'));
            });
        };

        $scope.openMenu = function ($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };

        $scope.Zoom = ZoomValue;

        $scope.TotalPages = TotalDocumentPages;
        $scope.CurrentPage = CurrentPage;

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
            IsShowPagingPanel: ShowHideTools.IsShowPagingPanel,
            IsShowDownloads: ShowHideTools.IsShowDownloads,
            IsShowPrint: ShowHideTools.IsShowPrint
        };

        $scope.isImage = isImage;
        $scope.totalDisplayed = totalDisplayed;

        $scope.$on('selected-file-changed', function ($event, selectedFile) {
            $rootScope.selectedFile = selectedFile;
            DefaultFilePath = selectedFile;
            $scope.zoomOriginalSizeDocument();
        });

        $scope.rotateDocument = function () {
            $rootScope.$broadcast('rotate-file', $rootScope.selectedFile);
        };

        $scope.selected = false;

        $scope.zoomInDocument = function () {
            $rootScope.gdxcfg.zoomfactor += 0.1;
        };

        $scope.zoomOutDocument = function () {
            $rootScope.gdxcfg.zoomfactor -= 0.1;
        };

        $scope.zoomOriginalSizeDocument = function () {
            $rootScope.gdxcfg.zoomfactor = 1;
        };

        $scope.zoomOriginalSizeDocument = function () {
            $rootScope.gdxcfg.zoomfactor = 1;
        };

        $scope.$watch(
            function () {
                return $rootScope.gdxcfg.zoomfactor;
            },
            function () {
                angular.element(document.getElementById('pages-container'))
                    .css('transform', 'scale(' + $rootScope.gdxcfg.zoomfactor + ')')
                    .css('transform-origin', 'left top')
                // .css('_margin', $rootScope.gdxcfg.zoomfactor * 1000 + '%'
                ;
            }
        );

        $scope.zoomLevels = function (selectedzoomlevel) {
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

        $scope.nextSearch = function () {
            NavigateNextSearch();
        };

        $scope.previousSearch = function () {
            NavigatePreviousSearch();
        };

        $scope.previousDocument = function () {
            if ($rootScope.list.indexOf($rootScope.selectedFile) - 1 == -1) {
                $rootScope.$broadcast('selected-file-changed', $rootScope.list[$rootScope.list.length - 1]);
            }
            else {
                $rootScope.$broadcast('selected-file-changed', $rootScope.list[$rootScope.list.indexOf($rootScope.selectedFile) - 1]);
            }
        };

        $scope.navigatePage = function (options) {
            if ($rootScope.selectedFile) {
                TotalPages = parseInt(TotalDocumentPages);
                CurrentPage = parseInt(CurrentDocumentPage);

                var totalToDisplay = parseInt($scope.totalDisplayed);
                if (totalToDisplay < TotalPages) {
                    $scope.totalDisplayed = (totalToDisplay + 3);
                }

                if (options == '+') {
                    CurrentPage += 1;
                    if (CurrentPage > TotalPages) {
                        CurrentPage = TotalPages;
                    }
                    location.hash = 'page-view-' + CurrentPage;
                }
                else if (options == '-') {
                    CurrentPage -= 1;

                    if (CurrentPage < 1) {
                        CurrentPage = 1;
                    }

                    location.hash = 'page-view-' + CurrentPage;
                }
                else if (options == 'f') {
                    CurrentPage = 1;
                    location.hash = 'page-view-1';
                }
                else if (options == 'e') {
                    CurrentPage = TotalPages;
                    location.hash = 'page-view-' + TotalPages;
                }
                else {
                    if (document.getElementById('inputcurrentpage').value != '')
                        CurrentPage = parseInt(document.getElementById('inputcurrentpage').value);
                    if (CurrentPage > TotalPages) {
                        CurrentPage = TotalPages;
                    }

                    if (CurrentPage < 1) {
                        CurrentPage = 1;
                    }

                    location.hash = 'page-view-' + CurrentPage;
                }

                CurrentDocumentPage = parseInt(CurrentPage);
                UpdatePager();
            }
        };

        $scope.printPdf = function (isOriginal) {
            var watermarkText = Watermark.Text;
            if (isOriginal) {
                watermarkText = '';
            }
            var documentUrl = '/printablehtmlpdf?file=' + $rootScope.selectedFile + '&watermarkText=' + watermarkText + '&watermarkColor=' + Watermark.Color + '&watermarkPosition=' + Watermark.Position + '&watermarkWidth=' + Watermark.Width + '&watermarkOpacity=' + Watermark.Opacity + '&isdownload=false';

            $http({
                method: 'GET',
                url: documentUrl
            }).then(function (success) {

                var printWindow = $window.open('', '_blank', '', '');
                if (printWindow) {
                    printWindow.onload = function (e) {

                    }

                    printWindow.document.write(success.data);
                    printWindow.print();
                    printWindow.close();
                }
            }, function (error) {
                console.log('error: ' + error);
            });
        };

        $scope.navigateSearch = function () {
            if ($rootScope.selectedFile) {
                searchText();
            }
        };
    }

    angular.module('GroupDocsViewerApp').controller('ToolbarController', main);
})();
