library time_tools;

class TimeTools {

  static int timeStringToMinutes(String timeString) {
    var parts = timeString.split(':');
    try {
      return int.parse(parts[0]) * 60 + int.parse(parts[1]);
    } catch(e) {
      return 0;
    }
  }

  static String minutesToJiraTime(int minutes) {
    String ret = '';
    int hours = minutes ~/ 60;
    if (hours > 0) {
      ret += '${hours}h ';
    }
    minutes = (minutes < 60) ? minutes : minutes % 60;
    ret += '${minutes}m ';
    return ret.trim();
  }

  static int jiraTimeToMinutes(String str) {
    var minutes = 0;
    new RegExp("([0-9]+)([hm])").allMatches(str).forEach((Match match) {
      if (match[2] == 'm') {
        minutes += int.parse(match[1]);
      } else if (match[2] == 'h') {
        minutes += int.parse(match[1]) * 60;
      }
    });
    return minutes;
  }

  static String getNowString() {
    var now = new DateTime.now();
    var minute = now.minute.toString();
    if (minute.length < 2) {
      minute = '0' + minute;
    }
    return '${now.hour}:${minute}';
  }
}
