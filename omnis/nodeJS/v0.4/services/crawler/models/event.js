/**
 * description of the model of asset items
 */

const helper =                  require("../../commons/oceans.helper");
    

/** module */
event = {};


/** model */
event.model = {};


/** label of the model */
event.label =  "event";


/** titles of the assets */
event.model.title =  {
    "description" : "titles of the asset, index with the title type, when available",
    "unique":       false
}

/** properties of the asset */
event.model.properties = {
    "description" : "properties of the asset",
    "unique":       false,
    "keys": {
        "source" : {
            "unique":       true,
            "description":  "source that triggered the event"
        },
        "timestamp" : {
            "unique":       true,
            "description":  "timestamp when the event occured"
        },
        "type" : {
            "unique":       true,
            "description":  "type of the event"
        }
    }
}


/** 
 * return a string summary of the item 
 * @returns         string
 */
 event.summary = (store, id)    => {
    return store.get(id, "type", "*", {preffered: true}) ?? "unknown";
 }


/**
 * returns the detail of an item (business view)
 * @returns         object
 */
 event.details = (store, id) => ({
        "source":       store.get(id, "properties", "source", {preffered: true}),
        "timestamp":    store.get(id, "properties", "timestamp", {preffered: true}),
        "type":         store.get(id, "properties", "type", {preffered: true})
    });


/** make available as a module */
module.exports = event;