(function() {
    class Store {
        constructor(reducers, $injector, $log) {
            this.$injector = $injector;
            this.$log = $log;
            this.containers = [];
            this.reducers = reducers;
            this.state = {
                todos: [{text: "foo"}]
            };
        }

        getState() {
            return this.state;
        }

        connect(mapStateToProps = () => {}, mapDispatchToProps = () => {}) {
            let self = this;
            let props = mapStateToProps(this.getState()) || {};

            return (controller) => {

                console.log("new connect for", controller.name);
                let instance = this.$injector.invoke(controller);

                props = Object.assign(props, mapDispatchToProps((action) => {
                    this.dispatch(action)
                }));

                instance = Object.assign(instance, props);

                let container = {
                    mapStateToProps: mapStateToProps,
                    instance: instance,
                    name: controller.name
                };
                this.containers.push(container);

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
                    self.$log.info(`Disconnected container ${controller.name}`);
                    let index = self.containers.indexOf(container);
                    if(index !== -1) {
                        self.containers.splice(index, 1);
                    }

                    // end monkey patch
                    destroy.apply(this, arguments);
                };

                return instance;
            }
        }

        dispatch(action) {
            console.log("dispatch action", action, "for state", this.getState());
            this.reducers.forEach(reducer => {
                let newState = reducer(this.getState(), action);
                console.log("New state after dispatch", action, newState);
                this.apply(newState);
            });
        }

        apply(newState) {
            this.state = Object.assign({}, newState);
            console.log("Final state after apply", this.getState());
            this.containers.forEach(container => {
                let newProps = container.mapStateToProps(this.getState());
                container.instance = Object.assign(container.instance, newProps);
                console.log("new props to bind to", container.name, newProps);
                container.instance.$onStateChanges(this.getState())
            });
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
    }

    const provider = function() {
        this.reducers = [];
        this.setOptions = (options) => {
            this.reducers = options.reducers || this.reducers
        };
        this.$get = ($injector, $log) => new Store(this.reducers, $injector, $log);
    };

    angular
        .module("app")
        .provider("store", provider)
})();