// external dependencies
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import React, {
  Component
} from 'react';

// utils
import {
  getMetaJile,
  getStylesFromProps,
  updateMetaJile
} from './utils';

/**
 * @typedef {Object} Options
 * @property {boolean} autoMount
 * @property {boolean} hashSelectors
 * @property {string} id
 * @property {boolean} minify
 * @property {boolean} sourceMap
 */

/**
 * return a function that accepts a component, which will be rendered
 * in an HOC that on construction will add the jile instance if it is
 * not present in the DOM, and on unmount will remove it if there are
 * no other instances of the component in the DOM
 *
 * @param {Object} passedStyles
 * @param {Options} passedOptions={}
 * @returns {function(PassedComponent: Component): Component}
 */
const decorateWithJile = (passedStyles, passedOptions = {}) => {
  const isStylesFunction = isFunction(passedStyles);

  if (!isStylesFunction && !isPlainObject(passedStyles)) {
    throw new TypeError('The passed styles must either be a plain object of styles or a function '
      + 'that returns a plain object of styles.');
  }

  let cachedJile,
      jileInstance;

  return (PassedComponent) => {
    if (!isStylesFunction) {
      cachedJile = getMetaJile(PassedComponent, passedStyles, passedOptions);
      jileInstance = cachedJile.jile;
    }

    class JileComponent extends Component {
      constructor(...args) {
        super(...args);

        if (isStylesFunction) {
          let styles = getStylesFromProps(passedStyles, this.props);

          cachedJile = getMetaJile(PassedComponent, styles, passedOptions);
          jileInstance = cachedJile.jile;

          this.componentWillReceiveProps = function(nextProps) {
            styles = getStylesFromProps(passedStyles, nextProps);
            cachedJile = updateMetaJile(styles, cachedJile);
            jileInstance = cachedJile.jile;
          };
        }

        if (++cachedJile.counter === 1) {
          jileInstance.add();
        }
      }

      componentWillUnmount() {
        if (--cachedJile.counter === 0) {
          jileInstance.remove();
        }
      }

      render() {        
        return (
          <PassedComponent
            {...this.props}
            jile={jileInstance}
            selectors={jileInstance.selectors}
          />
        );
      }
    }

    return JileComponent;
  };
};

export default decorateWithJile;
