/**
 * description of the labels/ route
 */

const store = require("../../commons/oceans.store");

/** route object */
let route = {};


/** path to the route */
route.path = "/api/v1/datasets/:id";


/** get method */
route.get = {};


/** description of the service */
route.get.summary = "loads a store and attach it to the server";


/** parameters of the service */
route.get.parameters = {
    "id" : {
        "name": "id",
        "in": "path",
        "description": "id of the store to load",
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
        if(!server.stores[id])                      server.sendResponse(res, 404, "/api/v1/datasets/:id", "GET", {}, {message: "id " + req.params.id + " does not exists"});
        let path =                                  server.stores[id]["path"];
        server.store =                              store.init({store_path: path, model: server.models});
        server.sendResponse(res, 200, "/api/v1/datasets/:id", "GET", { "id": id, ...server.store.stats});
    };
}

module.exports = route;