const helper = require("../../commons/oceans.helper");

/**
 {
     "id":"@6093bebd28000",
     "labels":{"?":["assignment"]},
     "properties":{
         "assignor":["@6093bebd0ec5f"],
         "assignee":["@6093bebb69e20"],
         "creation class":["music"],
         "line in file":[131,362,379,840,1426,1804,1848,2025,2057,2437,2454],
         "type":["agreement"],
         "catalogue":["@6093bebd07fd0","@6093bebfb1b1e","@6093bebfd632f","@6093bec28f2a8","@6093bec4a4dfb","@6093bec59e740","@6093bec5bad47","@6093bec637efe","@6093bec648810", "@6093bec73e4c7","@6093bec746dff"]
        },
    "register":true
}
 */


/**
 * description of the model of assignment items
 */


/** module */
assignment = {};


/** model */
assignment.model = {};


/** label of the model */
assignment.label =  "assignment";


/** 
 * return a string summary of the item 
 */
assignment.summary = (store, id) => store.getSummary(assignment.getAssignor(store,id)) + " -> "+store.getSummary(assignment.getAcquirer(store,id)) + ": " + assignment.getType(store,id);


/**
 * returns the assignor id
 */
assignment.getAssignor = (store, id) => helper.getPreferedValue(store.get(id), "properties", "assignor");


/**
 * returns the assignor id
 */
assignment.getType = (store, id) => helper.getPreferedValue(store.get(id), "properties", "type");


/**
 * returns the acquirer id
 */
assignment.getAcquirer = (store, id) => helper.getPreferedValue(store.get(id), "properties", "acquierer");



/**
 * returns the detail of an item (business view)
 * @returns         object
 */
 assignment.details = (store, id) => ({
     id: id,
     assignor:          store.get(id,"properties","assignor",{preffered:true}),
     assignee:          store.get(id,"properties","assignee",{preffered:true}),
     type:              store.get(id,"properties","type", {preffered:true}),
     "creation class":  store.get(id,"properties","creation class", {preffered:true}),
     catalogue:         store.get(id,"properties","catalogue")
});

         

/** make available as a module */
module.exports = assignment;