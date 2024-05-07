// data for the views
// @creator sebastien.mamy@gmail.com
// @since 20191206
//





// filter for ux controls
//
const Filters = {
    "Date" : {
        check: function(value) {
            return value.length === 10 && value.charAt(2) === '/' && value.charAt(5) === '/'
        },
        format: function(value) {
            if(value === undefined || value.length === 0) return value
            if(value.length === 2 && (value.charAt(1) === '/' || value.charAt(1) === '-')) value = "0" + value.charAt(0) + "/"
            else if((value.length === 1 || value.length === 2) && isNaN(parseInt(value.charAt(value.length - 1), 10))) value = value.substring(0,value.length - 1)
            else if(value.length === 3 && (value.charAt(2) === '/' || value.charAt(2) === '-')) value = value.substring(0,2) + "/"
            else if(value.length === 3) value = value.substring(0,2) + "/" + value.charAt(2)
            else if(value.length === 5 && (value.charAt(4) === '/' || value.charAt(4) === '-')) value = value.substring(0,3) + "0" + value.charAt(3) + "/"
            else if((value.length === 4 || value.length === 5)  && isNaN(parseInt(value.charAt(value.length - 1), 10))) value = value.substring(0,value.length - 1)
            else if(value.length === 6 && (value.charAt(5) === '/' || value.charAt(5) === '-')) value = value.substring(0,5) + "/"
            else if(value.length === 6) value = value.substring(0,5) + "/" + value.charAt(5)
            else if(value.length <= 10 && isNaN(parseInt(value.charAt(value.length - 1), 10))) value = value.substring(0,value.length - 1)
            else value = value.substring(0,10)
            return value;
        }
    },
    "Location" : function(value) {
        return value;
    }
}



// references used
//
const References = {
	"entityType"      : {"natural person": {"icon":"person"}, "group": {"icon":"group"}, "fictional": {"icon":"person_pin"}, "legal entity": {"icon":"apartment"} },
    "productType"     : {"musical work": {"icon":""}, "sound recording": {"icon":""}, "album" : {"icon":""}},
    "role"            : ["composer", "author", "main artist", "producer", "publisher", "arranger", "instrumentist"],
    "identifier"      : ["ISNI", "IPNN", "IPBN", "IPN", "ISWC", "ISRC", "ISAN", "BOWI"],
    "countries"       : ["Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antarctica","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas (the)","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia (Plurinational State of)","Bonaire, Sint Eustatius and Saba","Bosnia and Herzegovina","Botswana","Bouvet Island","Brazil","British Indian Ocean Territory (the)","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Cayman Islands (the)","Central African Republic (the)","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands (the)","Colombia","Comoros (the)","Congo (the Democratic Republic of the)","Congo (the)","Cook Islands (the)","Costa Rica","Croatia","Cuba","Curaçao","Cyprus","Czechia","Côte d'Ivoire","Denmark","Djibouti","Dominica","Dominican Republic (the)","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Falkland Islands (the) [Malvinas]","Faroe Islands (the)","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories (the)","Gabon","Gambia (the)","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and McDonald Islands","Holy See (the)","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran (Islamic Republic of)","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Korea (the Democratic People's Republic of)","Korea (the Republic of)","Kuwait","Kyrgyzstan","Lao People's Democratic Republic (the)","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macao","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands (the)","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia (Federated States of)","Moldova (the Republic of)","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands (the)","New Caledonia","New Zealand","Nicaragua","Niger (the)","Nigeria","Niue","Norfolk Island","North Macedonia","Northern Mariana Islands (the)","Norway","Oman","Pakistan","Palau","Palestine, State of","Panama","Papua New Guinea","Paraguay","Peru","Philippines (the)","Pitcairn","Poland","Portugal","Puerto Rico","Qatar","Romania","Russian Federation (the)","Rwanda","Réunion","Saint Barthélemy","Saint Helena, Ascension and Tristan da Cunha","Saint Kitts and Nevis","Saint Lucia","Saint Martin (French part)","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Sint Maarten (Dutch part)","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the South Sandwich Islands","South Sudan","Spain","Sri Lanka","Sudan (the)","Suriname","Svalbard and Jan Mayen","Sweden","Switzerland","Syrian Arab Republic (the)","Taiwan (Province of China)","Tajikistan","Tanzania, the United Republic of","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands (the)","Tuvalu","Uganda","Ukraine","United Arab Emirates (the)","United Kingdom of Great Britain and Northern Ireland (the)","United States Minor Outlying Islands (the)","United States of America (the)","Uruguay","Uzbekistan","Vanuatu","Venezuela (Bolivarian Republic of)","Viet Nam","Virgin Islands (British)","Virgin Islands (U.S.)","Wallis and Futuna","Western Sahara*","Yemen","Zambia","Zimbabwe","Åland Islands"]
}


// model to use
//
const Model = {
	"contribution" : {
		"work"           : { "type" : "object", "model"  : "product" },
        "name"           : { "type" : "object", "model"  : "name"    },
        "role"           : { "type" : "text", "source" : "role"    }
	},

	"product" : {
		"title"          : { "type" : "text" },
        "variants"       : { "type" : "map" },
		"creationClass"  : { "type" : "text", "source" : "productType" },
        "identifiers"    : { "type" : "map", "model"  : "identifier" },
        "dateOfCreation" : { "type" : "text" },
        "relations"      : { "type" : "map", "model"  : "product" }
	},

	"name" : {
		"firstName"      : { "type" : "text" },
		"lastName"       : { "type" : "text" },
		"fullName"       : { "type" : "text" },
        "variants"       : { "type" : "map" },
        "identifiers"    : { "type" : "object" , "model": "identifier" }
	},

	"identifier" : {
        "name"           : { "type" : "text", "source" : "identifier" },
        "value"          : { "type" : "text"}
    },

    "entity" : {
    	"patronym"       : { "type" : "object", "model" : "name" },
    	"type"		     : { "type" : "text", "source" : "entityType" }, 
    	"birthDate"      : { "type" : "text" },
        "birthPlace"     : { "type" : "text" },
        "birthCountry"   : { "type" : "text", "source" : References.countries },
        "deathDate"      : { "type" : "text" },
        "deathPlace"     : { "type" : "text" },
        "citizenship"    : { "type" : "map",  "source": References.countries},
        "pseudonyms"     : { "type" : "map",  "model" : "name"},
    	"identifiers"    : { "type" : "map",  "model" : "identifier"},
    	"contributions"  : { 
            "type" : "map",  
            "model" : "contribution"
        }
    }
}



// template for the views
//
const Templates = {
    "entity-type" : {
        "id": "entity-type",
        set      : function(instance, value) {instance.type = value},
        get      : function(instance) {return instance.type},
        "model" : "entity",
        "type"   : "choice",
        "label"  : "Register",
        "hint"   : "To start, select which type of entity you wish to register:",
        "source" : References["entityType"]        
    },


    "patronym" : {
        "id": "patronym",
        "type"  : "object",
        "hint" : "Key in your official patronym:",
        "binding" : "patronym",
        "fields": {
            "firstName": { 
                "id": "firstName",
                set : function(instance, value) {__GetObject(instance, "patronym", "name").firstName = value}, 
                get : function(instance) { return __GetObject(instance, "patronym", "name").firstName},
                "type": "input",  
                "label" : "First Name", 
                "editable"  : true,
                "mandatory" : true,
                condition : function(instance) { return instance.type === "natural person"}
            },
            "lastName": { 
                "id": "lastName",
                set : function(instance, value) {__GetObject(instance, "patronym", "name").lastName = value}, 
                get : function(instance) { return __GetObject(instance, "patronym", "name").lastName},
                "type": "input",  
                "label" : "Last Name", 
                "editable"  : true,
                "mandatory" : true ,
                condition : function(instance) { return instance.type === "natural person"}               
            },
            "fullName": { 
                "id": "fullName",
                set : function(instance, value) {__GetObject(instance, "patronym", "name").fullName = value}, 
                get : function(instance) { return __GetObject(instance, "patronym", "name").fullName},
                "type": "input",  
                "label" : "Full Name", 
                "editable"  : true,
                "mandatory" : true ,
                condition : function(instance) { return instance.type !== "natural person"}               
            },
            "separator": {},
            "variants" : {
                "id": "variants",
                get : function(instance) {return __GetArray(__GetObject(instance, "patronym"), "variants")},
                set : function(instance, value) {__GetArray(__GetObject(instance, "patronym"), "variants").push(value) }, 
                drop: function(instance, index) {__Drop(instance.patronym.variants, index)},
                up :  function(instance, index) {__Up(instance.patronym.variants, index)},
                "type": "array",
                "label": "Patronym Variants",
                "editable" : true,
                "mandatory" : false
            }
        }
    },


    "birth" : {
        "id" : "birth",
        "type"  : "object",
        "hint"  : "Enter your birth information: ", 
        "fields": {
            "birthDate":  { 
                "id": "birthDate",
                get : function(instance) {return __GetValue(instance,"birthDate")},
                set : function(instance, value) {__SetValue(instance,"birthDate", value)},
                "type": "input",  
                "label" : "Date Of Birth",
                "editable": true,
                "mandatory" : true,
                "filter": Filters.Date,
                condition : function(instance) { return true}
            },
            "birthPlace": {  
                "id": "birthPlace",
                get : function(instance) {return __GetValue(instance,"birthPlace")},
                set : function(instance, value) {__SetValue(instance,"birthPlace", value)},
                "type": "input",  
                "label" : "Place Of Birth",
                "editable": true,
                "mandatory" : true,
                condition : function(instance) { return true}                
            },
            "birthCountry": {
                "id": "birthCountry",
                get : function(instance) {return __GetValue(instance,"birthCountry")},
                set : function(instance, value) { __SetValue(instance,"birthCountry", value)},
                "type": "select",
                "label": "Country of Birth",
                "editable" : true,
                "source" : References.countries,
                "mandatory" : true,
                condition : function(instance) { return true}                
            }
        }
    },


    "pseudonym" : {
        "id": "pseudonym",
        add : function(instance) { var p = NewObject("name"); __GetObject(instance,"pseudonyms")[p._id] = p },
        drop : function(instance, id) { DropObject(id); delete instance.pseudonyms[id]},
        getCollection : function(instance) { return __GetObject(instance,"pseudonyms")},
        "type" : "collection",
        "hint"  : "You can register one or several peudonyms:", 
        "binding" : "pseudonyms",
        "fields" : {
            "fullName": { 
                "id": "fullName",
                set : function(instance, value, id) { __SetValue(instance.pseudonyms[id], "fullName", value) }, 
                get : function(instance, id) { return __GetValue(instance.pseudonyms[id], "fullName")},
                "type": "input",  
                "label" : "Pseudonym", 
                "editable"  : true,
                "mandatory" : true,
                condition : function(instance) { return true}                
            },
            "variants" : {
                "id": "variants",
                get : function(instance, id) {return __GetArray(instance.pseudonyms[id], "variants")},
                set : function(instance, value, id) {__GetArray(instance.pseudonyms[id], "variants").push(value) }, 
                drop :function(instance, index, id) {__Drop(instance.pseudonyms[id].variants, index)},
                up : function(instance, index, id) {__Up(instance.pseudonyms[id].variants, index)},
                "type": "array",
                "label": "Patronym Variants",
                "editable" : true,
                "mandatory" : false,
                condition : function(instance) { return true}                
            }
        }
    },

    "entity-confirm" : {
        "id": "entity-confirm",
        "type"  : "object",
        "hint"  : "Please Confirm the information below ", 
        "fields": {
            "type" : {
                "id" : "type",
                get: function(instance) { return __GetValue(instance, "type")},
                "type": "value",  
                "label" : "Type",
                condition : function(instance) { return true} 
            },
            "s1" : {},
            "firstName" : {
                "id" : "firstName",
                get: function(instance) { return __GetValue(instance.patronym, "firstName")},
                "type": "value",  
                "label" : "First Name",
                condition : function(instance) { return instance.type === "natural person"}                
            },
            "lastName":  { 
                "id" : "lastName",
                get : function(instance) {return __GetValue(instance.patronym,"lastName")},
                "type": "value",  
                "label" : "Last Name",
                condition : function(instance) { return instance.type === "natural person"}  
            },
            "fullName":  { 
                "id" : "fullName",
                get : function(instance) {return __GetValue(instance.patronym,"fullName")},
                "type": "value",  
                "label" : "Full Name",
                condition : function(instance) { return instance.type !== "natural person"}  
            },
            "patronymVariants": {
                "id" : "patronymVariants",
                get : function(instance) {return __GetValue(instance.patronym,"variants")},
                "type": "value",
                "label": "Patronym Variants",
                condition : function(instance) { return __GetValue(instance.patronym,"variants") !== undefined && __GetValue(instance.patronym,"variants").length > 0}               
            },
            "s2": {},
            "birthDate": {  
                "id" : "birthDate",
                get : function(instance) {return __GetValue(instance,"birthDate")},
                "type": "value",  
                "label" : "Place Of Birth",
                condition : function(instance) { return true}     
            },
            "birthPlace": {  
                "id" : "birthPlace",
                get : function(instance) {return __GetValue(instance,"birthPlace")},
                "type": "value",  
                "label" : "Place Of Birth",
                condition : function(instance) { return true}     
            },
            "birthCountry": {
                "id" : "birthCountry",
                get : function(instance) {return __GetValue(instance,"birthCountry")},
                "type": "value",
                "label": "Country of Birth",
                condition : function(instance) { return true}               
            },
            "s3": {
            },
            "pseudonyms": {
                "id" : "pseudonyms",
                "type" : "valuecollection",
                "label" : "Pseudonyms",
                getCollection : function(instance) {return instance.pseudonyms},
                get : function(instance, key, sfield) { return __GetValue(instance.pseudonyms[key], sfield) },
                "fields" : {
                    "fullName" : { "id": "fullName", "label": ""},
                    "variants" : {"id":"variants", "label": "Pseudonym Variants"}
                },
                condition : function(instance) { return true}
            }
        }   
    }
}

__GetValue = function(o, f) {
    var out = ""
    if(typeof o[f] === 'object') {
        for(var i in o[f]) out += ", " + o[f][i] 
        out = out.substring(2)
    }
    else out = o[f]
    return out
}

__SetValue = function(o, f, v) {
    o[f] = v
}

__GetObject = function(o, f, model) {
    if(o[f] === undefined && model === undefined) o[f] = {}
    else if(o[f] === undefined && model !== undefined) o[f] = NewObject(model)
     
    return o[f]
}

__GetArray = function(o, f) {
    if(o[f] === undefined) o[f] = []
    return o[f]
}

__Drop = function(o, i) {
    Helper.ArrayRemove(o, i)
}

__Up = function(o, i) {
    var tmp = o[i - 1]
    o[i - 1] = o[i]
    o[i] = tmp
}

// description of the workflows
const Flows = {
    "entity-flow" : {
        "model" : "entity",
        "steps" : [
            {
                "template" : "entity-type",
                "onStart"  : function(obj) {},
                "onEnd"    : function(obj) {},
                "showNav"  : false
            },
            {
                "template" : "patronym",
                "onStart"  : function(obj) {},
                "onEnd"    : function(obj) {},
                "previous" : null,
                "next"     : 2,
                "showNav"  : true
            },
            {
                "template" : "birth",
                "onStart"  : function(obj) {},
                "onEnd"    : function(obj) {},
                "previous" : 2,
                "next"     : 4,
                "showNav"  : true
            },
            {
                "template" : "pseudonym",
                "onStart"  : function(obj) {},
                "onEnd"    : function(obj) {},
                "previous" : 3,
                "next"     : 5,
                "showNav"  : true
            },
            {
                "template" : "entity-confirm",
                "onStart"  : function(obj) {},
                "onEnd"    : function(obj) {},
                "showNav"  : true,
                "previous" : 4,
                "onSubmit"    : function(instance) {

                }
            },
        ]
    }

}


// dataset
//
var Data = {}

// indexes per instance types
//
var Index = {}

// initializations
var __sequence = 0
for(var k in Model) Index[k] = {}


// returns the next sequence value
// @return the incremented sequence value
//
function GetNextId() { 
    __sequence++ 
    return __sequence
}


// creates a new object according to the model, assign an id, update the data set and the indexes
// @param {object} model model to use for the creation of the new object
// @return the created object
//
var NewObject = function(model) {
    var o = {}
    o._model = model
    o._id = GetNextId()
    Helper.Assert(!Data.hasOwnProperty(o._id), "inconsistend data set: duplicate index key")
    Index[model][o._id] = o
    Data[o._id] = o
    return o
}


// drops an object from the data and the indexes
// @param {string} id identifier of the object to remove
//
function DropObject(id) {
    delete Index[Data[id]._model][id]
    delete Data[id]
}


