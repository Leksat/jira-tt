
var optionsDefault = {
  jiraUrl: ''
};

function loadLogRecords() {
  return localStorage['jiraTTLogRecords'] ? JSON.parse(localStorage['jiraTTLogRecords']) : [];
}

function saveLogRecords(logRecords) {
  localStorage['jiraTTLogRecords'] = JSON.stringify(logRecords, function (key, val) {
    if (key == '$$hashKey') {
      return undefined;
    }
    return val;
  });
}

function timeStringToMinutes(timeString) {
  var parts = timeString.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function minutesToJiraTime(minutes) {
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return (hours ? (hours + 'h ') : '') + (minutes ? (minutes + 'm') : '').trim();
}

function jiraTimeToMinutes(string) {
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
}

/**
 * @returns {{groupKey: String, issue: String|null}}
 */
function getMetadataFromDescription(description) {
  var issue;
  if (issue = description.match(/[A-Z]+-[0-9]+/g)) {
    issue = issue[0];
  }
  return {
    groupKey: issue || description,
    issue: issue
  };
}
