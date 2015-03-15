'use strict';

let Immutable = require('immutable')
  , _ = require('lodash');

function applyVariants(styles, variants) {
  function mergeVariant(memo, val, key) {
    if (!val) return memo;
    return memo.mergeDeep(styles.getIn(['__variants', key]));
  }
  return _.reduce(variants, mergeVariant, styles);
}

function get(map, klass) {
  return map.get(klass) || new Immutable.Map();
}

function arrayReducer(styler) {
  return function (memo, klass, index) {
    memo[klass] = styler(klass);
    return memo;
  };
}

function hashReducer(styler) {
  return function (memo, klass, index) {
    memo[index] = styler(klass);
    return memo;
  };
}

/**
 * Returns a function to style our component
 *
 * @param {Component} component
 * @param {Object} stylesheet
 * @param {Object} variants
 */
function Styler(component, stylesheet, variants) {
  let props = Immutable.fromJS(component.props.style || {})
    , styles = Immutable.fromJS(stylesheet || {});

  variants = variants || {};
  styles = applyVariants(styles, variants);

  return function styler(klass) {
    if (_.isArray(klass)) return _.reduce(klass, arrayReducer(styler), {});
    if (_.isObject(klass)) return _.reduce(klass, hashReducer(styler), {});

    return get(styles, klass)
      .merge(get(props, klass))
      .toJS();
  };
}

module.exports = Styler;
