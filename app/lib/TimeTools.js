define(["require", "exports"], function(require, exports) {
    var TimeTools = (function () {
        function TimeTools() {
        }
        TimeTools.timeStringToMinutes = function (timeString) {
            var parts = timeString.split(':');
            return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        };

        TimeTools.minutesToJiraTime = function (minutes) {
            var hours = Math.floor(minutes / 60);
            minutes = minutes % 60;
            return (hours ? (hours + 'h ') : '') + (minutes ? (minutes + 'm') : '').trim();
        };

        TimeTools.jiraTimeToMinutes = function (str) {
            var minutes = 0;
            var matches = str.match(/[0-9]+[hm]/g);
            if (!matches) {
                return minutes;
            }
            matches.forEach(function (match) {
                if (match.indexOf('m') != -1) {
                    minutes += parseInt(match, 10);
                } else if (match.indexOf('h') != -1) {
                    minutes += (parseInt(match, 10) * 60);
                }
            });
            return minutes;
        };
        return TimeTools;
    })();

    
    return TimeTools;
});
