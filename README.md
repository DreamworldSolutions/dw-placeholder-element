# dw-placeholder-element
A Base LitElement class to recreate placeholder element which ensures that element is re-created when entity model(id) is changed based onn `primaryProps` instance variable.

Purpose: Do not reuse existing component when model is changed.


## How to use this component
  - Create component which extends this class
  - From constructor set value of `primaryProps` to the array of property names. When one of these property value is changed DOMs are re-created.
  - Implement `_contentTemplate()` instead of `render()`.
  - Invoke _stateChanged() from stateChanged()
    > This step is necessary as `redux` mixin provides no-op implementation of `stateChanged` method. So, it hides `stateChanged` of this class.
  - Provide implementation of `getProps(state)` which retuns all properties key and value(from state) map.

### Example  
  ```javascript

    import { LitElement } from  "lit-element";
    import  "./my-view";

    class MyViewPlaceholder extends DWPlaceholderElement()(LitElement) {

      constructor() {
        super();
        this.primaryProps = ['viewId']
      }

      static get properties() {
        return {
          viewId: { type: String}
          viewName: { type: String}
        };
      }

      /**
       * Overrider parent class method and return a view page template
       */
      _contentTemplate() {
        return  html `<my-view></my-view>`;
      }

      /**
       * @param { Object } state - Redux state object
       * @return { Object } - Return all properties hash with its value based on given state
       */
      getProps(state) {
        return {
          viewId: state.app.view.id,
          viewName: state.app.view.name
        }
      }

      stateChanged(state) {
        //NOTE: Do not set any instance property value from state here. It will be set by extended class
        //TODO: Write what you want

        this.stateChanged(state);

        //TODO: Write what you want
      }
      
    }

    window.customElements.define('my-view-placeholder', MyViewPlaceholder);
  ```
