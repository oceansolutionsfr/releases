const helper = require("../../commons/oceans.helper");
/**
 * description of the model of contribution items
 */


/** module */
contribution = {};


/** model */
contribution.model = {};


/** label of the model */
contribution.label =  "contribution";


/** right categories */
contribution.model._category =  {
    "decription":   "values of the share for CAT right category, on base 10000",
    "unique":       false,
    "example":      "MEC: { '05000' : ['FR','IT']}",
    "keys": {
        "*value": {
            "unique":       false,
            "description":  "value of the share for the given territories"
        }
    }
}

/** properties */
contribution.model.properties = {
    "description" : "properties of the contribution",
    "unique":       false,
    "keys": {
        "owner" : {
            "unique":       true,
            "description":  "id of the owner of the contribution"
        },
        "asset" : {
            "unique":       true,
            "description":  "id of the contibution asset"
        },
        "type" : {
            "unique":       true,
            "description":  "type of the contribution"
        },
        "role" : {
            "unique":       true,
            "description":  "role of the owner in the contribution"
        }
    }
}

/** 
 * return a string summary of the item
 */
contribution.summary = (store, id) => store.getSummary(contribution.getOwner(store, id)) + 
    " -> " + store.getSummary(contribution.getAsset(store, id)) + 
    " (" + contribution.getRole(store, id) + ")";


/**
 * returns the owner id
 */
contribution.getOwner = (store, id) => helper.getPreferedValue(store.get(id), "properties", "owner");


/**
 * returns the asset id
 */
contribution.getAsset = (store, id) => helper.getPreferedValue(store.get(id), "properties", "asset");


/**
 * returns the acquirer id
 */
contribution.getRole = (store, id) => helper.getPreferedValue(store.get(id), "properties", "role");



/**
 * returns the detail of an item (business view)
 * @returns         object
 */
 contribution.details = (store, id) => {
    const helper =                  require("../../../lib/oceans.helper");
    let details =                   {};
    let owner_id =                  store.get(id, "properties","owner", {preffered: true});
    let asset_id =                  store.get(id, "properties","asset", {preffered: true});
    helper.                         ifdef(details, store.get(id, "properties","type", {preffered: true}), "type");
    helper.                         ifdef(details, store.get(id, "properties","role", {preffered: true}), "role");
    helper.                         ifdef(details, store.getAll(id, "PER"),"Perf");
    helper.                         ifdef(details, store.getAll(id, "MEC"),"Mech");
    helper.                         ifdef(details, store.getAll(id, "SYN"),"Sync");
    // helper.                         ifdef(details, store.getSummary(owner_id), "name");
    // helper.                         ifdef(details, store.getSummary(asset_id), "title");
    return                          details;
}

/** make available as a module */
module.exports = contribution;

