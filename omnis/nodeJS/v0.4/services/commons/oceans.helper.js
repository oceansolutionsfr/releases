/**
 *  commons functions usable on server or client side
 * @author sebastien.mamy@gmail.com
 * @since 2020-09-25
 */


/** module object */
let helper = {
    silent: false,
    statuses:
    {
        "100":  "Continue",
        "101":  "Switching Protocols",
        "102":  "Processing",
        "200":  "OK",
        "201":  "Created",
        "202":  "Accepted",
        "203":  "Non-authoritative Information",
        "204":  "No Content",
        "205":  "Reset Content",
        "206":  "Partial Content",
        "207":  "Multi-Status",
        "208":  "Already Reported",
        "226":  "IM Used",
        "300":  "Multiple Choices",
        "301":  "Moved Permanently",
        "302":  "Found",
        "303":  "See Other",
        "304":  "Not Modified",
        "305":  "Use Proxy",
        "307":  "Temporary Redirect",
        "308":  "Permanent Redirect",
        "400":  "Bad Request",
        "401":  "Unauthorized",
        "402":  "Payment Required",
        "403":  "Forbidden",
        "404":  "Not Found",
        "405":  "Method Not Allowed",
        "406":  "Not Acceptable",
        "407":  "Proxy Authentication Required",
        "408":  "Request Timeout",
        "409":  "Conflict",
        "410":  "Gone",
        "411":  "Length Required",
        "412":  "Precondition Failed",
        "413":  "Payload Too Large",
        "414":  "Request-URI Too Long",
        "415":  "Unsupported Media Type",
        "416":  "Requested Range Not Satisfiable",
        "417":  "Expectation Failed",
        "418":  "I'm a teapot",
        "421":  "Misdirected Request",
        "422":  "Unprocessable Entity",
        "423":  "Locked",
        "424":  "Failed Dependency",
        "426":  "Upgrade Required",
        "428":  "Precondition Required",
        "429":  "Too Many Requests",
        "431":  "Request Header Fields Too Large",
        "440":  "Session Expired (non standard status)",
        "444":  "Connection Closed Without Response",
        "451":  "Unavailable For Legal Reasons",
        "499":  "Client Closed Request",
        "500":  "Internal Server Error",
        "501":  "Not Implemented",
        "502":  "Bad Gateway",
        "503":  "Service Unavailable",
        "504":  "Gateway Timeout",
        "505":  "HTTP Version Not Supported",
        "506":  "Variant Also Negotiates",
        "507":  "Insufficient Storage",
        "508":  "Loop Detected",
        "510":  "Not Extended",
        "511":  "Network Authentication Required",
        "599":  "Network Connect Timeout Error",
        "600":  "Debug",
        "601":  "Fatal Error"
    },
    RANDOM_BASE: "ABCDEF1234567890"
};

/**
 * returns the size of the object (NaN if the object cannot be sized)
 * @returns        number 
 */
helper.size = (item) => 
    item === undefined || item === null ? 0 : 
        item.key ? helper.size(item.value) : 
        Array.isArray(item) || typeof item === "string" ? item.length : 
        "object" === typeof item ? Object.keys(item).length : 
        ["boolean","symbol"].includes(typeof item) ? 1 : 
        ["number","bigint"].includes(typeof item) ? (new String(item)).length : 
        "function" === typeof item ? NaN : 0;


/**
 * returns the current date in EN, FR or US format 
 * @returns        string
 */ 
helper.date = (separator = "-", format = "FR", date = null, time = false) => {
    date = date === null ? new Date() : new Date(date);
    let suffix = time ? [
        String(date.getUTCHours()).padStart(2,"0"),
        String(date.getMinutes()).padStart(2,"0"),
        String(date.getSeconds()).padStart(2,"0"), 
        String(date.getMilliseconds()).padStart(3,"0")].join(separator) : ""; 
    return typeof separator  !== "string" || typeof format !== "string" ? helper.error("wrong parameter types", ...arguments) :
        format === "US" ? [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join(separator) + suffix :
        format === "EN" ? [String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0"),date.getFullYear()].join(separator) + suffix : 
        format === "FR" ? [String(date.getDate()).padStart(2,"0"), String(date.getMonth()+1).padStart(2,"0"), date.getFullYear()].join(separator) + suffix :
        helper.error("unknow format", ...arguments);
}

/** returns the current time in hh[:]mm[:]ss, or the time converted from the number of seconds 
 * @returns        string
 */
helper.time = (separator= ":", duration = -1) => {
    return  duration === 0 ? ["00","00","00"].join(separator) :
            duration < 0 ? [String(new Date().getHours() - 1).padStart(2, "0"), String(new Date().getMinutes()).padStart(2, "0"), String(new Date().getSeconds()).padStart(2, "0")].join(separator) :
            [String(new Date(duration * 1000).getHours() - 1).padStart(2, "0"), String(new Date(duration * 1000).getMinutes()).padStart(2, "0"), String(new Date(duration * 1000).getSeconds()).padStart(2, "0")].join(separator);
}

/**
 * log to the console the values, with a time stamped invite of type
 * @returns        undefined
 */
helper.log = (type, ...values) => {
    if(helper.silent) return;
    let error = (new Error()).stack.split("\n")[3];
    if(error.indexOf("(") >= 0) error = error.split("(")[1].split(")")[0].trim();
    console.log(helper.date() + " " + helper.time() + " [" + type.toUpperCase() + "] " + 
        ("undefined" !== typeof window ? "" : error), ...values);
    if(type === "DEBUG") console.log((new Error()).stack.split("\n").slice(1).join("\n"));
}

/**
 * throw an exception or log a fatal error to a log
 * @returns        undefined
 */
 helper.exception = (message, ...values) => {
    helper.log("EXIT", message, ...values);
    process.exit(-1);
}

/** 
 * returns the percentage of value over total
 * @returns        string
 */ 
helper.percent = (value, total) => {
    return  (typeof value !== "number" || typeof total !== "number") ? NaN : 
            value / total < 0.0001 ? "00.00%" : 
            value >= total  ? Math.floor(((value * 10000) / (total || 1)) / 100).toFixed(1) + "%" : 
            ""+ (Math.floor(((value * 10000) / (total || 1)) / 100).toFixed(2) + "%").padStart(6,"0");
}

/** 
 * cleans a string of double quotes and wrong CRLF
 * @returns        string
 */
helper.clean = (str) => typeof str  !== "string" ? null : str.replace(/\n/g,"").replace(/\\n/g,"").split("\\\"").join("\"").replace( / +/g, ' ' ).trim();


/**
 * create a rand string of length character
 * @returns        string
 */
helper.random = (length = 4, randombase = helper.RANDOM_BASE) => {
    return  typeof length !== "number" || length === 0 ? "" : 
            randombase.charAt(Math.floor(Math.random() * randombase.length)) + helper.random(length - 1, randombase);
}

/**
 * stringify an object, even with circular reference
 * @return         string
 */
helper.stringify = (item) => {
    if(item === undefined)                                      return "undefined";
    if(item === null)                                           return "null";
    if(helper.size(item) === 0 || isNaN(helper.size(item)))     return JSON.stringify(item);
    if(Array.isArray(item))                                     return item.reduce((out, value) => out += "\r\n" + JSON.stringify(value), []);
    if(typeof item !== "object")                                return String(item);
    const getCircularReplacer = function() {
        const seen =                                            new WeakSet();
        return function(key, value) {
            if(typeof value === "object" && value !== null) {
                if(seen.has(value))                             return value.id ? "@" + value.id : "[object: circular reference]";
                                                                seen.add(value);
            }
            return                                              value;
        };
    };
    return                                                      helper.clean(JSON.stringify(item, getCircularReplacer()));   
}

/**
 * randomly shuffle an array (shuffle the input array)
 * @return         array
 */ 
helper.shuffle = (arr) => {
    if(!Array.isArray(arr)) return helper.error("arr must be an array",...arguments);
    let ar = arr.slice();
    for (var _i = ar.length - 1; _i > 0; _i--) {
        var _j = ~~(Math.random() * (_i + 1));
        var _temp = ar[_i];
        ar[_i] = ar[_j];
        ar[_j] = _temp;
    }
    return ar;
};

/**
 * return an indented and wrapped string version of the json
 * @return          string
 */
helper.beautifyJson = (json, level = 0, references = []) => JSON.stringify(json, null, 4).split("\n");


/**
 * push a property value in a property key, avoiding duplicate
 * @return          number
 */
helper.addvalue = (item = null, value = null, key = null) => {
    if(null === value || null === value)                return -1;
    if(null === key && item.indexOf(value) !== -1)      return item.push(value) - 1;
    if(undefined === item[key])                         item[key] = [];
    if(item[key].indexOf(value) === -1)                 item[key].push(value) -1 ;
    return                                              item[key].indexOf(value);
}

/**
 * sets a property if the value is not undefined or null
 * @return          void
 */
helper.ifdef = (obj = null, value = null, key = null) => {
    if(obj !== null && value !== null && key !== null)  obj[key] = value;
}


/**
 * intersection of 2 arrays
 * @returns     array
 */
helper.intersect = (ar1, ar2) => [...ar1].filter(value=>ar2.includes(value));


/**
 * merge of 2 arrays without duplicates
 * @returns     array
 */
 helper.merge = (ar1, ar2) => {
    let ret = ar1;
    for(let value of ar2) if(ret.indexOf(value) < 0) ret.push(value);
    return ret;
 }


/**
 * return the prefered value of a item property
 */
helper.getPreferedValue = (item = null, property = null, key = null) => {
    if(item === null || property === null || item[property] === undefined) return;
    if(key === null) {
        for(const values of Object.values(item[property])) if(values?.length > 0) return values[0];
    }
    if(key !== null && item[property][key]?.length > 0) return item[property][key][0];
    return null;
}

 
if(typeof window === "undefined")         module.exports = helper;
else                                      window.helper = helper;











