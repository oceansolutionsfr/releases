const helper = require("../../commons/oceans.helper")

/**
 * description of the model of identity items
 */


/** module */
identity = {};


/** model */
identity.model = {};


/** label of the model */
identity.label =  "identity";


/** names  */
identity.model.name =  {
    "unique":       false,
    "example":      "name: { 'PA' : ['Michael Jackson','Jackson, Michael Joe']}",
    "decription":   "names of the identity, with name type as a key, when avalaible",
    "keys": {
        "?": {
            "unique":       false,
            "description":  "default name"
        },
        "PA": {
            "unique":       false,
            "description":  "patronym"
        },
        "PP": {
            "unique":       false,
            "description":  "pseudonym"
        }
    }
}

/** properties  */
identity.model.properties = {
    "description" : "properties of the identity",
    "unique":       false,
    "keys": {
        "type" : {
            "unique":       false,
            "description":  "type of the identity (publisher, natural person, etc..)"
        }
    }
}

/** 
 * return a string summary of the item 
 */
 identity.summary = (store, id)    => identity.getName(store, id) ?? "unknown";

/**
 * returns the name of the identity
 */
identity.getName = (store, id) => helper.getPreferedValue(store.get(id), "names");



/**
 * returns the detail of an item (business view)
 * @returns         object
 */
 identity.details = (store, id) => {
    const helper =                  require("../../../lib/oceans.helper");
    let details =                   {"name": store.getSummary(id), "names": store.getAll(id,"names"), "contributions": [], "identifiers":[], "assignments" : [] };
    helper.                         ifdef(details, store.get(id, "properties","type", {preffered: true}), "type");
    let contributions =             store.incomings(id, "contribution","owner") ?? [];
    for(let c_id of contributions)  details.contributions.push(store.getSummary(store.get(c_id, "properties", "asset", {preffered:true})) + " (" + store.get(c_id, "properties","role", {preffered: true}) + "): "+c_id);
    let ass =                       store.incomings(id, "assignment", "assignee") ?? [];
    ass =                           [...ass, ...store.incomings(id, "assignment", "assignor") ?? []];
    for(let a_id of ass)            details.assignments.push(store.getSummary(a_id) + " (" + a_id + ")");
    let identifiers =               store.incomings(id, "identifier", "target");
    for(let id_id of identifiers)   details.identifiers[store.get(id_id,"properties","type",{preffered: true})] = store.get(id_id,"properties","values");
    if(details.contributions.length === 0) delete details.contributions;
    if(details.identifiers.length === 0) delete details.identifiers;
    if(details.assignments.length === 0) delete details.assignments;
    return                          details; 
}

/** make available as a module */
module.exports = identity;
