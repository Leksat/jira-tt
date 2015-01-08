library autofocus_decorator;

import 'package:angular/angular.dart';
import 'dart:html';

@Decorator(selector: '[autofocus]')
class AutofocusDecorator implements AttachAware{
  InputElement element;

  AutofocusDecorator(Element this.element);

  @override
  void attach() {
    element.focus();
  }
}
