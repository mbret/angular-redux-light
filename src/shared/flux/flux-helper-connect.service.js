(function() {

    class FluxHelperConnect {

        constructor(options, $injector, $log) {
            this.$injector = $injector;
            this.$log = $log;
            this.containers = [];
            this.store = $injector.invoke(options.getStore);
            this.store.subscribe(() => {
                this.apply();
            });
        }

        connect(mapStateToProps = () => {}, mapDispatchToProps = () => {}) {
            let self = this;
            let props = mapStateToProps(this.store.getState()) || {};

            return (controller) => {

                this.$log.log(`New connect for container ${controller.name}`);
                let instance = this.$injector.invoke(controller);

                props = Object.assign(props, mapDispatchToProps((action) => {
                    return this.store.dispatch(action)
                }));

                instance = Object.assign(instance, props);

                let container = {
                    mapStateToProps: mapStateToProps,
                    instance: instance,
                    name: controller.name
                };
                this.containers.push(container);

                this._enhanceContainer(container);

                return instance;
            }
        }

        bindActionCreator(actionCreator, dispatch) {
            return (...args) => dispatch(actionCreator(...args));
        }

        bindActionCreators(actionCreators, dispatch) {
            if (typeof actionCreators === 'function') {
                return this.bindActionCreator(actionCreators, dispatch)
            }

            if (typeof actionCreators !== 'object' || actionCreators === null) {
                throw new Error(
                    `bindActionCreators expected an object or a function, instead received ${actionCreators === null ? 'null' : typeof actionCreators}. ` +
                    `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
                )
            }

            const keys = Object.keys(actionCreators);
            const boundActionCreators = {};
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const actionCreator = actionCreators[key];
                if (typeof actionCreator === 'function') {
                    boundActionCreators[key] = this.bindActionCreator(actionCreator, dispatch)
                } else {
                    this.$log.warn(`bindActionCreators expected a function actionCreator for key '${key}', instead received type '${typeof actionCreator}'.`);
                }
            }
            return boundActionCreators
        }

        //@todo use memoization
        apply() {
            this.$log.log("Apply new state to all connected containers");
            this.containers.forEach(container => {
                let newProps = container.mapStateToProps(this.store.getState());
                container.instance = Object.assign(container.instance, newProps);
                this.$log.log("New props has been bound to", container.name, container.instance);
                container.instance.$onStateChanges(newProps);
            });
        }

        _disconnectContainer(container) {
            let index = this.containers.indexOf(container);
            if(index !== -1) {
                this.containers.splice(index, 1);
            }
        }

        _enhanceContainer(container) {
            let self = this;
            let instance = container.instance;
            // apply default required method
            if (!instance.$onStateChanges) {
                instance.$onStateChanges = () => {};
            }
            if (!instance.$onDestroy) {
                instance.$onDestroy = () => {};
            }

            // listen for destroy
            let destroy = instance.$onDestroy;
            instance.$onDestroy = function() {

                // disconnect container
                self.$log.info(`Disconnected container ${container.name}`);
                self._disconnectContainer(container);

                // end monkey patch
                destroy.apply(this, arguments);
            };
        }
    }

    const provider = function() {
        let options = {};
        this.setOptions = (opt) => {
            options = opt;
        }
        this.$get = ($injector, $log) => {
          return new FluxHelperConnect(options, $injector, $log);
        }
    };

    angular
        .module("app.shared.flux")
        .provider("fluxHelperConnectService", provider);
})();