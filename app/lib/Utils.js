define(["require", "exports"], function(require, exports) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.getMetadataFromDescription = function (description) {
            var issue;
            if (issue = description.match(/[A-Z]+-[0-9]+/g)) {
                issue = issue[0];
            }
            return {
                groupKey: issue || description,
                issue: issue
            };
        };

        Utils.saveFile = function (filename, text) {
            var link = document.createElement('a');
            link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            link.setAttribute('download', filename);
            link.click();
        };
        Utils.optionsDefault = {
            jiraUrl: ''
        };
        return Utils;
    })();

    
    return Utils;
});
