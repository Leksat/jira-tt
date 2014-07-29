define(["require", "exports", './models/LogRecord'], function(require, exports, LogRecord) {
    var LogRecordsStorage = (function () {
        function LogRecordsStorage() {
        }
        LogRecordsStorage.load = function () {
            var ret = [];
            try  {
                var logRecords = JSON.parse(localStorage['jiraTTLogRecords']);
            } catch (e) {
            }
            if (logRecords instanceof Array) {
                logRecords.forEach(function (_logRecord) {
                    var logRecord = new LogRecord();
                    if (logRecord.initFromObject(_logRecord)) {
                        ret.push(logRecord);
                    }
                });
            }
            return ret;
        };

        LogRecordsStorage.save = function (logRecords) {
            localStorage['jiraTTLogRecords'] = JSON.stringify(logRecords, function (key, val) {
                if (key == '$$hashKey') {
                    return undefined;
                }
                return val;
            });
        };
        return LogRecordsStorage;
    })();

    
    return LogRecordsStorage;
});
