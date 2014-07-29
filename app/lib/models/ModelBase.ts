
class ModelBase {

  initFromObject(object: Object): boolean {
    for (var i in this) {
      if (this.hasOwnProperty(i)) {
        if (!object.hasOwnProperty(i)) {
          return false;
        }
        this[i] = object[i];
      }
    }
    return true;
  }
}

export = ModelBase;
