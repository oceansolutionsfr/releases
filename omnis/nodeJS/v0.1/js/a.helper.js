// @author sebastien.mamy@gmail.com
// @since 2019-07-03
//


// var require = require === undefined ? function(mod) {return undefined;} : require;

// var crypto = crypto !== undefined ? crypto : require("crypto")


// general purpose functions
var Helper = {
    /*"data": {
        "LogDir": "logs/"
    }*/
}

// internal variables
var __sequences = {};


//
// GENERAL PURPOSE FUNCTIONS 
//


// returns true if Javascript is running client side
// @return {boolean} true if the runtime is client side
//
/*Helper.IsClient = function() {
    return typeof window != 'undefined' && window.document
 }*/


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
/*
Helper.Exports = function(module, obj) {
    module = Helper.Init(module)
    module.exports = obj
    return module
}*/




// 
// OBJECT RELATED FUNCTIONS
//


// init a variable
// @param {object} o object to init
// @param {object} d default value to set, undefined per default
// @return {object} object instancied 
//
/*
Helper.Init = function(o, d) {
    return o === undefined ? (d === undefined ? {} : d) : o
}*/


// instantiate a object of the given class
// @param {object} c object class to use
// @param {object} o object to clone(optional)
// @return the created instance
// 
// Helper.New = function(c,o) { var o = Helper.Init(o,{});return Object.assign({}, c, o);}


// extends an object with the given class
// @param {object} o object to extend
// @param {object} c class to extend to
// @return the extended object
// 
// Helper.Extends = function(o, c) { var o = Helper.Init(o, {}); return Object.assign(o,c);}


// returns true if the instance is empty or null
// @param {object} t instance to check
// @return {boolean} true is the instance is empty or of length 0
//
Helper.IsEmpty= function(t){ return typeof t === "string" ? (t === undefined || t === null || t.length ==0 || t.toLowerCase() === "null" || t.toLowerCase === "undefined"): Helper.Size(t) === 0; }
	

Helper.TestEmpty = (...$objects) => { 
    $objects.forEach(function($object) {
        if(Helper.IsEmpty($object)) throw {"status": 500, "error": "empty parameter", "stack": new Error().stack}
    })    
}


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


// returns the size of the object 
// @param {object} t instance to be scanned
// @param {boolean} notnull (optional) if true, count only the non-null entries
// @return {int} size of the instance
// 
Helper.Size = function(t, notnull) {
    var type = Helper.GetType(t)
    if(!notnull) return  (t===undefined|| t===null) ? 0 : (type === 'string' || type === 'array') ? t.length : type === 'object' ? Object.keys(t).length: -1        
    else if(type !== 'array') return type === 'string' ? t.length : type === 'object' ? Object.keys(t).length: -1
    var count = 0
    for(var i in t) if(t[i] !== null) count++
    return count
}

// return an object property value from a dot separated path
// @param {object} _obj object to browse
// @param {string} _path of the property to look for
// @return {object} the value of the property or null
//
Helper.JsonGet = (_obj, _path) => {
    _path.split('.').reduce((p,c)=>p&&p[c]||null, _obj)
}


// find the string according to the dictionnary
// @param {string} s string to look for
// @param {object} d dictonnary 
// @return {object} 
//
/*Helper.Find = function(s, d) {return d === undefined || d === null ? undefined : s === undefined ? undefined : d[s]}*/


// find the first entry matching a key of the dictionnary
// @param {string} s string where the 
// @param {object} d dictonnary to use
// @return {object} the first matching entry of the dictionnary
//
/*
Helper.Match = function(s, d) {
    if(s === null || s === undefined || typeof s !== 'string') return undefined
    if(d === null || d === undefined) return undefined
    for(var k in d) if(s.indexOf(k) >= 0) return d[k]
    return undefined
}*/


// test if an object match the value
// @param {value, object} params parameters to use
// @param {boolean} debug debug mode
// @return {boolean} true if the object has at least a field that contains the value
//
/*Helper.MatchSync = function(params, debug) {
    if(params == undefined || params === null) return undefined
    if(params.object === undefined || params.object === null) return undefined
    if(params.value === undefined || params.value === null) return undefined
    Helper.Debug({"name" : "Helper.MatchSync", "params" : params}, debug);
    for(var prop in params.object) {
        var field = params.object[prop];
        if(typeof field === "string" && field.toLowerCase().includes(params.value.toLowerCase())) return true;
    }
    return false;}*/



/** fitler the store and returns the list of filtered ids
 * @param {object} dataset data to be filtered according to the value
 * @param {boolean} debug debug mode
 * @return {array} the array of matching ids
 */
/* Helper.FilterSync = function(dataset, value, debug) {
    var keys = []
    for(var key in dataset) {
        var item = dataset[key];
        if(Helper.MatchSync({"object": item, "value" : value}, debug)) keys.push(key)
    }
    Helper.Debug({"name" : "IStore.Filter", "params" : dataset, "output": keys}, debug)
    return keys
}*/

/** select the expected indexes from the dataset
 * @param {object} dataset set of data from which the extract will be done
 * @param {array} indexes array of the indexes to extrat
 * @return {object} a temporary object containing the selected objects 
 */
/* Helper.SelectSync = function(dataset, indexes) {
    var out = {}
    for(var k in dataset) if(indexes.includes(k)) out[k] = dataset[k]
    return out
}*/


/** truncate an array at the given offset
 * @param {array} ar array to truncate
 * @param {int} size size of the set to return
 * @param {int} offset offset where to start the truncation
 * @returns {array} the truncated array
 */
// Helper.TruncateSync = function(ar, size, offset) 



//
// DATE AND TIME RELATED FUNCTION
//


// format a time in hh:mm:ss
// @param {int} s number of seconds
// @param {int} d if d == 4, limits the output as mm:ss
// @return {string} the formated time value 
// 

Helper.FormatSeconds = function(s, digits) {
    if(isNaN(s)) return "00:00"
    var date = new Date(null)
    date.setSeconds(s)
    if(digits === 4) return date.toISOString().substr(14, 5)
    else return date.toISOString().substr(11, 8)
}


// format the date to YYYYMMDD 
// @param {string} d date to format
// @param {string} f [US|FR] format of the incoming date
// @return {string} formated date or empty if the input string was not a date
// 
/*Helper.FormatDate = function(d, f) {
    d = typeof d === 'string' ? d.trim() : ''+Helper.Clean(d);
    if(Helper.IsEmpty(d)) return '';
    if(!Helper.IsEmpty(d) && Helper.IsEmpty(f) && d.length === 10 && isNaN(d.charAt(4))) return Helper.FormatDate(d, 'US'); 
    else if(!Helper.IsEmpty(d) && Helper.IsEmpty(f) && d.length === 10 && isNaN(d.charAt(2))) return Helper.FormatDate(d, 'FR');
    else if(!Helper.IsEmpty(d) && f === "US" && d.length === 8) return d;
    else if(!Helper.IsEmpty(d) && f === "FR" && d.length === 8) return d.substring(4) + d.substring(2, 4) + d.substring(0, 2);
    else if(!Helper.IsEmpty(d) && f === "US" && d.length === 10) return d.substring(0, 4) + d.substring(5, 7) + d.substring(8);
    else if(!Helper.IsEmpty(d) && f === "FR" && d.length === 10) return d.substring(6) + d.substring(3, 5) + d.substring(0,2);
    return '';
}*/


// returns the current date in dd[-]mm[-]yyyy
// @param {string} sep of the date, - by default
//
Helper.GetCurrentDate = (sep = "-") => {
    var d = new Date()
    //var o = Helper.FillNumber(d.getDate(), 2) + separator + Helper.FillNumber(d.getMonth()+1,2) + separator + d.getFullYear()
    return [(""+d.getDate()).padStart(2, "0"),
            (""+(d.getMonth()+1)).padStart(2, "0"),
            d.getFullYear()].join(sep)
}


// returns the current time in hh[:]mm[:]ss
// @param {string} sep of the date, - by default
//
Helper.GetCurrentTime = (sep = ":") => {
    var d = new Date()
    return  [(""+d.getHours()).padStart(2, "0"),
             (""+d.getMinutes()).padStart(2, "0"),
             (""+d.getSeconds()).padStart(2, "0")].join(sep)
    
    //return Helper.FillNumber(d.getHours(), 2) + ":" + Helper.FillNumber(d.getMinutes(),2) + ":" + Helper.FillNumber(d.getSeconds(),2)

}


// returns the current date and time in dd-mm-yyy hh:mm:ss
//
Helper.GetCurrentDateTime = (sep = " ") => {
    return Helper.GetCurrentDate() + sep + Helper.GetCurrentTime()
}


// returns a clean date or null if no date
// @param {year, month, day, separator} params parameters
// @param {boolean} debug debug mode
// @return {string} formated date YYYY-MM-DD
//
/*
Helper.CreateDateSync = function(params, debug) {
    if(Helper.IsEmpty(params.separator)) params.separator = "";
    var date =  "" + (Helper.IsEmpty(params.year) ? "XXXX" : Helper.FillNumber(Helper.Clean(params.year),4)) + params.separator +
                (Helper.IsEmpty(params.month) ? "XX" : Helper.FillNumber(Helper.Clean(params.month),2)) + params.separator +
                (Helper.IsEmpty(params.day) ? "XX" : Helper.FillNumber(Helper.Clean(params.day),2));
    Helper.Debug({"name" : "", "params": params, "output" : date}, debug);
    return date === ("XXXX" + params.separator + "XX" + params.separator + "XX") ? null : date;}*/




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
// Helper.ReplaceString = function(s,s1,s2,c)  {var c = Helper.Init(c, true);    return Helper.Clean(s).replace(new RegExp(s1, c ? 'g' : 'gi'), s2);}


// prepare the string for neo4j
// @param {string} s input string
// @return {string} new string with the replacement done
//
// Helper.PrepareString = function(s)  {return Helper.ReplaceString(Helper.ReplaceString(s, "\"","\\\""),"'","\\'");}


// creates a simple hase (no space and all lower case)
// @param {string} s string to hash
// @return {string} hash of the string
//
// Helper.Hash = function(s) {Helper.Assert(!Helper.IsEmpty(s),'Helper.Hash: cannot hash an empty string');return s.toLowerCase().replace(/\s/g,'');}


// proper the string (see excel PROPER function)
// @param {string} v string to proper
// @return {string} the "propered" string
// 
// Helper.Proper=function(v){if(!Helper.IsEmpty(v)) return Helper.Clean(''+v).toLowerCase().replace(/\b[a-z]/g, function (letter) {return letter.toUpperCase();});else return '';}


// split a string into a list with the given separator
// @param {object} v value to split
// @param {string} s separator (default |)
// @return {array} array of the values contained by the input
//
/*
Helper.ResolveList = function(v, s = "::") {
    if(typeof v === "string" && v.includes(s)) return v.split(s)
    return v
}*/


// encode a list in a string
// @param {array} a array to encode in a string
// @param {string} s separator (default |)
// @return {string} the encoded string
//
// Helper.EncodeList = function(a, s = "::") {var s = Helper.Init(s, "|"), r="";if(Helper.GetType(a) === "array") for(var i in a) r += "|" + Helper.Clean(a[i]);return r.length > 0 ? r.substring(1) : r; }




// compares 2 strings
// @param {string} s1 string to compare
// @param {string} s2 string to compare
// @return {int} 0 if the strings don't equal, 1 if they equal case unsensitive, 2 if they equal case sensitive
//
// Helper.StringCompare = function(s1, s2) {if(s1 === undefined) return s2 === undefined ? 2 : 0;if(s1 === null) return s2 === null ? 2 : 0;if(s1 === s2) return 2;else if(s2 === null || s2 === undefined) return 0;else if(s1.toLowerCase() === s2.toLowerCase()) return 1;return 0;}


// returns the hash of the string
// @param {value} params parameter
// @return {string} the hash
//
/*Helper.StringHashSync = function(params, debug) {
    var v = typeof params === 'string' ? params : params.value
    // var hash = crypto.getHashes()
    var hashPwd = crypto.createHash('sha1').update(v).digest('hex').substr(0,12)
    return hashPwd
}*/


// returns the simple hash of the string (lowercase)
// @param {value} params parameter
// @param {boolean} debug debug mode
// @return {string} the hash
//
/*Helper.SimpleHash = function(value, debug) {
    var hash = value !== undefined && value !== null ? value.trim().toLowerCase() : value
    Helper.Debug({"name":"Helper.SimpleHash","params":value,"output":hash},debug)
    return hash
}*/

// 
// ARRAY RELATED FUNCTIONS 
//


// randomly shuffle an array (shuffle the input array)
// @param {array} a array to shuffle
// @return {array} the shuffled array (which is the initial variable)
//
Helper.Shuffle = function(a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = a[i]
        a[i] = a[j]
        a[j] = temp
    }
    return a
}



//  shift a array index by step, and rotate if the array bounds are reached
// @param {array} ar array to browse
// @param {int} pos current position in the array
// @param {int} step shift step (can be negative) 
// @returns {int} the shifted position in the array
// 
Helper.ArrayShift = function(ar, pos, step) {
    pos = pos + step
    if(pos >= ar.length) pos = pos - ar.length
    if(pos < 0) pos = ar.length + pos
    return pos
}



// return a random index of a array
// @param {Array} array the array to get the random from
// @param {string} exclude value to avoid
// @param {string} prop name of the property to check the value
Helper.ArrayRandom = function(array, exclude, prop) {
    var out = array[Math.floor(Math.random() * array.length)]    
    var v = prop === undefined ? out : out[prop]
    while(v === exclude) {
        if(array.length === 1) throw {"status" : 800, "error": "impossible to pick a random index in the array"}
        out = array[Math.floor(Math.random() * array.length)]
        v =  Helper.IsEmpty(prop) ? out : out[prop]
    }
    return out
}



// to be used when a function has to be implemented
// @throws not implemented exception
// 
Helper.ToImplement = function(){
    console.trace()
    throw {"status" : 900, "error" : "not implemented"}
}


var module = module === undefined ? null : module
if(module !== null) module.exports = Helper








