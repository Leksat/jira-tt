
import ModelBase = require('./ModelBase');

class LogRecord extends ModelBase {
  dateTime: string = '';
  description: string = '';
}

export = LogRecord;
