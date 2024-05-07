/** omnis.utils.js
 * @author sebastien.mamy@gmail.com @since 2021-12-09
 * @license proprietary @disclaimer in no event shall the author be liable for any claim or damages.
 */


const _ = (...params) => utils.monitor("omnis.utils.js:" + params[0], ...params.slice(1)) 


/** console color for logging **/
const Color = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGrey: "\x1b[90m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    BgGrey: "\x1b[100m",
}

/** the module to export **/
const utils = {

    /** chars to be used for random string generation **/
    RANDOM_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",

    icon: (icon_id) => {
        if(!emoji[icon_id]) {
            console.warn("cannot find emoji " + icon_id)
            icon_id = "unknown"
        }
        return emoji[icon_id]
    },

    /** @return {string} the convert {number} @value to a base 62 string **/
    base62: (value) => {
        const dec_map = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
        let result = ""
        if (typeof value === "number") {
            while (value > 0) {
                result = dec_map[value % 60] + result
                value = parseInt(value / 60)
            }
        } else if (typeof value === "string") result = value.split("").reduce((result, char) => result + dec_map.indexOf(char))
        else throw "Cannot convert non-string or non-integer value: coding issue, check value type before calling utils.base62()"
        return result
    },

    /** @return {any} the result of a blocking call of async @func with @params **/
    callAsync: (func, ...params) => {
        let result = "**EMPTY_RESULT**"
        func(...params).then(asyncResult => result = asyncResult)
                       .catch(asyncError => result = asyncError)
        while (result === "**EMPTY_RESULT**") setTimeout(() => undefined, 10)
        return result
    },

    /** @return {string} the clean version of @str **/
    center: (str, size) => str.padStart(str.length + Math.floor((size - str.length) / 2), ' ').padEnd(size, ' '),

    left: (str, size, pad = 1) => (str + "".padStart(pad, " ")).padEnd(size, " "),

    right: (str, size, pad = 1) => (str + "".padEnd(pad, " ")).padStart(size, " "),

    /** @return {string} the clean version of @str **/
    clean: (str) => typeof str !== "string" ? null : str.replace(/\n/g, "").replace(/\\n/g, "").split('\\"').join('"').replace(/ +/g, " ").trim(),

    /** @return {object} the deep clone of @obj **/
    clone: (obj) => typeof obj !== "object" ? obj : typeof structuredClone !== "undefined" ? structuredClone(obj) : Object.assign({}, obj),

    /** @returns {string} a representation of @date with @separator and @format, with optional {boolean} @time **/
    date: (separator = "-", format = "FR", date, time = false) => {
        if (typeof date === "undefined" || date === "null" || date === null) date = null
        else {
            date = "" + date
            if (date.length === 6) date = date.substring(0, 4) + separator + date.substring(4, 6)
            if (date.length === 8) date = date.substring(0, 4) + separator + date.substring(4, 6) + separator + date.substring(6)
        }
        date = date === null ? new Date() : new Date(date)
        const suffix = time ? " " + String(date.getUTCHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0") + ":" + String(date.getSeconds()).padStart(2, "0") + "." + String(date.getMilliseconds()).padStart(3, "0") : ""
        return format === "US" ? [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join(separator) + suffix : format === "EN" ? [String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0"), date.getFullYear()].join(separator) + suffix : format === "FR" ? [String(date.getDate()).padStart(2, "0"), String(date.getMonth() + 1).padStart(2, "0"), date.getFullYear()].join(separator) + suffix : date
    },

    /** @return {string} the current function name with @depth **/
    getCurrentFunctionName: (level = 0) => {
        return new Error("dummy").stack.split("\n")[level + 2].replace(/^\s+at\s+(.+?)\s.+/g, "$1")
    },

    /** @return {string} the file name of the script from which the function is called **/
    getScriptName: () => {
        let source
        const error = new Error(),
            lastStackFrameRegex = new RegExp(/.+\/(.*?):\d+(:\d+)*$/),
            currentStackFrameRegex = new RegExp(/getScriptName \(.+\/(.*):\d+:\d+\)/)
        if (((source = lastStackFrameRegex.exec(error.stack.trim())) && source[1] != "") || (source = currentStackFrameRegex.exec(error.stack.trim()))) return source[1]
        else if (error.fileName != undefined) return error.fileName
    },

    /** @return {number} the size of @item (NaN if the object cannot be sized) **/
    length: (item = null) => {
        if(item === null || item === undefined) return 0
        if(item.length) return item.length
        if("object" === typeof item) Object.keys(item).length
        if(["boolean", "symbol"].includes(typeof item)) return 1
        if(["number", "bigint"].includes(typeof item)) return (""+item).length
        if("function" === typeof item) return NaN
        return 0
    },

    /** @return {number} the normalized distances between @s1 and @s2 **/
    levenshtein: (s1, s2) => {
        if(!s1 && !s2) return 0
        if((s1 && !s2) || (!s1 && s2)) return 1
        const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null))
        for (let i = 0; i <= s1.length; i += 1) track[0][i] = i
        for (let j = 0; j <= s2.length; j += 1) track[j][0] = j
        for (let j = 1; j <= s2.length; j += 1) {
            for (let i = 1; i <= s1.length; i += 1) {
                const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1
                track[j][i] = Math.min(track[j][i - 1] + 1, track[j - 1][i] + 1, track[j - 1][i - 1] + indicator)
            }
        }
        return Math.abs(track[s2.length][s1.length] / Math.max(s1.length, s2.length))
    },

    /** @return {string} containing the normalized version of @str (removes spaces and change case to lower case) **/
    lowerise: (str) => {
        const send = utils.monitor("utils.lowerise")

        let result = null
        if(str) result = utils.clean(str).toLowerCase().replaceAll(" ", "")

        return send(result)
    },

    /** @return {number} distance between @date1 and @date2 */
    compareDate: (date1, date2) => {
        if(date1 === date2) return 0
        if(!date1 || !date2) return 1
        date1 = new Date(date1)
        date2 = new Date(date2)
        if(date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) return 0
        if(date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()) return Math.abs(date1.getDate() - date2.getDate())/365
        if(date1.getFullYear() === date2.getFullYear()) return Math.abs(date1.getMonth() - date2.getMonth())/12
        return 1
    },

    /** @return {function} a resolve function that returns the result, after and updating statistics and perform the @step on the @function_name **/
    monitor: (function_name, step = "start") => {
        if (!utils.monitor.functions) utils.monitor.functions = {}
        if (!utils.monitor.functions[function_name]) utils.monitor.functions[function_name] = {}
        if (step === "start") {
            utils.monitor.functions[function_name].calls = (utils.monitor.functions[function_name].calls || 0) + 1
            utils.monitor.functions[function_name].time = (utils.monitor.functions[function_name].time || 0) - Math.floor(performance.now() * 1000)//Date.now()
        } else if (step === "stop") {
            utils.monitor.functions[function_name].time = utils.monitor.functions[function_name].time + Math.floor(performance.now() * 1000)
            utils.monitor.functions[function_name].time_per_call = parseFloat((utils.monitor.functions[function_name].time / (utils.monitor.functions[function_name].calls ||1 )).toFixed(2))
        }
        return (result) => {
            utils.monitor(function_name, "stop")
            return result
        }
    },

    /** @return {string} the formated percentage of @value over @total **/
    percent: (value, total) => (typeof value !== "number" || typeof total !== "number" || total === 0) ? NaN : value / total < 0.0001 ? "00.00" : value >= total ? (((value * 10000) / total) / 100).toFixed(1) : "" + (((value * 10000) / total) / 100).toFixed(2).padStart(5, "0"),

    /** @return {string} the proper version of @str **/
    proper: (str = null) => str === null ? null : str.split(" ").map((w) => w[0].toUpperCase() + w.substring(1)).join(" ").trim(),

    /** @return {string} a random string of @length from chars of @randomebase || utils.RANDOM_BASE **/
    random: (length = 4, randombase = utils.RANDOM_BASE) => length === 0 ? "" : randombase.charAt(Math.floor(Math.random() * randombase.length)) + utils.random(length - 1, randombase),

    /** @return {string} the current runtime [web, deno, bun, node] **/
    runtime: () => typeof (window) !== "undefined" ? "web" : typeof Deno !== "undefined" ? "deno" : typeof Bun !== "undefined" ? "bun" : "node",

    /** @return {number} the size of @obj **/
    size: (obj) => {
        if(typeof obj === "undefined") return 0
        if(obj === null) return 0
        if(Array.isArray(obj)) return obj.length
        if(typeof obj === "object") return Object.keys(obj).length
        if(typeof obj === "string") return obj.length
        return obj
    },

    /** @return {string} the current time or the @duration in seconds or in hh[s]mm[s]ss, where s = @separator if @hours is true **/
    time: (separator = ":", duration = -1, hours = true) => {
        const time_array = duration === 0 ? ["00", "00", "00"] : duration < 0 ? [String(new Date().getHours() - 1).padStart(2, "0"), String(new Date().getMinutes()).padStart(2, "0"), String(new Date().getSeconds()).padStart(2, "0")] : [String(new Date(duration * 1000).getHours() - 1).padStart(2, "0"), String(new Date(duration * 1000).getMinutes()).padStart(2, "0"), String(new Date(duration * 1000).getSeconds()).padStart(2, "0")]
        if (!hours) time_array.shift()
        return time_array.join(separator)
    },

    /** @return {void} after stalling the runtime during @time milliseconds **/
    wait: (time) => {
        return new Promise(resolve => {
            setTimeout(resolve, time)
        })
    },

    /** @return {boolean} the XOR logical value between @b1 and @b2 */
    xor: (b1, b2) => {
        return (b1 && !b2) || (!b1 && b2)
    }
}

/** emoji to be used in browser or CLI mode */
const emoji = {
    about:              { material: "info",                 unicode: "ℹ"},
    account:            { material: "account_circle",       unicode: "👤"},
    add:                { material: "add",                  unicode: "➕"},
    addTrack:           { material: "playlist_add",         unicode: "➕"},
    album:              { material: "album",                unicode: "💿"},
    analyze:            { material: "genetics",             unicode: "🧬"},
    archive:            { material: "list",                 unicode: "🗄"},
    asset:              { material: "online_prediction",    unicode: "💡"},
    assets:             { material: "lightbulb",            unicode: "💡"},
    audio:              { material: "mic",                  unicode: "🔈"},
    audiovisual:        { material: "",                     unicode: "🎥"},
    balance:            { material: "",                     unicode: "⚖"},
    backlog:            { material: "splitscreen",          unicode: "🗄"},
    book:               { material: "",                     unicode: "📕"},
    build:              { material: "build",                unicode: "🔧"},
    cart:               { material: "shopping_cart",        unicode: "🛒"},
    choregraphy:        { material: "",                     unicode: "🩰"},
    code:               { material: "",                     unicode: "♨"},
    company:            { material: "account_balance",      unicode: "🏛"},
    configure:          { material: "build",                unicode: "🔧"},
    contribute:         { material: "edit",                 unicode: "🖋"},
    data:               { material: "",                     unicode: "🗂"},
    delete:             { material: "delete",               unicode: "🗑"},
    deploy:             { material: "deployed_code_update", unicode: "⚙"},
    dna:                { material: "genetics",             unicode: "🧬"},
    document:           { material: "" ,                    unicode: "📄"},
    done:               { material: "done",                 unicode: "✅"},
    drama:              { material: "",                     unicode: "🎭"},
    edit:               { material: "search",               unicode: "✏"},
    explore:            { material: "",                     unicode: "🔭"},
    expand_content:     { material: "expand_content",       unicode: ""},
    female:             { material: "female",               unicode: "♀"},           
    find:               { material: "search",               unicode: "🔍"},
    font:               { material: "",                     unicode: "🖋"},
    game:               { material: "",                     unicode: "🕹"},
    identifier:         { material: "barcode",              unicode: "🎫"},
    home:               { material: "home",                 unicode: "🏠"},
    identity:           { material: "fingerprint",          unicode: "👤"},
    identities:         { material: "fingerprint",          unicode: "👤"},
    image:              { material: "photo_camera",         unicode: "📷"},
    key:                { material: "",                     unicode: "🔑"},
    lecture:            { material: "",                     unicode: "🎓"},
    legal:              { material: "account_balance",      unicode: "🏛"},
    "legal entity":     { material: "account_balance",      unicode: "🏛"},
    library:            { material: "account_balance",      unicode: "📚"},
    link:               { material: "link",                 unicode: "🔗"},
    male:               { material: "male",                 unicode: "♂"},
    manage:             { material: "show_chart",           unicode: "📈"},
    map:                { material: "",                     unicode: "🗺"},
    money:              { material: "",                     unicode: "💵"},
    movie:              { material: "",                     unicode: "🎬"},
    music:              { material: "music_note",           unicode: "🎵"},
    natural:            { material: "person",               unicode: "👤"},
    "natural person":   { material: "person",               unicode: "👤"},
    newspaper:          { material: "",                     unicode: "📰"},
    other:              { material: "transgender",          unicode: "⚧"},
    painting:           { material: "",                     unicode: "🎨"},
    patent:             { material: "",                     unicode: "🧪"},
    person:             { material: "person",               unicode: "👤"},
    play:               { material: "play_arrow",           unicode: "▶"},
    playlist:           { material: "playlist_play",        unicode: "🗃"},
    playlists:          { material: "queue_music",          unicode: "🗃"},
    player:             { material: "headphones",           unicode: "🎧"},
    poem:               { material: "",                     unicode: "📜"},
    presentation:       { material: "",                     unicode: "🖥"},
    program:            { material: "",                     unicode: "💾"},
    promotion:          { material: "",                     unicode: "📣"},
    queue:              { material: "playlist_add",         unicode: "➕"},
    receipe:            { material: "",                     unicode: "🍛"},
    recording:          { material: "volume_mute",          unicode: "🎙"},
    reference:          { material: "list",                 unicode: "🗂"},
    removeTrack:        { material: "playlist_remove",      unicode: "➖"},
    scan:               { material: "document_scanner",     unicode: "🔍"},
    score:              { material: "",                     unicode: "🎼"},
    search:             { material: "search",               unicode: "🔍"},
    settings:           {material: "settings",              unicode:"⚙"},
    sheet:              { material: "",                     unicode: "📊"},
    smile:              { material: "",                     unicode: "😀"},
    software:           { material: "",                     unicode: "🖥"},
    sort:               { material: "swap_vert",            unicode: ""},
    sound:              { material: "mic",                  unicode: "🎵"},
    stop:               { material: "stop_circle",          unicode: "⏹"},
    success:            { material: "drink",                unicode: "🍺"},
    task:               { material: "task_alt",             unicode: "✔"},
    tasks:              { material: "task_alt",             unicode: "✔"},
    template:           { material: "",                     unicode: "📋"},
    text:               { material: "",                     unicode: "📒"},
    think:              { material: "neurology",            unicode: "💡"},
    trash:              { material: "delete",               unicode: "🗑"},
    "under progress":   { material: "fire",                 unicode: "🔥"},
    unknown:            { material: "help",                 unicode: "❓"},
    user:               { material: "person",               unicode: "👤"},
    video:              { material: "",                     unicode: "🎬"},
    virtual:            { material: "smart_toy",            unicode: "🤖"},
    "virtual identity": { material: "smart_toy",            unicode: "🤖"},
    "application/pdf":  { material: "picture_as_pdf",       unicode: "📄"},
    "image/gif":        { material: "image",                unicode: "📷"},
    "image/jpeg":       { material: "image",                unicode: "📷"},
    "image/png":        { material: "image",                unicode: "📷"},
}

if("undefined" !== typeof window) window.utils = utils
if("undefined" !== typeof window) window.emoji = emoji
if("undefined" !== typeof window) window.Color = Color

export { utils, emoji, Color}