/**
 * description of the model of identifier items
 */

const helper =                  require("../../commons/oceans.helper");

/** module */
identifier = {};


/** model */
identifier.model = {};


/** label of the model */
identifier.label =  "identifier";


/** properties */
identifier.model.properties = {
    "description" : "properties",
    "unique":       false,
    "keys": {
        "type" : {
            "unique":       true,
            "description":  "type of the identifier"
        },
        "value" : {
            "unique":       true,
            "description":  "value of the identifier"
        },
        "target" : {
            "unique":       true,
            "description":  "target of the identifier"
        }
    }
}


/** 
 * return a string summary of the item 
 * @returns         string
 */
identifier.summary = (store, id)    => identifier.getType(store, id) + ": " + identifier.getValue(store, id);


 /**
 * returns the value
 */
identifier.getValue = (store, id) => helper.getPreferedValue(store.get(id), "properties", "value");


/**
 * returns the type
 */
identifier.getType = (store, id) => helper.getPreferedValue(store.get(id), "properties", "type");


/**
 * returns the detail of an item (business view)
 * @returns         object
 */
 identifier.details = (store, id) => ({
     id : id,
     type :     store.get(id, "properties", "type", {preffered: true}),
     value:     store.get(id, "properties", "value", {preffered: true}),
     target:    store.get(id, "properties", "target", {preffered: true})
 })


/** make available as a module */
module.exports = identifier;