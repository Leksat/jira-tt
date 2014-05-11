var jiraTT = angular.module('jiraTT', []);

jiraTT.controller('JiraTTOptionsCtrl', function ($scope) {

  chrome.storage.sync.get(optionsDefault, function(options) {
    $scope.options = options;
    $scope.$apply();

    $scope.$watch('options', function(options) {
      chrome.storage.sync.set(options);
    }, true);
  });

});
