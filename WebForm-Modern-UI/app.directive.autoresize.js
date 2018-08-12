(function () {
    'use strict';

    function main() {
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
                        ),
                        width = Math.max(
                            body.scrollWidth,
                            body.offsetWidth,
                            html.clientWidth,
                            html.scrollWidth,
                            html.offsetWidth
                        );

                    element[0].style.cssText = [
                        "height:" + height + "px",
                        "width:" + width + "px",
                        "width:100%",
                    ].join(';');

                    //if (!EnableContextMenu) {
                    //    element[0].contentWindow.document.body.setAttribute("oncontextmenu", "return false;");
                    //}

                });
            }
        };
    }

    angular.module('GroupDocsViewerApp').directive('iframeAutoresize', main);
})();

