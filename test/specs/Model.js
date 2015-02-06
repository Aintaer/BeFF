define(['Model'], function(Model) {
  'use strict';

  describe('Model', function() {
    it('offers id getter from data', function() {
      var model = new Model({
        id: 24601
      });

      expect(model.id).toBe(24601);
    });

    it('doesn\'t allow involuntary changing of data through id', function() {
      var model = new Model({
        id: {
          foo: 'bar'
        }
      });

      expect(model.id).toEqual(jasmine.objectContaining({
        foo: 'bar'
      }));

      try {
        model.id.foo = 'baz';
      } catch (ignored) {}

      expect(model.get('id')).toEqual(jasmine.objectContaining({
        foo: 'bar'
      }));
    });

    it('preserves id() behavior when handed an id and data', function() {
      var model = new Model(24601, { foo: 'bar' });

      expect(model.id).toEqual(jasmine.any(Function));
      expect(model.id()).toBe(24601);
    });
  });
});
