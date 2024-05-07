// manages all data handling
// @author sebastien.mamy@gmail.com
//


const helper =      require("./oceans.helper");
const io =          require("./oceans.io");



/** store object */
let store = {}


/**
 * intitializes a json store with a given path
 */
store.init = (params) => {
    store =                 {...store, ...params};
    if(undefined === store.path || !io.fileExists(store.path)) {
        helper.             exception("store path does not exists", params);
        return              null;
    }
    store.path =      store.path + (store.path.endsWith(io.sep) ? "" : io.sep);
    if(!io.fileExists(store.path + "fat.json")) return null;
    if(store.fat)           delete store.fat;
    if(store.index)         delete store.index;
    if(store.labels)        delete store.labels;
    if(store.links)         delete store.links;
    if(store.stats)         delete store.stats;
    store.fat =             JSON.parse(io.readFile(store.path + "fat.json"));
    store.index =           JSON.parse(io.readFile(store.path + "index.json"));
    store.labels =          JSON.parse(io.readFile(store.path + "labels.json"));
    store.links =           JSON.parse(io.readFile(store.path + "links.json"));
    store.stats =           JSON.parse(io.readFile(store.path + "stats.json"));
    store.items =           {};
    return                  store;
}


/**
 * returns an item or null if the item does not exists
 * @return          object
 */
store.get = (id = null) => store.items[id] ?? null;


/**
 * returns the property object
 * @return          object
 */
store.getAll = (id, property = null) => {
    if(!store.exists(id))                   return null;
    return                                  store.items[id][property];
}


/**
 * load an item from the persistance
 * @return          object
 */
store.load = (id = null) => {
    if(id === null) return null;
    let json = JSON.parse(io.readFile(io.path(store.path, store.fat[id])));
    store.items = {...store.items, ...json};
}


/**
 * checks if an item exists, loads it if not
 */
store.exists = (id = null) => {
    if(id === null)                         return false;
    if(store.items[id] === undefined)       store.load(id);
    return                                  store.items[id] !== undefined && store.items[id] !== null;
}


/**
 * return the full path to a item persistance location
 * @return          string
 */
store.getPath = (id = null) => {
    if(id === null)             return null;
    return                      store.path + "data" + io.sep + id.substr(id.length-2, 2) + io.sep + id + ".json";
}


/**
 * return a business view of a given item
 * @return          object
 */
store.getDetails = (id = null) => {
    if(!store.exists(id))                   return {};
    let details =                           {};
    let labels =                            store.get(id, "labels"); 
    for(let label of labels) {
        if(store.models === undefined)       continue;
        details =                           {...store.models[label].details(store, id), ...details};
    }
    if(Object.keys(details).length === 0)   details = store.get(id);
    return                                  details;
}

/**
 * return a business summary of an item
 * @return          object
 */
 store.getSummary = (id = null) => {
    if(!store.exists(id))                   return "n/a";
    let label = store.get(id).__label;
    return label !== null ? store.models[label].summary(store, id) : "n/a";
}


/**
 * returns the incoming item ids of label to the item identified by id
 * @return          array
 */
store.incomings = (id = null, label = null, property = null) => {
    if(store.reverse_links[id] === undefined || store.reverse_links[id] === null)   return [];
    let ids =               [...store.reverse_links[id]?.["?"]];
    let labels =            label !== null ? store.labels[label]["?"] : null;
    ids =                   labels === null ? ids : ids.filter((id_, i) => labels.indexOf(id_) >= 0);
    if(property === null)   return ids;
    if(property !== null)   ids = ids.filter((id_, i) => {
        let props = store.get(id_,"properties", property);
        return props !== null ? props.indexOf(id) >= 0 : false;
    });
    return ids;
}


/// /**
///  * updates a property
///  */
///  Helper.Set = (item = null, property = null, value = null, key = ANONYMOUS_KEY) => {
///     if(item === null || value === null || property === null)                    return null;
///     if(item[property] === undefined)                                            item[property] = {};
///     if(item[property][key] === undefined)                                       item[property][key] = [];
///     if(value !== "" &&!item[property][key].includes(value)                      item[property][key].push(value);
/// }
/// 
/// 
/// /**
///  * get unique array value, or null. Throws an exception if the array contains more than one value
///  */
/// Helper.Unique = (arr = null, errormessage = null) => {
///     if(arr === null || arr.length === 0)        return null;
///     if(arr.length === 1)                        Object.values(arr)[0];
///     Helper.                                     Out(WARNING, $errormessage === null ? "Not Unique: ".JSON.encode(arr) : errormessage);
///     return                                      null;
/// }
/// 
/// 
/// /**
///  * checks if a value is in a given property
///  */
/// Helper.HasValue = (item = null, property = null, value = null, key = null) => {
///     values =        Helper.Get(item, property, key);
///     return          values !== null && values.includes(value);
/// }
/// 
/// 
/// /**
///  * checks if an item is of the passed label
///  */
/// Helper.Is(item = null, label = null) => {
///     return      Helper.HasValue(item, LABELS, label);
/// }
/// 
/// 
/// /**
///  * returns the keys of the item
///  */
/// Helper.Keys = (item = null, property = null) => {
///     if(item === null || property === null)      return null;
///     if(item[property] === undefined)            return null;
///     return                                      Object.keys(item[property]);
/// }


// module / base object
// let Store = 
// {
//     items: {},
//     labels :{},
//     index: {},
//     events: {},
//     path: ""
// }
// 
// 
// Store.Init = (path) => {
//     Store.path = path;
//     Store::$reverse_links =     new Item("__links__");
//     Store::$index =             new Item("__index__");
//     Store::$labels =            new Item("__labels__");
//     if(!file_exists(Store::$path))                                  mkdir(Store::$path);
//     if(!file_exists(Store::$path.DIRECTORY_SEPARATOR."data"))       mkdir(Store::$path.DIRECTORY_SEPARATOR."data");
// }
// 
// /**
//  * read a store
//  */
// Store.Load = (path) => {
//     Store::                                                             Init($path);
// Helper::                                                            AddCall(__FUNCTION__);
// if(!file_exists(Store::$path))                                      throw Exception("store path does not exist: ".$path);
// if(!file_exists(Store::$path.DIRECTORY_SEPARATOR."index.json"))     throw Exception("store index file does not exist: ".$path);
// if(!file_exists(Store::$path.DIRECTORY_SEPARATOR."links.json"))     throw Exception("store reverse links file does not exist: ".$path);
// if(!file_exists(Store::$path.DIRECTORY_SEPARATOR."labels.json"))    throw Exception("store label index does not exist: ".$path);
// Store::$reverse_links =                                            new Item("__links__",   json_decode(file_get_contents(Store::$path.DIRECTORY_SEPARATOR."links.json"), true));
// Store::$index =                                                     new Item("__index__",   json_decode(file_get_contents(Store::$path.DIRECTORY_SEPARATOR."index.json"), true));
// Store::$labels =                                                    new Item("__labels__",  json_decode(file_get_contents(Store::$path.DIRECTORY_SEPARATOR."labels.json"), true))
// }

/**
 * returns an item corresponding to the id
 */
// Store.LoadItem = (id) => {
//     let fullpath =                       path.sep + "data" + path.sep + id.substr(id.strlen() -2,2);
//     
//     if(!fs.existsSync(fullpath))                                     return null;
//     if(!file_exists($fullpath.DIRECTORY_SEPARATOR.$id.".json"))     return null;
//     $json =                                                         json_decode(file_get_contents($fullpath.DIRECTORY_SEPARATOR.$id.".json"), true);
//     $item =                                                         new Item($json[ID], $json);
//     if(Store::$items[$id] !== null)                                 Store::$items[$id] = $item;
//     else                                                            Store::$items[$id] = null;
//     Store::                                                         $statistics["i/o reads"]++;
//     return                                                          $item;        
// }


/// instanciate a new item
/// @return         the newly created item
/// @side-effect    Store.items, Store.labels
///
// Store.New = (labels = [], event = null) => {
//     let item = {
//         id:     Store.NextId(),
//         label:  [...labels]
//     };
//     if(event !== null) item.history = event.id;
//     Store.items[item.id] = item;
//     labels.reduce((_null, label) => {
//         if(Store.labels[label] === undefined) Store.labels[label] = [];
//         if(Store.labels[label].indexOf(item.id) < 0) Store.labels[label].push(item.id)
//     },[]);
//     Store.items[item.id] = item;
//     return item;
// }




/*
/// register a label and creates the related index in the lake
/// @returns        undefined
/// @side-effect    Store.lake
///
Store.Register = (label, properties) =>
{
    if(Store.lake.labels.hasOwnProperty(label))     helper.Error("label already exists", label, properties); 
    Store.lake.index[label] = {};
    Store.lake.labels[label] = properties;
}

Store.Register.__test=
[
    { params: [""],                 result: 2},
]


// register default labels
Store.Register("item",            {id:"", labels:[], status:"", properties:[], history:null});
Store.Register("event",           {id:"", labels:[], status:"", properties:[], dates:[], type: "", source: ""});
Store.Register("user",            {id:"", labels:[], status:"", properties:[], history:null, authentication:"", permissions:[]});
Store.Register("permission",      {id:"", labels:[], status:"", properties:[], history:null});
Store.Register("authentication",  {id:"", labels:[], status:"", properties:[], history:null});
*/
/*
/// create a new item, according to the labels
/// @return     object
///
Store.New = (label = "item", obj = {}) => 
{   
    let result = helper.DeepCopy(Store.lake.labels[label]);
    if(typeof result !== "object") result = helper.DeepCopy(Store.lake.labels.item);
    return {...result, ...obj};
}
*/

/// index an item at the value, in all if name === undefined or in the name index
/// @return         undefined
/// @side-effect    Store.index
///
// Store.Index = (value, id, name = "all") => {   
//     if(value == null) return;
//     if(!Store.index.hasOwnProperty(name)) Store.index[name] = {};
//     if(!Store.index[name].hasOwnProperty(value)) Store.index[name][value] = [];
//     if(Store.index[name][value].indexOf(id) < 0) Store.index[name][value].push(id);
// }
// 
// /// generate a unique id made of namespace:xxxx xxxx xxxx xxxx
// /// @return         string
// /// @side-effect    random
// ///
// Store.NextId = (prefix = "") => {
//     let base = undefined;
//     prefix = prefix.length > 0 ? prefix + " " : prefix;
//     let id = prefix + helper.Random(4,base) + " " + helper.Random(4,base) + " " + helper.Random(4,base) + " " + helper.Random(4,base);
//     while(Store.items.hasOwnProperty(id)) id = prefix + helper.Random(4,base) + " " + helper.Random(4,base) + " " + helper.Random(4,base) + " " + helper.Random(4,base);
//     return id;
// }
// 
// 
// Store.GetPairValues = (pairs, type) => pairs.reduce((values, pair) => pair.key === type ? [...values, pair.value] : values, []);
// 
// 
// Store.Compare = (item1, item2) => {
//     Helper.Log("DEBUG","Compare",item1, item2);
//     let keys = [...Object.keys(item1),...Object.keys(item2)];
//     keys.sort();
//     
//     return keys.reduce((results, key) => {
//         results[key] = {};
//         let i1 = item1[key];
//         let i2 = item2[key];
//         if("undefined" === typeof(i1)) {
//             results[key].type = "addition";
//             results[key].right = Helper.Stringify(i2);
//         } else if("undefined" === typeof(i2)) {
//             results[key].type = "deletion";
//             results[key].left = Helper.Stringify(i1);
//         } else {
//             if(objectHash.sha1(i1) !== objectHash.sha1(i2)) {
//                 results[key].type = "update";
//                 results[key].right = Helper.Stringify(i2);
//                 results[key].left = Helper.Stringify(i1);
//             } else results[key].type = "equals";
//         }
//         return results;
//     },{});
// }
// 
// Store.Filter = (items, label)   => items ? Object.values(items).reduce((results, item) => item.labels && item.labels.indexOf(label) >= 0 ? {...results, [item.id] : item} : results, {}) : {};
// 
// 
// Store.Targets = (items, id)     => {
//     let targets = [];
//     for(let item of Object.values(items)) {
//         let targeting = false;
//         for(let link of item.links)  {
//             targeting = link.value === id;
//             if(targeting) break;            
//         }
//         if(targeting) targets.push(item);
//     }
//     return targets;
// }

/*
Store.New.item = (type = "item", source = null) =>
{
    let event = 
    {
        id: Store.NextId.string("event"),
        labels:       ["create"],
        status:       "active",
        source:       source,
        dates:        [{type:"creation", "value":helper.Date.string("-","US",null, true)}]
    }
    let item = {"history":event.id, id:Store.NextId.string(), labels: [], properties: [], dates: [], source: "", targets: [], status: "active", names: []};
    Store.$Lake.item.push(item);
    Store.$Lake.event.push(event);
    Store.$Lake.index.item[item.id] = item;
    Store.$Lake.index.event[event.id] = event;
    return item;
}
*/


/*
Store.Assign.item = (name, value, item, source = null) =>
{
    // checks if the identifier type exists
    let id = Store.FilterPerName.array(name);
    if(id.length > 1) Helper.Error.void("Duplicate identifier: " + name);
    else if(id.length === 0) 
    {
        id = Store.Create.object("item", source);
        id.labels.push("identifier");
    }
    else id = id[0];


    // checks if this identifier value exist
    let idvalue = Store.FilterPerProperty("value", value, "identify");
    if(idvalue.length > 1) Helper.Error.void("Duplicate identifier value: " + value);
    else if(idvalue.length === 0) {
        idvalue = Store.Create.object("item", source);
    }
    else idvalue = idvalue[0];




    let event = 
    {
        id:         Store.NextId.string("event"),
        labels:     ["create"],
        status:     "active",
        source:     source,
        dates:      [{type:"creation", "value":helper.Date.string("-","US",null, true)}]
    }
    
    let item = {"history":event.id, id:Store.NextId.string(), labels: [], properties: [], dates: [], source: "", targets: [], status: "active", names: []};
    Store.$Lake.item.push(item);
    Store.$Lake.event.push(event);
    Store.$Lake.index.item[item.id] = item;
    Store.$Lake.index.event[event.id] = event;
    return item;
}
*/

/// generate a unique uid for an item like ITEM YEAR XXXX XXXX XXXX
/// @side-effect random
///
/*
Store.UID.string = (type = "Item") =>  
{
    type = type.split(" ").join("").toUpperCase().padEnd(4,"X").substring(0,4);
    let id = (new Date().getFullYear()) + " " + type + " " + helper.Random.string(4) + " " + helper.Random.string(4) + " " + helper.Random.string(4);
    while(Store.$Lake.indexes.items.hasOwnProperty(id)) id = (new Date().getFullYear()) + " " + type + " " + helper.Random.string(4) + " " + helper.Random.string(4) + " " + helper.Random.string(4);
    return id;
}


Store.UID.string.__test=
[
    {params: ["A",1000],            test: (result) => result.indexOf("AXXX") > 0 ? "" : "result should contains AXXX"},
    {params: ["OBJECT",1000],       test: (result) => result.indexOf("OBJE") > 0 ? "" : "result should contains OBJE"},
    {params: ["NODE",1000],         test: (result) => result.indexOf("NODE") > 0 ? "" : "result should contains NODE"},
    {params: ["",0],                test: (result) => result.indexOf("XXXX") > 0 ? "" : "result should contains XXXX"},
    {params: [undefined,1000],      test: (result) => result.indexOf("ITEM") > 0 ? "" : "result should contains ITEM"}
]
*/


/// register a new type to the given model (node or edge)
/// @side-effect Store.$Lake
///
/*
Store.Register = (model) => 
{
    if(!model?.model)                                          return helper.Status.object(500,"model must have a model",               Store.$Lake, model);
    if(!model?.type || !["node","edge"].includes(model.type))  return helper.Status.object(500,"model must have a type [node|edge]",    Store.$Lake, model);
    if(Store.$Lake.models.hasOwnProperty(model.model))         return helper.Status.object(500,"model is already registered",           Store.$Lake, model);
    Store.$Lake.models[model.model] = model;
    return StoreHelper.Status.object(200,"",Store.$Lake);
}

Store.Register.object.__test = 
[
    {params: [null],                        test: (result) => result?.__statuses[0]?.status === 500 ? "" : "result should be in error"},
    {params: [undefined],                   test: (result) => result?.__statuses[0]?.status === 500 ? "" : "result should be in error"},
    {params: [{model:"work"}],              test: (result) => result?.__statuses[0]?.message === "model must have a type [node|edge]" ? "" : "result error message should be 'model must have a type [node|edge]'"},
    {params: [{type:"node",model:"work"}],  test: (result) => result?.__statuses[0]?.status === 200 ? "" : "result should be in status 200"}
]
*/

/// instanciate a new item of the given model, with the provided property values, and returns it
///
/*
Store.New.object = (modelName, properties = {}) => {
    let model = Store.$Lake.models[modelName];
    let item = {id: Store.UID.string(modelName), ...model};
    for(let field in model) 
    {
        switch(Helper.TypeOf.string(model[field])) 
        {
            case "array":
                item[field] = [...model[field]];
                break;
            case "object":
                item[field] = {...model[field]};
                break;
            default:
                item[field] = model[field];
        }
    }
    item = {...item, ...properties};
    Object.keys(item).forEach((field, key) => 
    {
        if(Helper.Size.int(field) > 0) switch(Helper.TypeOf.string(field)) 
        {
            case "pairarray":
                item[key] = field.reduce((result, subitem) => helper.Size.int(subitem) > 0 ? [...result, subitem] : result, []);
            break;
            case "object":
            break;
        }
        if(Helper.Size.int(field) === 0) delete item[key];
    });
    return item;
}

*/

/*
/// adds or updates a item to the graph and updates the related indexes and returns it
/// @side-effect _lake
///
Store.Add = (item) => 
{
    if(!["node","edge"].includes(item.type))                             return helper.Status(500,"item must have a type included in edge | node", item);
    if(!Object.keys(Store.$Lake.models).includes(item.model))            return helper.Status(500,"item must have a model included in " + Object.keys(Helper.$Lake.models), item);
    if(Store.$Lake.indexes.items.hasOwnProperty(item.id))                return helper.Status(500,"duplicate item id",item);
    item.id = (typeof item.id !== "string" || item.id.length === 0) ? Store.UID.string(item.model) : item.id;
    Store.$Lake.data.push(item);
    Store.Index.void(item);
    return helper.Status(200, "",item);
}




/// update _Index with the item (updates _Index.all, _Index[item.model], _Index[item.type])
/// @side-effect _lake
///
Store.Index = (item) => 
{   
    // Store.$Lake.indexes[item.type][item.id] = item;
    // Store.$Lake.indexes.items[item.id] = item;
}
*/


if(typeof module !== "undefined") module.exports = store;