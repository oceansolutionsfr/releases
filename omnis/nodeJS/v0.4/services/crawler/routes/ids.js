/**
 * description of the ids/ route
 */


/** route object */
let route = {};


/** path to the route */
route.path = "/api/v1/ids";


/** get method */
route.get = {};


/** description of the service */
route.get.summary = "Returns the list of existing ids, with corresponding labels";


/** 
 * create the service function
 * @returns         function
 */
route.get.function = (server) => {
    const helper = require("../../commons/oceans.helper");
    return function (req, res) {
        let results = Object.entries(server.store.labels).reduce((results, entry) => {
            let [label, value] =    entry;
            if(label === "id")      return results;
            for(let id of value["?"])   helper.addvalue(results, label, id);
            return results;
        }, {});
        server.sendResponse(res, 200, "/api/v1/ids/", "GET",results);
    };
}


module.exports = route;

