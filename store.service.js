class Store {
    constructor(reducers, $injector) {
        this.$injector = $injector;
        this.containers = [];
        this.reducers = reducers;
        this.state = {
            todos: [{text: "foo"}]
        };
    }

    getState() {
        return this.state;
    }

    connect(mapStateToProps, mapDispatchToProps) {

        let props = mapStateToProps(this.getState()) || {};

        return (controller) => {

            console.log("new connect for", controller.name);
            let instance = this.$injector.invoke(controller);

            props = Object.assign(props, mapDispatchToProps((action) => {
                this.dispatch(action)
            }));

            instance = Object.assign(instance, props);
            if (!instance.$onStateChanges) {
                instance.$onStateChanges = () => {};
            }
            this.containers.push({
                mapStateToProps: mapStateToProps,
                instance: instance,
                name: controller.name
            });
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
}

const provider = function($injector) {
    this.reducers = [];
    this.setOptions = (options) => {
        this.reducers = options.reducers || this.reducers
    };
    this.$get = ($injector) => new Store(this.reducers, $injector);
};

angular
    .module("app")
    .provider("store", provider)