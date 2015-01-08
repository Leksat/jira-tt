library log_record;

import 'package:exportable/exportable.dart';

import 'package:jira_tt/time_tools.dart';

class LogRecord extends Object with Exportable {

  @export String startTime = '';
  @export String description = '';

  LogRecordMetadata metadata;

  static String totalJiraTime;
  static String totalJiraTimeLoggable;
  static int totalMinutes;
  static int totalMinutesLoggable;

  static void initMetadata(List<LogRecord> list) {
    totalMinutes = 0;
    totalMinutesLoggable = 0;
    LogRecordGroupMetadata.clear();
    String endTime;
    list.forEach((LogRecord logRecord) {
      logRecord.metadata = new LogRecordMetadata(logRecord, endTime);
      endTime = logRecord.startTime;
      totalMinutes += logRecord.metadata.minutes;
      if (logRecord.metadata.issue != null) {
        totalMinutesLoggable += logRecord.metadata.minutes;
      }
    });
    totalJiraTime = TimeTools.minutesToJiraTime(totalMinutes);
    totalJiraTimeLoggable = TimeTools.minutesToJiraTime(totalMinutesLoggable);
  }
}

class LogRecordMetadata {

  String issue;

  String cleanDescription;

  int minutes;

  String jiraTime;

  String groupKey;

  LogRecordGroupMetadata group;

  LogRecordMetadata(LogRecord logRecord, [String endTime]) {
    if (endTime == null) {
      endTime = TimeTools.getNowString();
    }
    minutes = TimeTools.timeStringToMinutes(endTime) - TimeTools.timeStringToMinutes(logRecord.startTime);
    jiraTime = TimeTools.minutesToJiraTime(minutes);

    Match match = new RegExp("[A-Z]+-[0-9]+").firstMatch(logRecord.description);
    if (match != null) {
      issue = match.group(0);
      groupKey = issue;
      cleanDescription = logRecord.description.replaceFirst(issue, '').trim();
    } else {
      groupKey = logRecord.description;
      cleanDescription = logRecord.description;
    }

    group = new LogRecordGroupMetadata(groupKey);
    group.minutes += minutes;
    group.jiraTime = TimeTools.minutesToJiraTime(group.minutes);
    if (cleanDescription != '') {
      group.addDescription(cleanDescription);
    }
  }
}

class LogRecordGroupMetadata {

  int minutes = 0;
  String jiraTime;
  List<String> descriptions = [];
  String descriptionsString;

  static Map<String, LogRecordGroupMetadata> _groups = {};

  factory LogRecordGroupMetadata(String groupKey) {
    if (!_groups.containsKey(groupKey)) {
      _groups[groupKey] = new LogRecordGroupMetadata._();
    }
    return _groups[groupKey];
  }

  LogRecordGroupMetadata._();

  static void clear() {
    _groups = {};
  }

  void addDescription(String description) {
    descriptions.insert(0, description);
    descriptionsString = descriptions.join('; ');
  }
}
