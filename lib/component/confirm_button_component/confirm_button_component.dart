library confirm_button_component;

import 'dart:async';

import 'package:angular/angular.dart';

@Component(
    selector: 'confirm-button',
    templateUrl: 'packages/jira_tt/component/confirm_button_component/template.html',
    publishAs: 'cmp')
class ConfirmButtonComponent {

  String text;
  bool disabled = false;

  String _originalText;
  String _confirmText = 'Are you sure?';
  int _disabledDelay = 1;
  int _confirmDelay = 3;

  Timer _revertDelayTimer;

  ConfirmButtonComponent(NgElement element) {
    _originalText = element.node.text;
    text = _originalText;
  }

  @NgAttr('confirm-text')
  void set confirmText(String string) {
    if (string != null) {
      _confirmText = string;
    }
  }

  @NgAttr('disabled-delay')
  void set disabledDelay(String string) {
    if (string != null) {
      _disabledDelay = int.parse(string);
    }
  }

  @NgAttr('confirm-delay')
  void set confirmDelay(String string) {
    if (string != null) {
      _confirmDelay = int.parse(string);
    }
  }

  @NgCallback('action')
  Function action;

  void click() {
    if (_revertDelayTimer == null || !_revertDelayTimer.isActive) {
      text = _confirmText;
      disabled = true;
      new Timer(new Duration(seconds: _disabledDelay), () {
        _revertDelayTimer = new Timer(new Duration(seconds: _confirmDelay), () {
          text = _originalText;
        });
        disabled = false;
      });
    } else {
      text = _originalText;
      _revertDelayTimer.cancel();
      _revertDelayTimer = null;
      action();
    }
  }
}
