/**
 * description of the labels/ route
 */

const store = require("../../commons/oceans.store");

/** route object */
let route = {};


/** path to the route */
route.path = "/api/v1/datasets/";


/** get method */
route.get = {};


/** description of the service */
route.get.summary = "list the available store";


/** 
 * create the service function
 * @returns         function
 */
route.get.function = (server) => {
    const helper = require("../../commons/oceans.helper");
    return (req, res) => {
        server.                             init({root_path: server.root_path, store_path: server.store_path});
        let stats = {};
        for(let store_id in server.stores) stats[store_id] = {"id": store_id, "stats": server.stores[store_id].stats};
        server.sendResponse(res, 200, "/api/v1/datasets/", "GET", stats);
    };
}

module.exports = route;