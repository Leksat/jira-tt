define(["require", "exports"], function(require, exports) {
    var ModelBase = (function () {
        function ModelBase() {
        }
        ModelBase.prototype.initFromObject = function (object) {
            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    if (!object.hasOwnProperty(i)) {
                        return false;
                    }
                    this[i] = object[i];
                }
            }
            return true;
        };
        return ModelBase;
    })();

    
    return ModelBase;
});
