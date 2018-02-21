(function () {
  'use strict';

  /**
   * Take the difference object resulting of the equal
   * comparison between a and b. The value of b is kept in
   * final object.
   * @param {object} a -
   * @param {object} b -
   * @returns {object} -
   */
  const intersectDiff = (a, b) => {
    if (typeof a !== 'object' || typeof b !== 'object') {
      throw new Error(`Object expected, received a:${a} b:${b}`);
    }

    if (a === b) {
      return {};
    }

    let result = {};
    Object.keys(b).forEach(key => {
      if (a[key] !== b[key]) {
        result[key] = b[key];
      }
    });

    return result;
  };

  /**
   * FluxHelperConnect is a persistent service that deal with connection between components
   * and store. It offer several helpers to avoid boilerplate within your components.
   */
  class FluxHelperConnect {

    constructor (options, $injector, $log, brsFluxStoreService) {
      this.options = options;
      this.$injector = $injector;
      this.$log = $log;
      this.containers = [];
      this.store = brsFluxStoreService;
      this.store.subscribe(() => {
        this.apply();
      });
      this.angularSpecificObjectKeys = ['$$hashKey'];
    }

    /**
     * @param {Function} mapStateToProps -
     * @param {Function} mapDispatchToProps -
     * @returns {function(*=)} -
     */
    connect (mapStateToProps = () => {}, mapDispatchToProps = () => {}) {
      let props = mapStateToProps(this.store.getState()) || {};
      return (controller, locals = {}) => {
        this.$log.debug(`[flux-connect] New connect for container ${controller.name} with locals ${locals}`);
        let instance = this.$injector.instantiate(controller, locals);
        this._enhanceContainerInstance(instance);
        let container = {
          mapStateToProps: mapStateToProps,
          instance: instance,
          name: controller.name,
          previousProps: props
        };

        const boundActionCreators = mapDispatchToProps((action) => {
          return this.store.dispatch(action);
        });
        instance = Object.assign(instance, props, boundActionCreators);
        instance.$onChanges(this._generateOnChanges(container, props, true));

        this.containers.push(container);
        this._enhanceContainer(container);
        return instance;
      };
    }

    /**
     * @param {Function} actionCreator -
     * @param {Function} dispatch -
     * @returns {function(...[*]): *} -
     */
    bindActionCreator (actionCreator, dispatch) {
      return (...args) => dispatch(actionCreator(...args));
    }

    /**
     * @param {Object} actionCreators -
     * @param {Object} dispatch -
     * @returns {*} -
     */
    bindActionCreators (actionCreators, dispatch) {
      if (typeof actionCreators === 'function') {
        return this.bindActionCreator(actionCreators, dispatch);
      }

      if (typeof actionCreators !== 'object' || actionCreators === null) {
        throw new Error(`bindActionCreators expected an object or a function, instead received ${actionCreators === null ? 'null' : typeof actionCreators}. `);
      }

      const keys = Object.keys(actionCreators);
      const boundActionCreators = {};
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const actionCreator = actionCreators[key];
        if (typeof actionCreator === 'function') {
          boundActionCreators[key] = this.bindActionCreator(actionCreator, dispatch);
        } else {
          this.$log.warn(`[flux-connect] bindActionCreators expected a function actionCreator for key '${key}', instead received type '${typeof actionCreator}'.`);
        }
      }
      return boundActionCreators;
    }

    /**
     * It use shallow compare to update the container props.
     * - The component will have attributes updated
     * - The component $onChanges will be trigger
     * The component is ready and a simple digest is needed to refresh ui
     * @todo use memoization
     * @todo componentWillUpdateWith(nextProps) "like" function to allow components optimization.
     * @return {undefined}
     */
    apply () {
      this.$log.debug('[flux-connect] Apply new state to all connected containers');
      this.containers.forEach(container => {
        // mapStateToProps may return undefined / null (it's user choice) but we should always use object as security
        let newProps = container.mapStateToProps(this.store.getState()) || {};
        // here we use the intersectDiff function to "shallow equal" and optimize in the same time
        // we get the difference object (for lvl 1, not deep) so we only assign / $onChanges the lvl 1 keys that
        // have been changed. It encourage developers to use a state as flat as possible.
        let diffObject = intersectDiff(container.previousProps, newProps);
        // empty object means that nothing in newProps is different from previousProps (only lvl 1)
        if (Object.keys(diffObject).length > 0) {
          container.instance = Object.assign(container.instance, diffObject);
          container.instance.$onChanges(this._generateOnChanges(container, diffObject));
        }
        container.previousProps = newProps;
      });
    }

    /**
     * @param {Object} container -
     * @private
     * @return {undefined}
     */
    _disconnectContainer (container) {
      let index = this.containers.indexOf(container);
      if (index !== -1) {
        this.containers.splice(index, 1);
      }
    }

    _enhanceContainerInstance (instance) {
      // apply default required method
      if (!instance.$onNewProps) {
        instance.$onNewProps = () => {};
      }
      if (!instance.$onChanges) {
        instance.$onChanges = () => {};
      }
      if (!instance.$onDestroy) {
        instance.$onDestroy = () => {};
      }
    }

    /**
     * @param {Object} container -
     * @private
     * @return {undefined}
     */
    _enhanceContainer (container) {
      let self = this;
      let instance = container.instance;

      // listen for destroy
      let destroy = instance.$onDestroy;
      instance.$onDestroy = function () {

        // disconnect container
        self.$log.info(`[flux-connect] Disconnected container ${container.name}`);
        self._disconnectContainer(container);

        // end monkey patch
        destroy.apply(this, arguments);
      };
    }

    _generateOnChanges (container, props, firstChange = false) {
      let changes = {};
      Object.keys(props).forEach((key) => {
        changes[key] = {
          currentValue: props[key],
          previousValue: container.previousProps[key],
          isFirstChange: () => firstChange
        };
      });
      return changes;
    }
  }

  function provider () {
    let options = {};
    this.setOptions = (opt) => {
      options = opt;
    };
    this.$get = ($injector, $log, fluxStoreService) => {
      'ngInject';
      return new FluxHelperConnect(options, $injector, $log, fluxStoreService);
    };
  }

  angular
    .module('app.shared.flux')
    .provider('fluxHelperConnectService', provider);
})();