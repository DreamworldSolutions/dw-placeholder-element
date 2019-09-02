/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';

/**
 * Purpose: Do not reuse existing component when model is changed.
 * 
 * This is a placeholder component which rerenders doms whenever value is changed of `primaryProps` which is defined by parent class component
 * 
 * It renders teplate content whih is return by `_contentTemplate` method. So parent class must implement this method to return owned template.
 * 
 * It does nothing if destroy dom process is running, it just set instance properties so when final template will be render with latest properties value.
 * 
 * To validate `primaryProps` is changed or not, Get properties key and value map using `_getProps` method and compare value with current instance property.
 * If `primaryProps` is changed then resent instance proeprty and destroy exting doms and rerender new dom based on new value
 * 
 */
export const DWPlaceholderElement = () => BaseElement => class extends BaseElement {

  static get properties() {
    return {
      /**
       * Set as `true` to destroy existing doms and rerender new dom for latest property.
       */
      _destroy: { type: Boolean}

    };
  }

  /**
   * Render placeholder template which is return by `_contentTemplate` method.
   */
  render() {
    return html `${(this._destroy)  ? '' : this._contentTemplate()}`;
  }

  /**
   * Empty temlate method
   * Integrator component must override this method and return owned template
   */
  _contentTemplate() {
    return '';
  }

  /**
   * 
   * @param { Object } props - Set properties value
   */
  _setProps(props) {
    for(let prop in props) {
      this[prop] = props[prop];
    }
  }

  /**
   * Destory existng doms and rerender new doms
   * If destroy process is already running then do nothing
   */
  _stateChanged(state) {

    let props = this.getProps(state);
    //If dom destroy process is already running
    if(this._destroy) {
      this._setProps(props);
      return;
    }

    //Mark view is rerender if one of the rendere property is changed
    let rerender = false;
    this.primaryProps.forEach((prop) => {
      if(!rerender && props[prop] != this[prop]) {
        rerender = true;
      }
    });

    //Set properties
    this._setProps(props);

    //Rerender view only if one of the property value is changed for which dom should be rerender
    if(rerender) {
      this._destroy = true;
      this.updateComplete.then(() => {
        this._destroy = false;
      });
    }
  }
};
