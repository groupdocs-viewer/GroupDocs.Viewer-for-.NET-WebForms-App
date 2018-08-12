(function () {
    'use strict';

    //var STARTUP_FILE = '';

    function main($rootScope) {
        loadConfig($rootScope);
        loadStartupFile($rootScope);
    }

    function loadStartupFile($rootScope) {
        var re = /([^&=]+)=([^&]*)/g;
        var m, s;

        if (typeof (s) === 'undefined') {
            while (m = re.exec(location.hash.slice(1))) {
                if (decodeURIComponent(m[1]) === 'file') {
                    s = decodeURIComponent(m[2]);
                    break;
                }
            }
        }
        if (typeof (s) === 'undefined') {
            while (m = re.exec(location.search.slice(1))) {
                if (decodeURIComponent(m[1]) === 'file') {
                    s = decodeURIComponent(m[2]);
                    break;
                }
            }
        }

        if (typeof (s) === 'undefined') {
            if (typeof (STARTUP_FILE) !== 'undefined' && STARTUP_FILE.length) {
                s = STARTUP_FILE;
            }
        }

        if (typeof (s) !== 'undefined') {
            $rootScope.selectedFile = s;
        }
    }

    function loadConfig($rootScope) {
        $rootScope.gdxcfg = {};
        $rootScope.gdxcfg.zoomfactor = 1;
    }

    angular.module('GroupDocsViewerApp').run(main);

})();

