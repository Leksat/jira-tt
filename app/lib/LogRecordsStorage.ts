
import LogRecord = require('./models/LogRecord');

class LogRecordsStorage {

  static load(): LogRecord[] {
    var ret = [];
    try {
      var logRecords = JSON.parse(localStorage['jiraTTLogRecords']);
    }
    catch(e) {}
    if (logRecords instanceof Array) {
      logRecords.forEach(_logRecord => {
        var logRecord: LogRecord = new LogRecord();
        if (logRecord.initFromObject(_logRecord)) {
          ret.push(logRecord);
        }
      });
    }
    return ret;
  }

  static save(logRecords: LogRecord[]) {
    localStorage['jiraTTLogRecords'] = JSON.stringify(logRecords, function (key, val) {
      if (key == '$$hashKey') {
        return undefined;
      }
      return val;
    });
  }
}

export = LogRecordsStorage;
