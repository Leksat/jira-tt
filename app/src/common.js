
var optionsDefault = {
  jiraUrl: '',
  jiraLogin: ''
};

function loadLogRecords() {
  return localStorage['jiraTTLogRecords'] ? JSON.parse(localStorage['jiraTTLogRecords']) : [];
}

function updateBadge(logRecord) {
  var description = logRecord.description.trim();
  var color;
  if (description.match(/^INTER-[0-9]+/)) {
    color = '#FFA500'; // Orange
  } else if (description.match(/^[A-Z]+-[0-9]+/)) {
    color = '#00FF00'; // Green
  } else if (description === '') {
    color = '#000000';
  } else {
    color = '#FF0000'; // Blue
  }
  chrome.browserAction.setBadgeText({
    text: description
  });
  chrome.browserAction.setBadgeBackgroundColor({
    color: color
  });
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

function saveFile(filename, text) {
  var link = document.createElement('a');
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  link.setAttribute('download', filename);
  link.click();
}

function formatErrorMessage(response, status) {
  var message = 'Error [' + status + ']: ';
  if (typeof(response.message) == 'string') {
    message += response.message;
  } else if (typeof(response.errorMessages) == 'object') {
    message += response.errorMessages.join(' | ');
  }
  return message;
}
