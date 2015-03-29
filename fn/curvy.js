require('sugar');
Function.prototype.getParamNames = function () {
    var func = this;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var ARGUMENT_NAMES = /([^\s,]+)/g;
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}
Function.prototype.curvy = function curvy(context) {
    var origFunction = this;
    var currentArg = 0;
    var settedArgs = [];
    var args = this.getParamNames();
    var retObj = {};
    var resetChain = function () {
        for (var i = 0; i < args.length; i++) {
            var argName = args[i];
            retObj[argName] = function (argName, argNo, argValue) {
                settedArgs[argNo] = argValue;
                retObj[argName] = function () {
                    resetChain();
                    currentArg = 0;
                    settedArgs = [];
                    throw new Error(argName + ' already set');

                };
                currentArg++;
                if (currentArg >= args.length) {
                    resetChain();
                    var ret = origFunction.apply(context || this, settedArgs);
                    currentArg = 0;
                    settedArgs = [];
                    return ret;
                } else {
                    return retObj;
                }
            }.fill(argName, i);
        }
    }.bind(this);
    resetChain();
    return retObj;
}


Function.prototype.curvyOrdered = function (context) {
    var origFunction = this;
    var args = this.getParamNames();
    var retArray = [];
    var currentArg = 0;
    var settedArgs = []
    for (var i = 0; i < args.length; i++) {
        var argName = args[i];
        var retObj = {};
        retObj[argName] = function (argName, argNo, argValue) {
            settedArgs.push(argValue);
            currentArg++;
            if (currentArg >= args.length) {
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

Object.prototype.curvifyOrdered = function () {
    var members = Object.keys(this);
    var ret = {};
    members.forEach(function (key) {
        if (Object.isFunction(this[key])) {
            Object.merge(ret, this[key].curvyOrdered(this));
        }
    }.bind(this));
    return ret;
};

Object.prototype.curvify = function() {
    var members = Object.keys(this);
    var ret = {};
    members.forEach(function (key) {
        if (Object.isFunction(this[key])) {
            Object.merge(ret, this[key].curvy(this));
        }
    }.bind(this));
    return ret;
}


Object.prototype.renameKeys = function(newKeys) {
    var ret = {}
    var i=0
    Object.values(this).forEach(function(value) {
        ret[newKeys[i]] = value
        i++;
    })
    return ret
}

Object.prototype.pack = function() {
    var newKeys = arguments.callee.caller.getParamNames()
    var ret = {}
    var i=0;
    Object.values(this).forEach(function(value) {
        ret[newKeys[i]] = value
        i++
    })
    return ret
};