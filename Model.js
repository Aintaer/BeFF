define(['nbd/Model'], function(Model) {
  'use strict';

  return Model.extend({
    init: function() {
      this._super.apply(this, arguments);
      if (this.hasOwnProperty('id')) {
        // Move id() out of the way
        this._id = this.id;
        delete this.id;
      }
    }
  })
  .mixin({
    get id() {
      var id;
      if (this._id === undefined) {
        id = this._data.id;
        if (typeof id === 'object') {
          // Guarantee no object modification is possible
          id = Object.freeze(Object.create(id));
        }
        return id;
      }

      // nbd 1.0 behavior
      id = typeof this._id === 'function' ? this._id() : this._id;
      return function() { return id; };
    }
  });
});
