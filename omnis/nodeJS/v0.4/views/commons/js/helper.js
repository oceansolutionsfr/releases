// commons functions usable on server or client side
// @author sebastien.mamy@gmail.com
// @since 2020-09-25
//


// returns an error object or a call a function depending on the predicate result
const predicate = (result, success) => result.__error ? result : success(result);
if(typeof global !== "undefined") global.predicate = predicate; else window.predicate = predicate;

//  returns an error object or a call a function depending on the predicate result
const test = (result, message) => result ? {} : Helper.out(600,message);
if(typeof global !== "undefined") global.test = test; else window.test = test;

/** status message from HTTP references */
const StatusText =
{
    100:  "Continue",
    101:  "Switching Protocols",
    102:  "Processing",
    199:  "Client Request",
    200:  "OK",
    201:  "Created",
    202:  "Accepted",
    203:  "Non-authoritative Information",
    204:  "No Content",
    205:  "Reset Content",
    206:  "Partial Content",
    207:  "Multi-Status",
    208:  "Already Reported",
    226:  "IM Used",
    300:  "Multiple Choices",
    301:  "Moved Permanently",
    302:  "Found",
    303:  "See Other",
    304:  "Not Modified",
    305:  "Use Proxy",
    307:  "Temporary Redirect",
    308:  "Permanent Redirect",
    400:  "Bad Request",
    401:  "Unauthorized",
    402:  "Payment Required",
    403:  "Forbidden",
    404:  "Not Found",
    405:  "Method Not Allowed",
    406:  "Not Acceptable",
    407:  "Proxy Authentication Required",
    408:  "Request Timeout",
    409:  "Conflict",
    410:  "Gone",
    411:  "Length Required",
    412:  "Precondition Failed",
    413:  "Payload Too Large",
    414:  "Request-URI Too Long",
    415:  "Unsupported Media Type",
    416:  "Requested Range Not Satisfiable",
    417:  "Expectation Failed",
    418:  "I'm a teapot",
    421:  "Misdirected Request",
    422:  "Unprocessable Entity",
    423:  "Locked",
    424:  "Failed Dependency",
    426:  "Upgrade Required",
    428:  "Precondition Required",
    429:  "Too Many Requests",
    431:  "Request Header Fields Too Large",
    440:  "Session Expired (non standard status)",
    444:  "Connection Closed Without Response",
    451:  "Unavailable For Legal Reasons",
    499:  "Client Closed Request",
    500:  "Internal Server Error",
    501:  "Not Implemented",
    502:  "Bad Gateway",
    503:  "Service Unavailable",
    504:  "Gateway Timeout",
    505:  "HTTP Version Not Supported",
    506:  "Variant Also Negotiates",
    507:  "Insufficient Storage",
    508:  "Loop Detected",
    510:  "Not Extended",
    511:  "Network Authentication Required",
    599:  "Network Connect Timeout Error",
    600:  "Wrong Parameter Format"
};


const Helper = {


/// checks the args with the expected types
/// @returns        {__error:boolean}
/// @functional     pure
checktypes: (args, types, predicates = [], messages = []) => 
{
    if(Helper.typeof(args) !== "array" || Helper.typeof(types) !== "array" || Helper.typeof(predicates) !== "array" || Helper.typeof(messages) !== "array")
        return Helper.out(600, "arguments shall be arrays");
    if(types.length < args.length)
        return Helper.out(600,"types shall be specified");
    return args.reduce(
        (result, arg, index) => {
            if(result.__error) 
                return result;

            if(types[index] !== null && types[index] !== Helper.typeof(arg))
                return Helper.out(600, "arguments shall be: " + types.join(", "));

            if(predicates.length > index && !["null","function"].includes(Helper.typeof(predicates[index]))) 
                return Helper.out(600,"predicate shall be a function at index " + index);

            if(predicates.length <= index || predicates[index] === null || predicates[index](arg, index))
                return result;

            if(messages.length >= index && Helper.typeof(messages[index]) === "string" && messages[index].length > 0)
                return Helper.out(600, messages[index]);

            return Helper.out(600, "unknown error at index " + index);
        }, {}
    );
},


/// creates an array or return the array if already an array
/// @returns        array
/// @examples       Helper.array("hello");<br/><font color='#909090'>// returns ["hello"]</font>:: Helper.array([1,2]);<br/><font color='#909090'>// returns [1,2]</font>
/// @functional     pure
array: (item = []) => Helper.typeof(item) === "array" ? item : [item], 



/// returns the current date in EN, FR or US format 
/// @returns        string
/// @functional     side-effect:time 
date: (separator = "-", format = "FR") => 
    Helper.typeof(separator) !== "string" || Helper.typeof(format) !== "string" ? Helper.out(600,"parameters shall be strings", separator,format) :
    format === "US" ? [(new Date()).getFullYear(),String((new Date()).getMonth()+1).padStart(2,"0"),String((new Date()).getDate()).padStart(2,"0")].join(separator) :
    format === "EN" ? [String((new Date()).getMonth()+1).padStart(2,"0"),String((new Date()).getDate()).padStart(2,"0"),(new Date()).getFullYear()].join(separator) : 
    format === "FR" ? [String((new Date()).getDate()).padStart(2,"0"), String((new Date()).getMonth()+1).padStart(2,"0"), (new Date()).getFullYear()].join(separator) :
    Helper.out(600,"unknown format", format),



/// returns the current time in hh[:]mm[:]ss, or the time converted from the number of seconds 
/// @returns        string
/// @functional     side-effect:time
time: (separator= ":", duration = -1) =>  {
    if(Helper.typeof(separator) !== "string") return Helper.out(600,"separator shall be string", separator);
    if(Helper.typeof(duration) !== "number") return Helper.out(600,"duration shall be number", duration);
    let d = duration > 0 ? new Date(duration * 1000) : new Date();
    if(duration === 0) return ["00","00","00"].join(separator);
    return [String(duration > 0 ? d.getHours() - 1 : d.getHours()).padStart(2, "0"), String(d.getMinutes()).padStart(2, "0"), String(d.getSeconds()).padStart(2, "0")].join(separator);
},



/// returns the size of the object
/// @returns        number
/// @functional     pure
size: (item) =>  
{
    switch(Helper.typeof(item)) {
        case "array":
        case "string":
            return item.length;
        case "object":
            return Object.keys(item).length;
        default:
            return Helper.out(600,"item shall be array, string or object", item);
    }
},


/// return the type of the item, "null" if null and "array" if array 
/// @returns        string
/// @functionl      pure
typeof: (item) => item === null ? "null" : Array.isArray(item) ? "array": typeof item,



/// a console out of a message of type
/// @returns        void
/// @functional     side-effect
out: (type, message, ...inputs) => 
{
    let output = Helper.date() + " " + Helper.time() + " " + "[" + type + "] " + message + ": " + (new Error()).stack.split("\n")[2].trim();
    if(Helper.typeof(type) === "number")  
        return {
            __status: type,
            __statusText: StatusText[type],
            __message: message,
            __stack: (new Error()).stack.split("\n")[2].trim(),
            __date: Helper.date() + " " + Helper.time(),
            __inputs: inputs,
            __error : type>=400
        }
    else if(Helper.typeof(type) !== "string") return Helper.out(600,"type shall be string or number");
    else switch(type) {
        case "FATAL":
            console.log(output);
            if(inputs) console.log(inputs);
            console.log((new Error()).stack,"\n");
            throw message;
        case "ERROR":
            console.log(output);
            if(inputs) console.log(inputs);
            console.log((new Error()).stack,"\n");
            break;
        case "WARING":
        case "DEBUG":
            console.log(output);
            if(inputs) console.log(inputs);
            break;
        case "EXIT":
            console.log(output);
            if(inputs) console.log(inputs);
            console.log("");
            break;
        default:
            console.log(output);
    }
},


/// select object properties according to a selector function (item, key) => boolean
/// @returns        object
/// @examples       Helper.select({z:{name:3,id:2}, a:{id:1, name:"s"}},(property, key) => property.name === 3);<br/><font color='#909090'>// returns [z];</font>
/// @functional     pure
select: (items, selector) => predicate
(
    Helper.checktypes([items, selector], ["object", "function"]), 
    ()=>Object.keys(items).reduce((selection, key) => selector(items[key], key) ? {...selection, [key]: items[key]} : selection, {})
),


/// returns the percentage of value over total
/// @returns        string
/// @examples       Helper.percent(1,10);<br/><font color='#909090'>// returns '10.00%'</font>:: Helper.percent(1,3);<br/><font color='#909090'>// returns '33.33%'</font>
/// @functional     pure
percent: (value, total) => predicate
(
    Helper.checktypes([value, total], ["number","number"]), 
    () =>((""+(Math.floor((value * 100 * 100) / (total || 1)) / 100).toFixed(2)) + "%")
),


/// cleans a string of double quotes and wrong CRLF 
/// @returns        string
/// @functional     pure
clean: (item) => predicate
(
    Helper.checktypes([item],["string"]), 
    () => item.replace(/\n/g,"").replace(/\\n/g,"").split("\\\"").join("\"").replace( / +/g, ' ' ).trim()
),



/// calls with the arguments and returns the results of the tests
/// @returns        object{success, failure, errors}
/// @functional     dependent
tests: (func) => predicate
(
    Helper.checktypes([func], ["function"],[(funct) => Helper.typeof(funct.testdata) === "array"],["cannot test function without testdata property"], func), 
    () => {
        const testdata = func.testdata;
        const res = (testdata.map((test) => test.args)).map((arg) => func(...Helper.array(arg)));
        return res.reduce((output, result, i) => {
            if( (Helper.typeof(testdata[i].target) === "function" && testdata[i].target(result)) || 
                (Helper.typeof(testdata[i].target) !== "function" && Helper.stringify(result) === Helper.stringify(testdata[i].target))) output.success++; 
            else {
                output.failure++;
                output.errors.push({
                    test: (i+1),
                    params:  testdata[i].args,
                    targets: Helper.stringify(testdata[i].target), 
                    results: Helper.stringify(result)
                });
            }
            return output;
        }, {success: 0, failure: 0, errors: []});
    }
),



/// stringify an object, even with circular reference
/// @returns        string
/// @functional     pure
stringify: (item) => 
{
    if(Helper.typeof(item) === "undefined") return "undefined";
    if(Helper.typeof(item) === "null") return "null";
    if(Helper.size(item) === 0) return JSON.stringify(item);
    switch(typeof item) {
        case "function":
            return item.name + " [Function]";
        case "array":
            return item.reduce(function(out, value) { out += "\r\n" + JSON.stringify(value); });
        case "object":
            const getCircularReplacer = function() {
                const seen = new WeakSet();
                return function(key, value) {
                    if (typeof value === "object" && value !== null) {
                        if (seen.has(value)) return value.id ? "@" + value.id : "[object: circular reference]";
                        seen.add(value);
                    }
                    return value;
                };
            };
            return Helper.clean(JSON.stringify(item, getCircularReplacer()));
        default:
            return String(item);
    }
},


/// create a rand string of length character
randomstring: (length) => predicate
(
    test(Helper.typeof(length) === "number" && length >= 0, "length shall be a positive integer"),
    () => {
        if(length === 0) return "";
        var result           = "";
        var characters       = "AZERTYUIOPQSDFGHJKLMWXCVBN0123456789";
        var charactersLength = characters.length;
        return characters.charAt(Math.floor(Math.random() * charactersLength)) + Helper.randomstring(length - 1);
    }
),



/// generate a unique time-based id
/// @returns        string
/// @functional     random  
timeid: (type = "") => predicate 
(
    Helper.checktypes([type],["string"]),
    () =>   
    {
        let t = (new Date()).toJSON().split(".");
        let out =t[0].split("-").join("").split("T").join("").split(":").join("")  + t[1].trim().substr(0,3);
        return  out.substr(0,4) + "-"+ (type.length > 0 ? (type.toUpperCase().padEnd(4,"X").substr(0,4) + "-") : "") + Helper.randomstring(4) + "-" + out.substr(4,4)  + "-" + Helper.randomstring(4); 
    }
),



/// create an index from a list of items and a property
/// @returns        object{key:[item]}
/// @functional     pure
index: (items, property = "id") => predicate
(
    Helper.checktypes([items, property], ["object", "string"]),
    () => Object.keys(items).reduce((index, id) => 
        items[id][property] ? {...index, [items[id][property]] : index.hasOwnProperty(items[id][property]) ? [...index[items[id][property]], items[id]] : [items[id]] } : index, {})
),



/// reduce an object or an array according to an include function, and limiting to a subset of properties ({a:true, b:false,c: true),["a","b"],(v) => v) => {a:true}
/// @returns        object
/// @examples       Helper.reduce({a:1,b:2,c:1},null,(v) => v === 1);<br/><font color='#909090'>// returns {a: 1,c:1}</font><br/><br/>Helper.reduce({a:1,b:2,c:1},["a","b"],(v) => v === 1);<br/><font color='#909090'>// returns {a: 1}</font>
/// @functional     pure
reduce: (items, include) => predicate
(
    Helper.checktypes([items,include],["object","function"]),
    () => Object.values(items).reduce((result, item) => include(item) ? {...result, [item.id]: item} : result, {})
),



/// filter the properties of an item
/// @returns        object
/// @examples       Helper.filter({a:{n:1,i:2},b:{n:1,c:2},c:{a:2}},["n,c"]);<br/><font color='#909090'>// returns {a: {n: 1}, b: {n: 1, c: 2}, c: {}}</font>
/// @functional     pure
filter: (item, props) => predicate
(
    Helper.checktypes([item, props], ["object","array"]),
    () => props.reduce((filtered, property) => item.hasOwnProperty(property) ? {...filtered, [property]: item[property]} : filtered, {})
),



/// returns a offset-th page of the item properties
/// @returns        object
/// @functional     pure
paginate: (item, offset, size) => predicate 
(
    Helper.checktypes([item, offset, size],["object","number","number"],[null, ($offset) => $offset < Object.keys(item).length && $offset >= 0],[null,"offset shall be smaller than item size"]),
    () => Object.keys(item).slice(offset).slice(0, size).reduce((page, id) => ({...page, [id]: item[id]}), {}),
),



/// sort item (null: key name, "__value__":stringify of items, any: per stringify of item[prop]
/// @returns        object
/// @functional     pure
sort: (item, prop = null, asc = true) => predicate
(
    Helper.checktypes
    (
        [item, prop, asc],
        [null, null, null], 
        [
            ($item)=>Helper.typeof($item) === "object", 
            ($prop) => $prop === null || Helper.typeof($prop) === "string",
            ($asc) => Helper.typeof($asc) === "boolean"
        ],
        ["item shall be object", "prop shall be: null, string", "asc shall be boolean"]
    ),
    () => 
        prop === null && asc  ? Object.keys(item).sort().reduce((page, id) => ({...page, [id]: item[id]}), {}) : 
        prop === null && !asc ? Object.keys(item).sort().reverse().reduce((page, id) => ({...page, [id]: item[id]}), {}) : 
        prop === "__value__"  ? Object.keys(item).sort((key1, key2) => Helper.stringify(item[key1]) < Helper.stringify(item[key2]) ? (asc ? -1 : 1) : (asc ? 1 : -1)).reduce((page, id) => ({...page, [id]: item[id]}), {}) : 
        Object.keys(item).sort((key1, key2) => Helper.stringify(item[key1][prop]) < Helper.stringify(item[key2][prop]) ? (asc ? -1 : 1) : (asc ? 1 : -1)).reduce((page, id) => ({...page, [id]: item[id]}), {})
),
    
    

/// add a unique id to an item (not conflicting with items.keys). If the id of the id does exists, return the merged object
/// @returns        object
/// @functional     pure
identify: (items, item, id = null) => predicate
(
    Helper.checktypes([items, item],["object","object"]),
    () => 
    {
        if(item.id) 
            return {...items[item.id],...item};
        if(id !== null && !Object.keys(items).includes(id))
            return {...item, id: id};
        return Helper.identify(items, item, Helper.timeid(item.type ? item.type.substr(0,4).toUpperCase() : undefined));
    }
),



/// apply a function to all the item of an item collection
/// @returns        object
/// @functional     pure
map: (items, func) => predicate
(
    Helper.checktypes([items, func],["object","function"]),
    () => Object.keys(items).reduce((result, key) => ({ ...result, [key]: func(key, items)}), {})
),



/// push an item to the collection
/// @returns        object
/// @functional     pure
push: (items, item) => predicate
(
    Helper.checktypes([items, item], ["object", "object"]),
    () => 
    {
        const it = Helper.identify(items, item);
        return { ...items, [it.id]: it};
    }
),



/// randomly shuffle an array (shuffle the input array)
/// @returns        array
/// @functional     random
shuffle: (arr) => predicate
(
    Helper.checktypes([arr],["array"]),
    () => 
    {
        let ar = arr.slice();
        for (var _i = ar.length - 1; _i > 0; _i--) {
            var _j = Math.floor(Math.random() * (_i + 1));
            var _temp = ar[_i];
            ar[_i] = ar[_j];
            ar[_j] = _temp;
        }
        return ar;
    }
)


}



// make available for node.js
if(typeof module !== "undefined") module.exports = Helper;
else window.Helper = Helper;

