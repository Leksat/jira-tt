library log_records_component;

import 'dart:convert' show JSON;

import 'package:angular/angular.dart';

import 'package:jira_tt/log_record.dart';
import 'package:jira_tt/time_tools.dart';

typedef SaveFn(List<LogRecord> logRecords);

@Component(
    selector: 'log-records',
    templateUrl: 'packages/jira_tt/component/log_records_component/template.html',
    cssUrl: 'packages/jira_tt/component/log_records_component/style.css',
    exportExpressions: const ['exportLogRecords'],
    publishAs: 'cmp')
class LogRecordsComponent {

  @NgTwoWay('list')
  List<LogRecord> logRecords = [];

  @NgCallback('on-change')
  Function onChange;

  String totalJiraTime;
  String totalJiraTimeLoggable;

  LogRecordsComponent(Scope scope) {
    scope.watch('cmp.exportLogRecords()', (_, __) {
      LogRecord.initMetadata(logRecords);
      totalJiraTime = LogRecord.totalJiraTime;
      totalJiraTimeLoggable = LogRecord.totalJiraTimeLoggable;
      onChange();
    });
  }

  String exportLogRecords() {
    return JSON.encode(logRecords);
  }

  void newLogRecord() {
    var lr = new LogRecord();
    lr.startTime = TimeTools.getNowString();
    logRecords.insert(0, lr);
  }

  void deleteLogRecord(logRecord) {
    logRecords.remove(logRecord);
  }

  void moveLogRecord(String direction, LogRecord logRecord) {
    var index = logRecords.indexOf(logRecord);
    logRecords.removeAt(index);
    if (direction == 'up') {
      logRecords.insert(index - 1, logRecord);
    } else if (direction == 'down') {
      logRecords.insert(index + 1, logRecord);
    }
  }
}
