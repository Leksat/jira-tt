
app.controller('ReportController', ['$scope', '$http', 'utils', function ($scope, $http, utils) {

  chrome.storage.sync.get(utils.optionsDefault, function(options) {
    var logRecords = utils.loadLogRecords().reverse();
    var reportRecords = {};
    var totalMinutes = 0;
    var loggableMinutes = 0;
    angular.forEach(logRecords, function(logRecord, index){
      if (logRecords[index + 1]) {
        var nextLogRecord = logRecords[index + 1];
        var minutes = utils.timeStringToMinutes(nextLogRecord.startTime) - utils.timeStringToMinutes(logRecord.startTime);
        var metadata = utils.getMetadataFromDescription(logRecord.description);
        logRecord.groupKey = metadata.groupKey;
        logRecord.issue = metadata.issue;
        if (!reportRecords[logRecord.groupKey]) {
          reportRecords[logRecord.groupKey] = {
            minutes: 0,
            descriptions: [],
            issue: logRecord.issue
          };
        }
        reportRecords[logRecord.groupKey].minutes += minutes;
        reportRecords[logRecord.groupKey].descriptions.push((logRecord.issue ? logRecord.description.replace(logRecord.issue, '') : logRecord.description).trim());
        totalMinutes += minutes;
        if (logRecord.issue) {
          loggableMinutes += minutes;
        }
      }
    }, reportRecords);

    angular.forEach(reportRecords, function(reportRecord) {
      reportRecord.ticketUrl = reportRecord.issue ? options.jiraUrl + '/browse/' + reportRecord.issue : '';
      reportRecord.time = utils.minutesToJiraTime(reportRecord.minutes);
      reportRecord.timeToLogOriginal = reportRecord.timeToLog = reportRecord.issue ? reportRecord.time : '';
      reportRecord.description = reportRecord.descriptions.filter(function(v, i) {
        return (v === '') || (reportRecord.descriptions.indexOf(v) == i);
      }).join('; ').trim();
    });
    $scope.reportRecords = reportRecords;
    $scope.totalTime = utils.minutesToJiraTime(totalMinutes);
    $scope.loggableTime = utils.minutesToJiraTime(loggableMinutes);

    $scope.$watch('reportRecords', function(newValue, oldValue) {
      var minutes = 0;
      angular.forEach(newValue, function(logRecord) {
        minutes += utils.jiraTimeToMinutes(logRecord.timeToLog);
      });
      $scope.totalTimeToLog = utils.minutesToJiraTime(minutes);
    }, true);

    $scope.date = moment().format('DD.MM.YYYY');
    $scope.$watch('date', function(newValue) {
      $scope.dayOfWeek = moment(newValue, 'DD.MM.YYYY').format('ddd');
    });

    $scope.logAll = function() {
      angular.forEach($scope.reportRecords, function(reportRecord) {
        if (reportRecord.issue) {
          var data = {
            comment: reportRecord.description ? reportRecord.description : 'Working on issue ' + reportRecord.issue,
            started: moment($scope.date, 'DD.MM.YYYY').format('YYYY-MM-DDT12:00:00.000+0000'),
            timeSpentSeconds: utils.jiraTimeToMinutes(reportRecord.timeToLog) * 60
          };
          $http({method: 'POST', url: options.jiraUrl + '/rest/api/2/issue/' + reportRecord.issue + '/worklog', data: data})
            .success(function (data) {
              // @todo (alex): aware user of success.
            })
            .error(function (data, status) {
              console.log('error', data, status);
              // @todo (alex): aware user of errors (data.errorMessages || status).
            });
        }
      });
      // @todo (alex): save to file only if all items were logged correctly.
      if ($scope.saveReportAsFile) {
        $scope.saveReport();
      }
    };

    $scope.saveReport = function() {
      var text = '';
      angular.forEach($scope.reportRecords, function(reportRecord) {
        text += '\n'
            + 'Issue: ' + reportRecord.issue + '\n'
            + 'Time: ' + reportRecord.time + '\n'
            + 'Time to log: ' + reportRecord.timeToLog + '\n'
            + 'Description: ' + reportRecord.description + '\n';
      });
      text += '\n'
          + 'Total: ' + $scope.totalTime + '\n'
          + 'Loggable: ' + $scope.totalTimeToLog;
      text += '\n\n========\n\nLog records:\n';
      angular.forEach(loadLogRecords(), function(logRecord) {
        text += logRecord.startTime + ' ' + logRecord.description + '\n';
      });
      var filename = 'jira-time-report-' + moment($scope.date, 'DD.MM.YYYY').format('YYYY-MM-DD');
      saveFile(filename, text);
    };

    $scope.$apply();
  });

}]);
