//var _ = require('underscore-contrib');
require('sugar');
Function.prototype.getParamNames = function() {
  var func = this;
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var ARGUMENT_NAMES = /([^\s,]+)/g;
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}
Function.prototype.curvy = function curvy(context) {
   var origFunction = this;
   var currentArg = 0;
   var settedArgs = [];
   var args = this.getParamNames();
   var retObj = {};
   var resetChain = function() {
   for(var i=0;i<args.length;i++) {
        var argName = args[i];
        retObj[argName] = function(argName, argNo, argValue) {
           settedArgs[argNo] = argValue;
           retObj[argName] = function() {
                throw new Error(argName + ' already set');
           };
           currentArg++;
           if(currentArg >= args.length) {
		resetChain();
                var ret = origFunction.apply(context || this, settedArgs);
		currentArg = 0;
		settedArgs = [];
		return ret;
           } else {
                return retObj;
           }
        }.fill(argName,i);
   }
   }.bind(this);
   resetChain();
   return retObj;
}




Function.prototype.curvyOrdered = function(context) {
   var origFunction = this;
   var args = this.getParamNames();
   var retArray = [];
   var currentArg = 0;
   var settedArgs = []
   for(var i=0;i<args.length;i++) {
     var argName = args[i];
     var retObj = {};
     retObj[argName] = function(argName, argNo, argValue) {
        settedArgs.push(argValue);
	currentArg++;
	if(currentArg >= args.length) {
          var ret = origFunction.apply(context || this, settedArgs);	
	  currentArg = 0;
	  settedArgs = []
	  return ret;
        } else {
	  return retArray[currentArg];
        }
     }.fill(argName, i);
     retArray.push(retObj);
   }
   return retArray[0];
}

Object.prototype.curvifyOrdered = function() {
   var members = Object.keys(this);
   var ret = {};
   members.forEach(function(key) {
	if(Object.isFunction(this[key])) {
		Object.merge(ret, this[key].curvyOrdered(this));
	}
   }.bind(this));
   return ret;
};

function curvyTest(a,b,c,d) {
 return a+b+c+d;
}

var Workflow = function() {
that = retObj= {
 a1: [],
 a2: [],
set : function(enable, in_) {
that.a1.push(enable);
that.a2.push(in_);
 },
apply: function(dominant, workflowIs) {

console.log(that.a1);
console.log(that.a2);
},
configur: function() {
ret = {}
Object.merge(ret, this.set.curvy());
Object.merge(ret, this.apply.curvy());
return ret;
}
}

return retObj.configur();
}.once();

var exist = {
 field: {},

 add: function(enable, inWorkflow) {
	this.field[enable] = inWorkflow
 },
 apply: function(dominant, workflow) {
	Object.keys(this.field).forEach(function(key) {
	  console.log('setting field ' + key + (dominant && this.field[key].indexOf(workflow) >=0 ));				
	}.bind(this));
 },
 print: function() {
  console.log(this.field)
 }
};
var curfied = exist.curvifyOrdered();
console.log(curfied);
curfied.enable('a').inWorkflow(['bb','aa']);
curfied.enable('b').inWorkflow(['bc']);
exist.print();
curfied.dominant(true).workflow('bc')
Workflow().enable('reply').in_(['aaa', 'bb']);
Workflow().enable('repl').in_(['caa', 'db']);
Workflow().dominant(false).workflowIs('aaa');
return;
console.log(ob.a1);
console.log(ob.a2);
var t1 = curvyTest.curvyOrdered();
var r1 = t1.a(1).b(2).c(3).d(4);
console.log(r1);
var t = curvyTest.curvy();
var r = t.d(1).a(2).c(3).b(4);
console.log(r);
return;

Function.prototype.curry = function curry() {
   var origFunction = this;
   var currentArg = 0;
   var functionsArg = [];
   var settedArgs = [];
   var args = getParamNames(origFunction);
   for(var i=0;i<args.length;i++) {
	console.log(args[i]);
	var fn = (function(arg){
		console.log(arg);
		settedArgs.push(arg);
		currentArg++;	
		if(currentArg >= args.length) {
			console.log('call orig');
			console.log(settedArgs);
			return origFunction.apply(null, settedArgs);
		} else {
			return functionsArg[currentArg];
		}
	});
	functionsArg.push(fn);
   }
   return functionsArg[0];
}
function test(a,b,c,d) {
  return a+b+c+d;
}
Function.prototype.unsplat = function() { return _.unsplat(this) }

function err(boolArgs) {
	for(var i=0;i<boolArgs.length;i+=2) {
	 if(!boolArgs[i]) {
  	  return boolArgs[i+1];
         }
	}
}

var c = test.curry();
var errs = err.unsplat();
console.log(c(1)(2)(3)(4));
console.log(errs(true, 'aaa', false, 'bbb'))
