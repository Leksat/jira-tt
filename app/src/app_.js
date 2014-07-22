
var app = angular.module('app', []);

app.factory('utils', function() {
  return {

    optionsDefault: {
      jiraUrl: ''
    },

    loadLogRecords: function() {
      return localStorage['jiraTTLogRecords'] ? JSON.parse(localStorage['jiraTTLogRecords']) : [];
    },

    saveLogRecords: function(logRecords) {
      localStorage['jiraTTLogRecords'] = JSON.stringify(logRecords, function (key, val) {
        if (key == '$$hashKey') {
          return undefined;
        }
        return val;
      });
    },

    timeStringToMinutes: function(timeString) {
      var parts = timeString.split(':');
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    },

    minutesToJiraTime: function(minutes) {
      var hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      return (hours ? (hours + 'h ') : '') + (minutes ? (minutes + 'm') : '').trim();
    },

    jiraTimeToMinutes: function(string) {
      var minutes = 0;
      var matches = string.match(/[0-9]+[hm]/g);
      if (!matches) {
        return minutes;
      }
      matches.forEach(function(match) {
        if (match.indexOf('m') != -1) {
          minutes += parseInt(match, 10);
        }
        else if (match.indexOf('h') != -1) {
          minutes += (parseInt(match, 10) * 60);
        }
      });
      return minutes;
    },

    /**
     * @returns {{groupKey: String, issue: String|null}}
     */
    getMetadataFromDescription: function(description) {
      var issue;
      if (issue = description.match(/[A-Z]+-[0-9]+/g)) {
        issue = issue[0];
      }
      return {
        groupKey: issue || description,
        issue: issue
      };
    },

    saveFile: function(filename, text) {
      var link = document.createElement('a');
      link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      link.setAttribute('download', filename);
      link.click();
    }
  };
});
