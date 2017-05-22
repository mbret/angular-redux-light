# Why?
- Why flux ? 
- It offers a very light implementation and still let you use or not the store with your component.
If you don't mind about mixin different patterns it can give you a lot of power (as long as you know 
what you are doing).

# Get started
This is an example to show you how to use it and expose what you can do. The real library is inside [https://github.com/mbret/angular-redux-light/tree/master/src/shared](https://github.com/mbret/angular-redux-light/tree/master/src/shared). 
I'm planning to make a package but for now you can integrate the code directly instead of having another dependency. It's comprehensible and light. 

To run/test the project
- `npm install`
- `npm run start`
- Visite http://localhost:8080

# Limits
Angular is not built like React and do not provide good component rendering optimization. When using a state
you will connect your container to it and everytime the state is changed your container will have new
props. It means that your controller will have new reference for all the mapped props and all the watch 
will be triggered. On the other hand React use some internal optimizations to update or not the props.
It's not a big deal unless you are building a very huge angular app with a lot of component mounted at the same
time.

You have to keep in mind that and maybe in rare case not connect your component to store or do some homemade 
optimizations.

# Note about performance
Despite the fact that all store update should trigger every changes since immutable change the reference, it does
reduce the complexity of all $watch to O(1). There is indeed no more deep checking (only the reference). 
If you are going to use only the store in flavor of angular $scope old fashioned way you may have better performances.