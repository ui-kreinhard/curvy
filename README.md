Curvy
======

What's about
* Imagine if you can access your method parameters like a function. Whooot? Let's see in an example:

function fn(a,b,c) {
    console.log(a+b+c);
}

curvied = fn.curvy();

curvied.a(1).b(2).c(3);
Output: 5

The idea is to have a kind of named parameters. The method fn will be called when the last parameter function is filled.
In the example the last parameter is 'c' which calls then fn.

