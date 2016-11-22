// external dependencies
import find from 'lodash/find';
import isPlainObject from 'lodash/isPlainObject';
import jile from 'jile';
import uuid from 'node-uuid';

let cache = {};

/**
 * @typedef {Object} MetaJile
 * @property {React.Component} component
 * @property {number} counter
 * @property {Jile} jile
 * @property {Options} options
 */

/**
 * create the MetaJile that will be stored in cache
 *
 * @param {React.Component} Component
 * @param {Object} styles
 * @param {Options} options
 * @returns {MetaJile}
 */
const createMetaJile = (Component, styles, options) => {
  return {
    component: Component,
    counter: 0,
    jile: jile(styles, options),
    options
  };
};

/**
 * get the MetaJile stored in cache for that specific component
 *
 * @param {React.Component} Component
 * @returns {MetaJile}
 */
const getCachedJile = (Component) => {
  const cachedComponentJile = find(cache, ({component}) => {
    return component === Component;
  });

  return cachedComponentJile || null;
};

/**
 * get the options with the additional parameters
 *
 * @param {Options} options
 * @param {string} id
 * @returns {Options}
 */
const getCleanOptions = (options, id) => {
  return {
    ...options,
    autoMount: false,
    id
  };
};

/**
 * get the id used for the jile stylesheet
 *
 * @param {string} id
 * @returns {string}
 */
const getJileId = ({id} = {}) => {
  return id || `jile_${uuid.v4()}`;
};

/**
 * get the jile object with related component and counter
 *
 * @param {Component} Component
 * @param {Object} styles
 * @param {Options} passedOptions
 * @returns {MetaJile}
 */
const getMetaJile = (Component, styles, passedOptions) => {
  const cachedComponentJile = getCachedJile(Component);

  if (cachedComponentJile) {
    return cachedComponentJile;
  }

  const id = getJileId(passedOptions);
  const options = getCleanOptions(passedOptions, id);

  cache[id] = createMetaJile(Component, styles, options);

  return cache[id];
};

/**
 * based on the props, get the computed styles for the next render
 *
 * @param {function} fn
 * @param {Object} props
 * @returns {Object}
 */
const getStylesFromProps = (fn, props) => {
  const computedStyles = fn(props);

  if (!isPlainObject(computedStyles)) {
    throw new TypeError('Result of styles method does not return a plain object, reverting to ' +
      'original styles passed.');
  }

  return computedStyles;
};

/**
 * update the jile in a cache object
 *
 * @param {Object} styles
 * @param {MetaJile} cacheObject
 * @returns {MetaJile}
 */
const updateMetaJile = (styles, cacheObject) => {
  const options = cacheObject.options;
  const id = options.id;

  const updatedJile = jile(styles, options);

  cache[id] = {
    ...cacheObject,
    jile: updatedJile
  };

  return cache[id];
};

export {createMetaJile};
export {getCachedJile};
export {getCleanOptions};
export {getJileId};
export {getMetaJile};
export {getStylesFromProps};
export {updateMetaJile};
