/**
 * description of the labels/ route
 */

/** route object */
let route = {};


/** path to the route */
route.path = "/api/v1/datasets/:id/labels/";


/** get method */
route.get = {};


/** description of the service */
route.get.summary = "Returns the list of existing labels of a given dataset";


/** 
 * create the service function
 * @returns         function
 */
route.get.function = (server) => {
    return function (req, res) {  
        let id = req.params.id;      
        const helper = require("../../commons/oceans.helper");


        /*
        let results = Object.entries(server.stores[id].labels).reduce((results, entry) => {
            let [label, value] =    entry;
            if(label === "id")      return results;
            results[label] = {item_count: value.length};
            return results;
        }, {});*/
        let labels = server.stores[id].labels;
        let json = Object.entries(server.stores[id].labels).reduce((accumulator, entry) => 
            entry[0] !== "id" ? {...accumulator, [entry[0]] : entry[1].reduce((label_detail, item_id) => ({...label_detail, [item_id]: server.stores[id].getSummary(item_id)}), {})} : accumulator, {});
        // helper.log("INFO",server.stores[id].labels);
        server.sendResponse(res, 200, "/api/v1/labels/", "GET",json);
    };
}

/** make the module available */
module.exports = route;
