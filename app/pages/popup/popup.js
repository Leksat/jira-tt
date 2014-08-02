/// <reference path="../../../typings/tsd.d.ts" />
define(["require", "exports", 'PopupController', "../../../bower_components/angular/angular.min.js"], function(require, exports, _PopupController) {
    var PopupController = _PopupController;

    angular.module('app', []);
    angular.module('app').controller('PopupController', PopupController);
    angular.bootstrap(document, ['app']);
});
