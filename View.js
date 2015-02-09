define([
  'jquery',
  'nbd/View',
  'nbd/trait/log',
  './trait/eventMappable'
], function($, View, log, eventMappable) {
  'use strict';

  return View.extend({
    init: function(model) {
      this._super(model);
      this
      .on('postrender', this._mapEvents)
      .on('postrender', this._renderNested);
    },

    template: function(templateData) {
      return this.mustache && this.mustache(templateData, this.partials);
    },

    destroy: function() {
      this._undelegateEvents();
      this._super();
    }
  }, {
    domify: $
  })
  .mixin(log)
  .mixin(eventMappable);
});
