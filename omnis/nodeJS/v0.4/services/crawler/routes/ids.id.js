/**
 * description of the ids/:id route
 */


/** route object */
let route = {};


/** path to the route */
route.path = "/api/v1/ids/:id";


/** get method */
route.get = {};


/** description of the service */
route.get.summary = "Returns the detail of a given item";


/** parameters of the service */
route.get.parameters = {
    "id" : {
        "name": "id",
        "in": "path",
        "description": "id of the item to look for",
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
    const helper = require("../../commons/oceans.helper");
    return (req, res) => {
        let id =                                    req.params.id;
        if(!server.store.exists(id))                server.sendResponse(res, 404, "/api/v1/ids/:id", "GET", {}, {message: "id " + req.params.id + " does not exists"});
        else server.sendResponse(res, 200, "/api/v1/ids/:id", "GET", server.store.getDetails(id));
    };
}

module.exports = route;