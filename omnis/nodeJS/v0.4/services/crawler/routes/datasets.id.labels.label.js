/**
 * description of the labels/:label route
 */

/** route object */
let route = {};


/** path to the route */
route.path = "/api/v1/datasets/:id/labels/:label";


/** get method */
route.get = {};


/** description of the service */
route.get.summary = "Returns the list of item ids of a given label";


/** parameters of the service */
route.get.parameters = {
    "label" : {
        "name": "label",
        "in": "path",
        "description": "label to look for",
        "required": true,
        "schema": {
            "type": "string"
        }
    }
};

/** 
 * create the service function
 * @returns         function
 */
route.get.function = (server) => {
    return (req, res) => {
        if(undefined === server.stores?.[req.params.id]?.labels?.[req.params.label]) server.sendResponse(res, 404, "/api/v1/labels/:label", "GET", {}, {message: "label " + req.params.label + " does not exists"});
        server.sendResponse(res, 200, route.path, "GET", {params: req.params, item_ids: server.stores[req.params.id].labels[req.params.label]});
    };
}


/** make the module available */
module.exports = route;

