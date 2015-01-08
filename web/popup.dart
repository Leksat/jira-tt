
library popup;

import 'package:angular/angular.dart';
import 'package:angular/application_factory.dart';

import 'package:jira_tt/component/log_records_component/log_records_component.dart';
import 'package:jira_tt/component/confirm_button_component/confirm_button_component.dart';
import 'package:jira_tt/autofocus_decorator.dart';
import 'package:jira_tt/service/exportable_list_storage.dart';
import 'package:jira_tt/log_record.dart';

class PopupModule extends Module {

  PopupModule() {
    bind(PopupController);
    bind(LogRecordsComponent);
    bind(ConfirmButtonComponent);
    bind(ExportableListStorage);
    bind(AutofocusDecorator);
  }
}

@Controller(
    selector: '[popup-controller]',
    publishAs: 'ctrl'
)
class PopupController {

  static const LOG_RECORD_STORAGE_KEY = 'log_records';

  ExportableListStorage _storage;

  List<LogRecord> logRecords = [];

  PopupController(this._storage) {
    _storage.load(LOG_RECORD_STORAGE_KEY, LogRecord).then((list) {
      logRecords = list;
    });
  }

  void save() {
    _storage.save(LOG_RECORD_STORAGE_KEY, logRecords);
  }
}

main() {
  applicationFactory().addModule(new PopupModule()).run();
}
