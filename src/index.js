// external dependencies
import isPlainObject from 'lodash/isPlainObject';
import React, {Component} from 'react';
import uuid from 'uuid/v4';

// utils
import {
  getMetaJile,
  getStylesFromProps,
  updateMetaJile,
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
  const isInstanceSpecific = typeof passedStyles === 'function';

  if (!isInstanceSpecific && !isPlainObject(passedStyles)) {
    throw new TypeError(
      'The passed styles must either be a plain object of styles or a function ' +
        'that returns a plain object of styles.'
    );
  }

  let cachedJile = null,
      jileInstance = null;

  return (PassedComponent) => {
    if (!isInstanceSpecific) {
      cachedJile = getMetaJile(PassedComponent, passedStyles, passedOptions);
      jileInstance = cachedJile.jile;
    }

    const displayName = PassedComponent.displayName || PassedComponent.name || 'Component';

    return class JileComponent extends Component {
      static displayName = `Jiled(${displayName})`;

      constructor(...args) {
        super(...args);

        if (isInstanceSpecific) {
          this.addInstanceSpecificSetup();
        }

        if (++this.cachedJile.counter === 1) {
          this.jileInstance.add();
        }
      }

      componentWillUnmount() {
        if (--this.cachedJile.counter === 0) {
          this.jileInstance.remove();
        }
      }

      cachedJile = cachedJile;
      id = null;
      jileInstance = jileInstance;

      /**
       * add the instance-specific values and update on props method
       */
      addInstanceSpecificSetup = () => {
        const initialStyles = getStylesFromProps(passedStyles, this.props);

        this.id = uuid();
        this.cachedJile = getMetaJile(PassedComponent, initialStyles, passedOptions, this.id);
        this.jileInstance = this.cachedJile.jile;

        this.componentWillReceiveProps = function(nextProps) {
          const updatedStyles = getStylesFromProps(passedStyles, nextProps);

          this.cachedJile = updateMetaJile(updatedStyles, this.cachedJile);
          this.jileInstance = this.cachedJile.jile;
        };
      };

      render() {
        return (
          // eslint workaround
          <PassedComponent
            {...this.props}
            jile={this.jileInstance}
            selectors={this.jileInstance.selectors}
          />
        );
      }
    };
  };
};

export default decorateWithJile;
