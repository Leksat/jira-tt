library exportable_list_storage;

import 'dart:async';
import 'dart:convert' show JSON;

import 'package:angular/angular.dart';
import 'package:lawndart/lawndart.dart';
import 'package:exportable/exportable.dart';

@Injectable()
class ExportableListStorage {

  Future _loaded;

  Store _store = new Store('jira_tt', 'jira_tt');

  ExportableListStorage() {
    _loaded = _store.open();
  }

  Future<List<Exportable>> load(String key, Type type) {
    return _loaded.then((_) {
      return _store.getByKey(key).then((json) {
        List list = [];
        if (json != null) {
          try {
            list = JSON.decode(json);
            list = list.map((item) => new Exportable(type, item)).toList();
          } catch ($e) {
            // Probably malformed data: wipe it.
            _store.removeByKey(key);
            list = [];
          }
        }
        return new Future.value(list);
      });
    });
  }

  void save(String key, List<Exportable> list) {
    _loaded.then((_) => _store.save(JSON.encode(list), key));
  }
}
