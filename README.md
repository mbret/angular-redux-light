# Why?
- Why flux ? 
- It offers a very light implementation and still let you use or not the store with your component.
If you don't mind about mixin different patterns it can give you a lot of power (as long as you know 
what you are doing).

# Limits
Angular is not built like React and do not provide good component rendering optimization. When using a state
you will connect your container to it and everytime the state is changed your container will have new
props. It means that your controller will have new reference for all the mapped props and all the watch 
will be triggered. On the other hand React use some internal optimizations to update or not the props.
It's not a big deal unless you are building a very huge angular app with a lot of component mounted at the same
time.

You have to keep in mind that and maybe in rare case not connect your component to store or do some homemade 
optimizations.