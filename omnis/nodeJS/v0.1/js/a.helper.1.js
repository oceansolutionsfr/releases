// @author sebastien.mamy@gmail.com
// @since 2019-07-03
//

// @version 2020.02.29

var require = require === undefined ? function(mod) {return undefined;} : require;

var crypto = crypto !== undefined ? crypto : require("crypto")


// general purpose functions
var Helper = {
    "data": {
        "LogDir": "logs/"
    }
}

// internal variables
var __sequences = {};


//
// GENERAL PURPOSE FUNCTIONS 
//


// returns true if Javascript is running client side
// @return {boolean} true if the runtime is client side
//
Helper.IsClient = function() {
    return typeof window != 'undefined' && window.document
 }


// get the next sequence value
// @return {int} the next value of the sequence
//
Helper.GetNextId = function(s) {
    if(s === undefined) s='default'
    if(__sequences[s] === undefined) __sequences[s] = -1
    __sequences[s] += 1
    return __sequences[s]
}


// exports class for node.js
// @param {Object} module module of the node.js package
// @param {Object} obj node.js package content
// @return {module} the node.js module with exports
// 
Helper.Exports = function(module, obj) {
    module = Helper.Init(module)
    module.exports = obj
    return module
}




// 
// OBJECT RELATED FUNCTIONS
//


// init a variable
// @param {object} o object to init
// @param {object} d default value to set, undefined per default
// @return {object} object instancied 
//
Helper.Init = function(o, d) {
    return o === undefined ? (d === undefined ? {} : d) : o
}


// instantiate a object of the given class
// @param {object} c object class to use
// @param {object} o object to clone(optional)
// @return the created instance
// 
Helper.New = function(c,o) { var o = Helper.Init(o,{});return Object.assign({}, c, o);}


// extends an object with the given class
// @param {object} o object to extend
// @param {object} c class to extend to
// @return the extended object
// 
Helper.Extends = function(o, c) { var o = Helper.Init(o, {}); return Object.assign(o,c);}


// returns true if the instance is empty or null
// @param {object} t instance to check
// @return {boolean} true is the instance is empty or of length 0
//
Helper.IsEmpty= function(t){ return typeof t === "string" ? (t === undefined || t === null || t.length ==0 || t.toLowerCase() === "null" || t.toLowerCase === "undefined"): Helper.Size(t) === 0; }
	

// returns the type of the object 
// @param {object} o instance to be scanned
// @return {string} name of the instance type
//
Helper.GetType = (
    function(global) {
    var cache = {};
    return function(o) {
        var key;
        return  o === null ? 'null' : 
                o === global ? 'global' : 
                (key = typeof o) !== 'object' ? key : 
                o.nodeType ? 'object' : cache[key = ({}).toString.call(o)] || (cache[key] = key.slice(8, -1).toLowerCase()); };
            }(this));




// assert the type of the object
// @param {object} o object to test
// @param {string} t type to check
// @throw an exception if the object is not of type t
//
Helper.AssertType = function(o, t) {Helper.Assert(Helper.GetType(o) === t, `${o} is not of type ${t}`);}


/** returns the size of the object 
 * @param {object} t instance to be scanned
 * @param {boolean} notnull (optional) if true, count only the non-null entries
 * @return {int} size of the instance
 */
Helper.Size = function(t, notnull) {
    var type = Helper.GetType(t);
    if(!notnull) return  (t===undefined|| t===null) ? 0 : 
            (type === 'string' || type === 'array') ? t.length : 
            type === 'object' ? Object.keys(t).length: -1;
        
    else if(type !== 'array') return type === 'string' ? t.length : type === 'object' ? Object.keys(t).length: -1
    var count = 0
    for(var i in t) if(t[i] !== null) count++
    return count
}


// find the string according to the dictionnary
// @param {string} s string to look for
// @param {object} d dictonnary 
// @return {object} 
//
Helper.Find = function(s, d) {return d === undefined || d === null ? undefined : s === undefined ? undefined : d[s]}


// find the first entry matching a key of the dictionnary
// @param {string} s string where the 
// @param {object} d dictonnary to use
// @return {object} the first matching entry of the dictionnary
//
Helper.Match = function(s, d) {
    if(s === null || s === undefined || typeof s !== 'string') return undefined
    if(d === null || d === undefined) return undefined
    for(var k in d) if(s.indexOf(k) >= 0) return d[k]
    return undefined
}


// test if an object match the value
// @param {value, object} params parameters to use
// @param {boolean} debug debug mode
// @return {boolean} true if the object has at least a field that contains the value
//
Helper.MatchSync = function(params, debug) {
    if(params == undefined || params === null) return undefined
    if(params.object === undefined || params.object === null) return undefined
    if(params.value === undefined || params.value === null) return undefined
    Helper.Debug({"name" : "Helper.MatchSync", "params" : params}, debug);
    for(var prop in params.object) {
        var field = params.object[prop];
        if(typeof field === "string" && field.toLowerCase().includes(params.value.toLowerCase())) return true;
    }
    return false;}



/** fitler the store and returns the list of filtered ids
 * @param {object} dataset data to be filtered according to the value
 * @param {boolean} debug debug mode
 * @return {array} the array of matching ids
 */
Helper.FilterSync = function(dataset, value, debug) {
    var keys = []
    for(var key in dataset) {
        var item = dataset[key];
        if(Helper.MatchSync({"object": item, "value" : value}, debug)) keys.push(key)
    }
    Helper.Debug({"name" : "IStore.Filter", "params" : dataset, "output": keys}, debug)
    return keys
}

/** select the expected indexes from the dataset
 * @param {object} dataset set of data from which the extract will be done
 * @param {array} indexes array of the indexes to extrat
 * @return {object} a temporary object containing the selected objects 
 */
Helper.SelectSync = function(dataset, indexes) {
    var out = {}
    for(var k in dataset) if(indexes.includes(k)) out[k] = dataset[k]
    return out
}

/** sort the data set according to the cols, and return an array of the ordered index
 * @param {object} dataset set containing the data to sort
 * @param {array} cols array containing the names of the properties to use for sorting
 * @param {boolean} desc (optional) specifies if the order should be reverse
 * @return {arra} the sorted indexes
 */
/*Helper.SortSync = function(dataset, cols) {
    // TODO
    var ids = []
    for(var id in dataset) ids.push(id)
    return ids
}*/


/** truncate an array at the given offset
 * @param {array} ar array to truncate
 * @param {int} size size of the set to return
 * @param {int} offset offset where to start the truncation
 * @returns {array} the truncated array
 */
Helper.TruncateSync = function(ar, size, offset) {
    if(ar === undefined || ar === null || Helper.GetType(ar) !== 'array') return []
    if(size <= 0) return []
    if(size >= ar.length) return ar
    if(offset < 0) return ar.slice(0, size)
    if(offset + size < ar.length) return ar.slice(offset, size + offset)
    return ar.slice(ar.length - size, ar.length)
}



//
// DATE AND TIME RELATED FUNCTION
//


// format a time in hh:mm:ss
// @param {int} s number of seconds
// @param {int} d if d == 4, limits the output as mm:ss
// @return {string} the formated time value 
// 
Helper.FormatSeconds = function(s, digits) {
    if(isNaN(s)) return "00:00";
    var date = new Date(null); 
    date.setSeconds(s); 
    if(digits === 4) return date.toISOString().substr(14, 5); 
    else return date.toISOString().substr(11, 8);}


// format the date to YYYYMMDD 
// @param {string} d date to format
// @param {string} f [US|FR] format of the incoming date
// @return {string} formated date or empty if the input string was not a date
// 
Helper.FormatDate = function(d, f) {d = typeof d === 'string' ? d.trim() : ''+Helper.Clean(d);if(Helper.IsEmpty(d)) return '';if(!Helper.IsEmpty(d) && Helper.IsEmpty(f) && d.length === 10 && isNaN(d.charAt(4))) return Helper.FormatDate(d, 'US'); else if(!Helper.IsEmpty(d) && Helper.IsEmpty(f) && d.length === 10 && isNaN(d.charAt(2))) return Helper.FormatDate(d, 'FR');else if(!Helper.IsEmpty(d) && f === "US" && d.length === 8) return d;else if(!Helper.IsEmpty(d) && f === "FR" && d.length === 8) return d.substring(4) + d.substring(2, 4) + d.substring(0, 2);else if(!Helper.IsEmpty(d) && f === "US" && d.length === 10) return d.substring(0, 4) + d.substring(5, 7) + d.substring(8);else if(!Helper.IsEmpty(d) && f === "FR" && d.length === 10) return d.substring(6) + d.substring(3, 5) + d.substring(0,2);return '';}


// returns the current date in dd[-]mm[-]yyyy
// @param {separator} separator of the date, - by default
//
Helper.GetCurrentDate = function(separator = "-") {
    var d = new Date()
    var o = Helper.FillNumber(d.getDate(), 2) + separator + Helper.FillNumber(d.getMonth()+1,2) + separator + d.getFullYear()
    return o
}


// returns the current time in hh:mm:ss
//
Helper.GetCurrentTime = function() {var d = new Date(); return Helper.FillNumber(d.getHours(), 2) + ":" + Helper.FillNumber(d.getMinutes(),2) + ":" + Helper.FillNumber(d.getSeconds(),2);}


// returns the current date and time in dd-mm-yyy hh:mm:ss
//
Helper.GetCurrentDateTime = function() {return Helper.GetCurrentDate() + " " + Helper.GetCurrentTime();}


// returns a clean date or null if no date
// @param {year, month, day, separator} params parameters
// @param {boolean} debug debug mode
// @return {string} formated date YYYY-MM-DD
//
Helper.CreateDateSync = function(params, debug) {
    if(Helper.IsEmpty(params.separator)) params.separator = "";
    var date =  "" + (Helper.IsEmpty(params.year) ? "XXXX" : Helper.FillNumber(Helper.Clean(params.year),4)) + params.separator +
                (Helper.IsEmpty(params.month) ? "XX" : Helper.FillNumber(Helper.Clean(params.month),2)) + params.separator +
                (Helper.IsEmpty(params.day) ? "XX" : Helper.FillNumber(Helper.Clean(params.day),2));
    Helper.Debug({"name" : "", "params": params, "output" : date}, debug);
    return date === ("XXXX" + params.separator + "XX" + params.separator + "XX") ? null : date;}




// 
// STRING RELATED FUNCTIONS
// 


// clean object (trim and remove double spaces)
// @param {object} token to be cleaned
// @return {object} clean string if this is a string, the initial object otherwise
//
Helper.Clean = function(token) {return !Helper.IsEmpty(token) ? (Helper.GetType(token) === 'string' ? token.trim().replace( / +/g, ' ' ) : token) : '';};


// replace all the occurence of s1 by s2 in s
// @param {string} s input string
// @param {string} s1 sub string to look for
// @param {string} s2 sub string to use for replacement
// @param {boolean} c true is the search is case sensitive, false otherwise
// @return {string} aa new string with the replacement done
//
Helper.ReplaceString = function(s,s1,s2,c)  {var c = Helper.Init(c, true);    return Helper.Clean(s).replace(new RegExp(s1, c ? 'g' : 'gi'), s2);}


// prepare the string for neo4j
// @param {string} s input string
// @return {string} new string with the replacement done
//
Helper.PrepareString = function(s)  {return Helper.ReplaceString(Helper.ReplaceString(s, "\"","\\\""),"'","\\'");}


// creates a simple hase (no space and all lower case)
// @param {string} s string to hash
// @return {string} hash of the string
//
// Helper.Hash = function(s) {Helper.Assert(!Helper.IsEmpty(s),'Helper.Hash: cannot hash an empty string');return s.toLowerCase().replace(/\s/g,'');}


// proper the string (see excel PROPER function)
// @param {string} v string to proper
// @return {string} the "propered" string
// 
Helper.Proper=function(v){if(!Helper.IsEmpty(v)) return Helper.Clean(''+v).toLowerCase().replace(/\b[a-z]/g, function (letter) {return letter.toUpperCase();});else return '';}


// split a string into a list with the given separator
// @param {object} v value to split
// @param {string} s separator (default |)
// @return {array} array of the values contained by the input
//
Helper.ResolveList = function(v) {var s = Helper.Init(s, "|");if(Helper.GetType(v) === "string" && v.includes(s)) return v.split(s);return v;}


// encode a list in a string
// @param {array} a array to encode in a string
// @param {string} s separator (default |)
// @return {string} the encoded string
//
Helper.EncodeList = function(a, s) {var s = Helper.Init(s, "|"), r="";if(Helper.GetType(a) === "array") for(var i in a) r += "|" + Helper.Clean(a[i]);return r.length > 0 ? r.substring(1) : r; }


// split a string at line breaks (\n)
// @param {string} s string to split
// @return {array} the generated array
//
Helper.SplitLines = function(s) { return s.split(/\n/g);}


// complete a number with 0 in front of it
// @param {number} n number to format
// @param {number} s size of the number expected
// @return {string} a string filled with 0
//
Helper.FillNumber = function(n,s) {var out = "";for(var i = 0; i < s; i++) out += "0";out += n;return out.substring(out.length-s);}


// compares 2 strings
// @param {string} s1 string to compare
// @param {string} s2 string to compare
// @return {int} 0 if the strings don't equal, 1 if they equal case unsensitive, 2 if they equal case sensitive
//
Helper.StringCompare = function(s1, s2) {if(s1 === undefined) return s2 === undefined ? 2 : 0;if(s1 === null) return s2 === null ? 2 : 0;if(s1 === s2) return 2;else if(s2 === null || s2 === undefined) return 0;else if(s1.toLowerCase() === s2.toLowerCase()) return 1;return 0;}


// returns the hash of the string
// @param {value} params parameter
// @param {boolean} debug debug mode
// @return {string} the hash
//
Helper.HashSync = function(params, debug) {
    var v = typeof params === 'string' ? params : params.value
    var hash = crypto.getHashes()
    var hashPwd = crypto.createHash('sha1').update(v).digest('hex').substr(0,12)
    Helper.Debug({"name":"Helper.HashSync","params":params,"output":hashPwd},debug)
    return hashPwd
}


// returns the simple hash of the string (lowercase)
// @param {value} params parameter
// @param {boolean} debug debug mode
// @return {string} the hash
//
Helper.SimpleHash = function(value, debug) {
    var hash = value !== undefined && value !== null ? value.trim().toLowerCase() : value
    Helper.Debug({"name":"Helper.SimpleHash","params":value,"output":hash},debug)
    return hash
}

// 
// ARRAY RELATED FUNCTIONS 
//


// randomly shuffle an array (shuffle the input array)
// @param {array} a array to shuffle
// @return {array} the shuffled array (which is the initial variable)
//
Helper.Shuffle = function(a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    return a;}


// checks if an array contains a value
// @param {array} a instance of the array
// @param {object} v value to look for
// @return {boolean} true if v is at least once in a
//
Helper.ArrayContains = function(a, v) {
    return !Helper.IsEmpty(v) && !Helper.IsEmpty(a) && Array.isArray(a) && array.indexOf(v)>=0;
}


/** shift a array index by step, and rotate if the array bounds are reached
 * @param {array} ar array to browse
 * @param {int} pos current position in the array
 * @param {int} step shift step (can be negative) 
 * @returns {int} the shifted position in the array
 */
Helper.ArrayShift = function(ar, pos, step) {
    pos = pos + step
    if(pos >= ar.length) pos = pos - ar.length
    if(pos < 0) pos = ar.length + pos
    return pos
}


// init an array of size s with the default value d
// @param {int} s size of the output array
// @param {object} d default value to put in the array (default "")
// @return {array} the created array
//
Helper.CreateArray = function(s, d) {
    var d = Helper.Init(d,"");
    var o = [];
    for(var i = 0; i < s;i++) o.push(d);
    return o;}


// join the array 2 in the array 1
// @param {array} a1 target array
// @param {array} a2 array to push at the end of a1
// @return {array} a1
// @throw {exception} if one of the parameter is not of type array
Helper.JoinArray = function(a1, a2) {
    Helper.AssertType(a1, "array");
    Helper.AssertType(a2, "array");
    for(var i in a2) a1.push(a2[i]);
    return a1;}




Helper.Random = function(array, exclude, field) {
    var out = array[Math.floor(Math.random() * array.length)];
    if(Helper.IsEmpty(exclude)) return out;
    else {
        var v = Helper.IsEmpty(field) ? out : out[field];
        while(v === exclude) {
            out = array[Math.floor(Math.random() * array.length)];
            v =  Helper.IsEmpty(field) ? out : out[field];
        }
        return out;
    }}


Helper.ArrayRemove = function(array, index) {
    return array.splice(index,1)
}


//
// LOG RELATED FUNCTIONS
//

// constants for log level
Helper.INFO = "INFO";
Helper.WARNING = "WARNING";
Helper.ERROR = "ERROR";
Helper.STATS = "STATS";




// logs
Helper.Logs = {};


/** throw the exception(message) if the test is false 
 * @param {boolean} t boolean to test
 * @param {string} message message of the error when assertion fails
 * @param {object} obj additional information to report in the exception
 * @throw {exception} if the test is false 
 */ 
Helper.Assert = function(t, message, obj){
    if(!t) {
        console.trace()
        throw Helper.FormatLog(message, Helper.ERROR, obj)
    }
}


/** to be used when a function has to be implemented
 * @throws not implemented exception
 */
Helper.ToImplement = function(){
    console.trace()
    throw Helper.FormatLog("not implemented", Helper.WARNING)
}


/** format a log entry <LEVEL DATE> message
 * @param {level, message, object} p parameters of the message to format
 * @return string the formated log entry
 */ 
Helper.FormatLog = function(message, level, obj) {
    var name = new Error().stack.split("\n")[4].trim()
    if (obj !== undefined) message += ' (' + JSON.stringify(obj) + ')'
    return  level + " | " + Helper.GetCurrentDateTime() + " | " + name + " | " + message
}
     


// 
// LOG = function() {
//     var name = new Error().stack.split("\n")[2].trim()
//     console.log(name)
//     console.log(arguments)
// }
        
// log a message in the message handler, and to console.log if the log level is ERROR
// @param {level, object, message} p parameter of the function
//
Helper.Log = function(p) {
    if(p.DEBUG) console.log("Helper.Log: ", p);if (!(p.level in Helper.Logs)) Helper.Logs[p.level] = [];var m = Helper.FormatLog(p);Helper.Logs[p.level].push(m);
    if(p.level === Helper.ERROR) console.log(m);}


// log an error message
// @param {object, message} p parameter of the function
//
Helper.LogError = function(p) {Helper.Log(Helper.Extends(p, {level: Helper.ERROR}));}


// log a warning message
// @param {object, message} p parameter of the function
//
Helper.LogWarning = function(p) {Helper.Log(Helper.Extends(p, {level: Helper.WARNING}));}


// log an info message
// @param {object, message} p parameter of the function
//
Helper.LogInfo = function(p) {Helper.Log(Helper.Extends(p, {level: Helper.INFO}));}


// returns the messages of level 
// @param {string} level level of the logs to get
// @return {array} all the logs of the provided level
//
Helper.GetLog = function(level) {return Helper.Logs[level];}


// log in the console the information needed for debug mode if parameters.DEBUG === true
// @param {params, name} parameters of the call
// @param {boolean} debug log if debug === true
//
Helper.Debug = function(params, debug) {
    if(debug) console.log(Helper.FormatLog({
    "level" : "DEBUG",
    "message" : params.name,
    "object" : params}));}


// write the log files to a output stream
// @param {string} out output stream
//
Helper.WriteLogs = function(out) {
    if(out === 'console' || Helper.IsEmpty(out)) {
        for(var l in Helper.logs) for(var m in Helper.logs[l]) console.log(Helper.logs[l][m]);        
    } else {
        out = Helper.data.LogDir + out;
        var m = [].concat(Helper.logs[Helper.INFO],Helper.logs[Helper.WARNING],Helper.logs[Helper.ERROR]);
        Helper.WriteTextFile({path: out, data: m});
    }}



/*



//
// NODE.JS RELATED FUNCTIONS
//


// exports class for node.js
// @param {Object} module module of the node.js package
// @param {Object} obj node.js package content
// @return {module} the node.js module with exports
// 
Helper.Exports = function(module, obj) {
    module = Helper.Init(module); 
    module.exports = obj; 
    return module;
}


// allow cross domain request
// @param {http request} r http request 
// @param {http request} s http response to update
// @param {function} n next step in the routing scheme
//
Helper.AllowCrossDomain = function allowCrossDomain(r, s, n) {
    s.header('Access-Control-Allow-Origin', '*');
    s.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    s.header('Access-Control-Allow-Headers', 'Content-Type');
    n();
}



// load the configuration file of the service/binary
// @param {name, basedir} params parameters
// @param {boolean} debug debug mode
// @return {object} the configuration object
//
Helper.GetConfSync = function(params,debug) { 
    Helper.Debug({"name":"Helper.GetConfSync", "params" : params}, debug);
    return FileJsonConnector.Load({fileName:`${params.basedir}/${params.name}.json`});
}


*/



// exports the Helper functions for node.js
var module = Helper.Exports(module, Helper);










/*

// instanciates an object of the given class
// @param {object} _class class 
// @return the created object
// 
Helper.Instanciates = function(_class) {return Helper.Extends({}, _class)};

*/

	



















