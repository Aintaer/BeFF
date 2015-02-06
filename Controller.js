define([
  'jquery',
  'nbd/util/extend',
  'nbd/trait/log',
  'nbd/trait/pubsub',
  'nbd/Controller/Responsive',
  './View',
  './Model'
], function($, extend, log, pubsub, Entity, View, Model) {
  'use strict';

  function isData(id, data) {
    return typeof data === 'undefined' || typeof id === 'object';
  }

  return Entity.extend({
    init: function(id, data) {
      var el, $view;

      if (isData(id, data)) {
        data = id;
        id = undefined;
      }

      if (typeof data === 'string') {
        $view = $(data);
        el = $view[0];
      }

      if (data instanceof $) {
        $view = data;
        el = $view[0];
      }

      if (data instanceof window.Element) {
        el = data;
        $view = $(el);
      }

      if ($view) {
        // We want the HTML5 dataset
        data = extend({}, el.dataset || $view.data());
      }

      this._super(id, data);
      this._view.$view = $view;

      if ($view) {
        this._view.trigger('postrender', $view);
      }
    },

    _initView: function() {
      this._super.apply(this, arguments);
      this._bindViewEvents('prerender');
      this._bindViewEvents('postrender');
    },

    _bindViewEvents: function(name) {
      if (!this[name]) { return; }

      var callbacks = this[name];
      this.listenTo(this._view, name, function() {
        var args = arguments;

        if (typeof callbacks === 'function') {
          return callbacks.apply(this, args);
        }

        if (typeof callbacks === 'string') {
          return this[callbacks].apply(this, args);
        }

        // Loop through arrays
        if (Array.isArray(callbacks)) {
          return callbacks.forEach(function(fn) {
            if (typeof fn === 'string') {
              fn = this[fn];
            }
            fn.apply(this, args);
          }, this);
        }

        // Loop through objects
        for (var key in callbacks) {
          this[key] = (
            typeof callbacks[key] === 'string' ?
            this[callbacks[key]] :
            callbacks[key]
          ).apply(this, args);
        }
      });
    }
  }, {
    MODEL_CLASS: Model,
    VIEW_CLASS: View,
    with: function(options) {
      var klass = this.extend({
        prerender: options.prerender,
        postrender: options.postrender
      });

      klass.VIEW_CLASS = klass.VIEW_CLASS.extend({
        mustache: options.mustache,
        partials: options.partials
      });

      return klass;
    }
  })
  .mixin(log)
  .mixin({
    get id() {
      return this._model.id;
    },
    get data() {
      return this._model.data();
    }
  });
});
