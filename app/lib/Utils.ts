
class Utils {

  static optionsDefault = {
    jiraUrl: ''
  };

  static getMetadataFromDescription(description: string): {groupKey: string; issue?: string} {
    var issue;
    if (issue = description.match(/[A-Z]+-[0-9]+/g)) {
      issue = issue[0];
    }
    return {
      groupKey: issue || description,
      issue: issue
    };
  }

  static saveFile(filename: string, text: string) {
    var link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    link.setAttribute('download', filename);
    link.click();
  }
}

export = Utils;
