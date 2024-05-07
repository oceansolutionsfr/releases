/**
 * description of the model of asset items
 */

const helper =                  require("../../commons/oceans.helper");
    

/** module */
asset = {};


/** model */
asset.model = {};


/** label of the model */
asset.label =  "asset";


/** titles of the assets */
asset.model.title =  {
    "description" : "titles of the asset, index with the title type, when available",
    "unique":       false
}


/** properties of the asset */
asset.model.properties = {
    "description" : "properties of the asset",
    "unique":       false,
    "keys": {
        "creation class" : {
            "unique":       true,
            "description":  "creation class of the asset"
        }
    }
}


/** 
 * return a string summary of the item 
 */
asset.summary = (store, id)    => asset.getTitle(store, id) ?? "unknown";


/**
 * returns the title of the asset
 */
asset.getTitle = (store, id) => helper.getPreferedValue(store.get(id), "titles");



/**
 * returns the detail of an item (business view)
 * @returns         object
 */
 asset.details = (store, id) => {
    let details =                               {"shares": [], "identifiers": {}, "links": [], "titles": store.getAll(id, "titles")};
    let item =                                  store.get(id);
    for(let prop in item) {
        if(prop.startsWith("@")) {
            details.links.push({
                summary :       store.getSummary(prop),
                "id item":      prop,
                labels:         store.get(prop, "labels"),
                "link type":    item[prop]?.["link type"]

            });    
        } else if(prop.toLowerCase().includes(" title")) details[prop] = item[prop];
    }
    for(let prop in item.properties) details[prop] = store.get(id, "properties", prop, {preffered: true});
    if(store.getSummary(id) !== "unknown")      details.title = store.getSummary(id);
    let shares =                                store.incomings(id, "contribution");
    for(let share_id of shares)                 details.shares.push(store.getDetails(share_id));
    let identifiers =                           store.incomings(id, "identifier");
    for(let id_id of identifiers)               details.identifiers[store.get(id_id,"properties","type",{preffered: true})] = store.getSummary(id_id);
    if(helper.size(details.shares) <= 0)        delete details.shares;
    if(helper.size(details.identifiers) <= 0)   delete details.identifiers;
    if(helper.size(details.links) <= 0)         delete details.links;
    return                                      details;
}


/** make available as a module */
module.exports = asset;