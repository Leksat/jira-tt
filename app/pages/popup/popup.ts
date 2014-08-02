
/// <reference path="../../../typings/tsd.d.ts" />

/// <amd-dependency path="../../../bower_components/angular/angular.min.js"/>

import _PopupController = require('PopupController');
var PopupController: any = _PopupController; // To suppress PhpStorm warning.

angular.module('app', []);
angular.module('app').controller('PopupController', PopupController);
angular.bootstrap(document, ['app']);
