(function () {

  /**
   * Compare two object or primitive values.
   * This is not a deep compare.
   *
   * @param {any} a
   * @param {any} b
   * @returns {boolean}
   */
  const shallowEqual = (a, b) => {
    if (a === b) {
      return true
    }

    // $$hashKey is added by angular when using ng-repeat, we ignore that
    let keysA = Object.keys(a).filter(k => k !== '$$hashKey')
    let keysB = Object.keys(b).filter(k => k !== '$$hashKey')

    if (keysA.length !== keysB.length) {
      return false
    }

    // Test for A's keys different from B.
    for (let i = 0; i < keysA.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(b, keysA[i]) || a[keysA[i]] !== b[keysA[i]]) {
        return false
      }
    }

    return true
  }

  /**
   * FluxHelperConnect is a persistent service that deal with connection between components
   * and store. It offer several helpers to avoid boilerplate within your components.
   */
  class FluxHelperConnect {

    constructor (options, $injector, $log, fluxStoreService) {
      this.options = options
      this.$injector = $injector
      this.$log = $log
      this.containers = []
      this.store = fluxStoreService
      this.store.subscribe(() => {
        this.apply()
      })
    }

    /**
     *
     * @param mapStateToProps
     * @param mapDispatchToProps
     * @returns {function(*=)}
     */
    connect (mapStateToProps = () => {}, mapDispatchToProps = () => {}) {
      let props = mapStateToProps(this.store.getState()) || {}
      return (controller) => {
        this.$log.log(`New connect for container ${controller.name}`)
        // instantiate return new instance for function unlike invoke
        // debugger
        let instance = this.$injector.instantiate(controller)
        const boundActionCreators = mapDispatchToProps((action) => {
          return this.store.dispatch(action)
        })
        Object.assign(instance, props, boundActionCreators)
        let container = {
          mapStateToProps: mapStateToProps,
          instance: instance,
          name: controller.name,
          currentProps: props
        }
        this.containers.push(container)
        this._enhanceContainer(container)
        return instance
      }
    }

    /**
     *
     * @param actionCreator
     * @param dispatch
     * @returns {function(...[*]): *}
     */
    bindActionCreator (actionCreator, dispatch) {
      return (...args) => dispatch(actionCreator(...args))
    }

    /**
     *
     * @param actionCreators
     * @param dispatch
     * @returns {*}
     */
    bindActionCreators (actionCreators, dispatch) {
      if (typeof actionCreators === 'function') {
        return this.bindActionCreator(actionCreators, dispatch)
      }

      if (typeof actionCreators !== 'object' || actionCreators === null) {
        throw new Error(`bindActionCreators expected an object or a function, instead received ${actionCreators === null ? 'null' : typeof actionCreators}. `)
      }

      const keys = Object.keys(actionCreators)
      const boundActionCreators = {}
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const actionCreator = actionCreators[key]
        if (typeof actionCreator === 'function') {
          boundActionCreators[key] = this.bindActionCreator(actionCreator, dispatch)
        } else {
          this.$log.warn(`bindActionCreators expected a function actionCreator for key '${key}', instead received type '${typeof actionCreator}'.`)
        }
      }
      return boundActionCreators
    }

    /**
     * It use shallow compare to update the container props.
     * @todo use memoization
     */
    apply () {
      this.$log.log('Apply new state to all connected containers')
      this.containers.forEach(container => {
        // mapStateToProps may return undefined / null (it's user choice) but we should always use object as security
        let newProps = container.mapStateToProps(this.store.getState()) || {}
        if (!shallowEqual(newProps, container.currentProps)) {
          container.instance = Object.assign(container.instance, newProps)
          container.currentProps = newProps
          // this.$log.log('New props has been bound to', container.name)
        } else {
          // this.$log.log(`New props has not been bound to ${container.name} as they are shallow equals`)
        }
        container.instance.$onStateChanges(newProps)
      })
    }

    /**
     *
     * @param container
     * @private
     */
    _disconnectContainer (container) {
      let index = this.containers.indexOf(container)
      if (index !== -1) {
        this.containers.splice(index, 1)
      }
    }

    /**
     *
     * @param container
     * @private
     */
    _enhanceContainer (container) {
      let self = this
      let instance = container.instance
      // apply default required method
      if (!instance.$onStateChanges) {
        instance.$onStateChanges = () => {}
      }
      if (!instance.$onDestroy) {
        instance.$onDestroy = () => {}
      }

      // listen for destroy
      let destroy = instance.$onDestroy
      instance.$onDestroy = function () {

        // disconnect container
        self.$log.info(`Disconnected container ${container.name}`)
        self._disconnectContainer(container)

        // end monkey patch
        destroy.apply(this, arguments)
      }
    }
  }

  /**
   * fluxHelperConnectServiceProvider
   */
  const provider = function () {
    let options = {}
    this.setOptions = (opt) => {
      options = opt
    }
    this.$get = ($injector, $log, fluxStoreService) => {
      return new FluxHelperConnect(options, $injector, $log, fluxStoreService)
    }
  }

  angular
    .module('app.shared.flux')
    .provider('fluxHelperConnectService', provider)
})()