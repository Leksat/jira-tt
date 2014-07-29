var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './ModelBase'], function(require, exports, ModelBase) {
    var LogRecord = (function (_super) {
        __extends(LogRecord, _super);
        function LogRecord() {
            _super.apply(this, arguments);
            this.dateTime = '';
            this.description = '';
        }
        return LogRecord;
    })(ModelBase);

    
    return LogRecord;
});
