define(["require", "exports", '../../lib/LogRecordsStorage', '../../lib/TimeTools', '../../lib/Utils', "../../../bower_components/moment/moment.js", "../../../bower_components/angular/angular.js"], function(require, exports, LogRecordsStorage, TimeTools, Utils) {
    var app = angular.module('app', []);

    app.controller('PopupController', [
        '$scope', function ($scope) {
            $scope.logRecords = LogRecordsStorage.load();

            $scope.totalTimeTillNow = 0;
            $scope.loggableTimeTillNow = 0;
            var issueToGroupTimeMap = {};
            var prevLogRecord = false;
            angular.forEach($scope.logRecords, function (logRecord) {
                var prevStartTime = prevLogRecord ? prevLogRecord.startTime : moment().format('H:mm');
                var minutes = TimeTools.timeStringToMinutes(prevStartTime) - TimeTools.timeStringToMinutes(logRecord.startTime);
                logRecord.thisRecordTime = TimeTools.minutesToJiraTime(minutes);
                $scope.totalTimeTillNow += minutes;
                var metadata = Utils.getMetadataFromDescription(logRecord.description);
                logRecord.groupKey = metadata.groupKey;
                logRecord.issue = metadata.issue;
                if (logRecord.issue) {
                    $scope.loggableTimeTillNow += minutes;
                }
                if (!issueToGroupTimeMap[logRecord.issue]) {
                    issueToGroupTimeMap[logRecord.issue] = 0;
                }
                issueToGroupTimeMap[logRecord.issue] += minutes;
                prevLogRecord = logRecord;
            });
            $scope.totalTimeTillNow = TimeTools.minutesToJiraTime($scope.totalTimeTillNow);
            $scope.loggableTimeTillNow = TimeTools.minutesToJiraTime($scope.loggableTimeTillNow);

            angular.forEach($scope.logRecords, function (logRecord) {
                logRecord.groupRecordsTime = TimeTools.minutesToJiraTime(issueToGroupTimeMap[logRecord.issue]);
            });

            $scope.newLogRecord = function () {
                var issue = false;
                chrome.tabs.query({ 'active': true }, function (tabs) {
                    if (tabs && tabs[0] && tabs[0].url) {
                        var regexp = /\/browse\/([A-Z]+-[0-9]+)/;
                        var match = regexp.exec(tabs[0].url);
                        if (match) {
                            issue = match[1];
                        }
                    }
                    $scope.$apply(function () {
                        $scope.logRecords.unshift({
                            'startTime': moment().format('H:mm'),
                            'description': (issue ? (issue + ' ') : '')
                        });
                    });
                    document.querySelector('input[type=text]').focus();
                });
            };

            $scope.generateReport = function () {
                chrome.tabs.create({
                    'url': chrome.extension.getURL('src/report/report.html')
                });
            };

            $scope.deleteLogRecord = function (logRecord) {
                var index = $scope.logRecords.indexOf(logRecord);
                if (index > -1) {
                    $scope.logRecords.splice(index, 1);
                }
            };

            $scope.clearLogRecords = function () {
                $scope.logRecords = [];
            };

            $scope.$watch('logRecords', function (newValue) {
                LogRecordsStorage.save(newValue);
            }, true);
        }]);

    angular.bootstrap(document, ['app']);
});
