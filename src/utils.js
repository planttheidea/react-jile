// external dependencies
import find from 'lodash/find';
import isPlainObject from 'lodash/isPlainObject';
import jile from 'jile';
import uuid from 'uuid';

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
export const createMetaJile = (Component, styles, options) => ({
  component: Component,
  counter: 0,
  jile: jile(styles, options),
  options,
});

/**
 * get the MetaJile stored in cache for that specific component
 *
 * @param {React.Component} Component
 * @param {string} id
 * @returns {MetaJile}
 */
export const getCachedJile = (Component, id) =>
  find(cache, ({component, options}) => component === Component && options.id === id) || null;

/**
 * get the options with the additional parameters
 *
 * @param {Options} options
 * @param {string} id
 * @returns {Options}
 */
export const getCleanOptions = (options, id) => ({
  ...options,
  autoMount: false,
  id,
});

/**
 * get the id used for the jile stylesheet
 *
 * @param {string} id
 * @param {string} instanceId
 * @returns {string}
 */
export const getJileId = ({id} = {}, instanceId) => {
  const baseId = id || `jile_${uuid()}`;

  return instanceId ? `${baseId}_${instanceId}` : baseId;
};

/**
 * get the jile object with related component and counter
 *
 * @param {Component} Component
 * @param {Object} styles
 * @param {Options} passedOptions
 * @param {string} instanceId
 * @returns {MetaJile}
 */
export const getMetaJile = (Component, styles, passedOptions, instanceId) => {
  const id = getJileId(passedOptions, instanceId);
  const cachedComponentJile = getCachedJile(Component, id);

  if (cachedComponentJile) {
    return cachedComponentJile;
  }

  return (cache[id] = createMetaJile(Component, styles, getCleanOptions(passedOptions, id)));
};

/**
 * based on the props, get the computed styles for the next render
 *
 * @param {function} fn
 * @param {Object} props
 * @returns {Object}
 */
export const getStylesFromProps = (fn, props) => {
  const computedStyles = fn(props);

  if (!isPlainObject(computedStyles)) {
    throw new TypeError('Result of styles method does not return a plain object, reverting to original styles passed.');
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
export const updateMetaJile = (styles, cacheObject) => {
  const {options} = cacheObject;

  return (cache[options.id] = {
    ...cacheObject,
    jile: jile(styles, options),
  });
};
