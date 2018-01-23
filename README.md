# Why?
- Because of all benefit of flux and redux implementation of course. [https://facebook.github.io/flux/docs/in-depth-overview.html](https://facebook.github.io/flux/docs/in-depth-overview.html).
There are plenty of article that explain why redux is helpful when developing front end app.
- It offers a very light implementation and still let you use or not the store with your component.
If you don't mind about mixin different patterns (flux, mvc) it can give you a lot of power (as long as you know 
what you are doing).
- It encourages you to use as much ono-way binding as possible and that's a good thing to be confortable with as new architecture and framework are going in this direction.

# Features
## App
- Add / Remove / update todos
- Manage "user" configuration
- Add / Remove / update "tweets" asynchronously
- Logging based on level

## Flux 
The base of the homemade "framework" is inside the `flux` module. It's comparable to the content 
from redux + react-redux (but for angular). On top of that I added a `middleware` module that implement the most
common and used middlewares and are easy to extract. Finally other extra features that may be very useful in common project
are implemented through the `app` itself.
- (core) Store handler with support of reducers, enhancers and action dispatching
- (core) Common helper functions to combine, compose and help you dealing with functional programming
- (core) Connector to angular to avoid a lot of boilerplate and automatic components dispatch
- (extra) Restore / Persist state. Then you are able to track user experience and restore a state with one click
when needed
- (extra) Logging Middleware
- (extra) Thunk middleware
- (extra) Digest middleware to handle angular digest cycle and UI refresh
- (extra) Flux debug tools (watch for accidental store mutation)

## Restore / Persist
Restore feature have some limits. Restoring the state will put back the store at the exact point as it was but there
are some stuff that still need to performs (ex: redirect your application to the route (defined in the store), trigger the constructor 
of your component. When using a preloaded state all your application bootstrapping logic (module, config, etc) will run as well.
It's not really possible to restore an entire application like a snapshot. However it's not a big deal and you may still
handle the restore action to enhance your restoration process.

## Flux debug tools
The flux debug module is build around an enhancer that allow you adding any debug layer to watch and tracks what happens during the store life. It has for now a very usefull tool that use proxies to prevent accidental store mutation. You are not meant to use it in production mode but is very helpful while developing.

## Some points about Angular
I wanted to make a classic web Angular project to fit all the cases (no web-packer for example) so there are
no es6 export and all files are supposed to be injected on html file.
This is the reason why you can encapsulate your reducers and enhancers into service and use the
Angular DI. Because they are in fact into your Angular modules. This is what makes this flux implementation more
verbose than the redux implementation.

# Get started
This is an example to show you how to use it and expose what you can do. The real library is inside [https://github.com/mbret/angular-redux-light/tree/master/src/shared](https://github.com/mbret/angular-redux-light/tree/master/src/shared). 
I'm planning to make a package but for now you can integrate the code directly instead of having another dependency. It's comprehensible and light. 

To run/test the project
- `npm install`
- `npm run start`
- Visit http://localhost:8080

# Note about performances
Despite the fact that all store update should trigger every changes since immutable change the reference, it does
reduce the complexity of all $watch to O(1). There is indeed no more deep checking (only the reference). 
If you are going to use only the store in flavor of angular $scope old fashioned way you may have better performances.

# Personal note
Although using flux pattern in Angular application is pretty easy and works at the end, you should consider taking a look at React Or Vue.js as
other framework which are way more flexible to this kind of architecture. Anyway, if you are using this code right here, I'm
pretty sure that you are probably already using React :)
