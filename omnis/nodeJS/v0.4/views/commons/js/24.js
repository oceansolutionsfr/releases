// translation data and methods
// antipod 2019

'use strict'

if(Translation === undefined) var Translation = {};

var __language = "EN";
var __REFERENCE = "@";
var __DEFAULT = "default";
var __SEPARATOR = "::";

Translation.languages = ["EN","FR"];

var __references = {
    "EN" : {
        "EN" : "English",
        "FR" : "Anglais"
    },
    "FR" : {
        "EN" : "French",
        "FR" : "Fran\u00E7ais"
    }
}

var __dictionnaries = {
    "default" : {
        "id" : __DEFAULT
    }
}

// add a dictionnary to the current one 
Translation.addDictionnary = function(dictionnary) {
    Helper.Assert(!IsEmpty(dictionnary), "empty dictionnary");
    Helper.Assert(!__dictionnaries.hasOwnProperty(dictionnary), "existing dictionnary");
    Helper.Assert(!IsEmpty(dictionnary.id), "wrong dictionnary format");
    __dictionnaries[dictionnary.id] = dictionnary; 
}

// translate the given label in the current language, in the dictionnary
Translation.translate = function(label,dictionnary) {
    if(Helper.IsEmpty(label)) return label;
    if(__references.hasOwnProperty(label)) return __references[label][__language];
    if(Helper.IsEmpty(dictionnary)) dictionnary = __DEFAULT;
    var index = label.startsWith(__REFERENCE) ? label : label.toUpperCase().hashCode();
    if(!__dictionnaries[dictionnary].hasOwnProperty(index)) __dictionnaries[dictionnary][index]={};
    var out = __dictionnaries[dictionnary][index][__language];
    return Helper.IsEmpty(out) ? Helper.Clean(label) : out;
}

// create a dictionnary for translating labels
Translation.getDictionnary = function(dictionnary) {
    if(Helper.IsEmpty(dictionnary)) return __dictionnaries.default;
    if(!__dictionnaries.hasOwnProperty(dictionnary)) __dictionnaries[dictionnary] = { "id" : dictionnary};
    return __dictionnaries[dictionnary];
}

Translation.add = function(enLabel, language, label, dictionnary) {
    Helper.Assert(!Helper.IsEmpty(enLabel), "empty EN label");
    Helper.Assert(Helper.IsEmpty(dictionnary) || __dictionnaries.hasOwnProperty(dictionnary),"unknown dictionnary")
    Helper.Assert(!Helper.IsEmpty(language) && Translation.languages.includes(language) && !IsEmpty(label), "empty translation");
    if(Helper.IsEmpty(language)) return;
    if(Helper.IsEmpty(dictionnary)) dictionnary = __DEFAULT;
    var index = Helper.Clean(enLabel).startsWith(__REFERENCE) ? A.enLabel : enLabel.toUpperCase().hashCode();
    if(!__dictionnaries[dictionnary].hasOwnProperty(index)) __dictionnaries[dictionnary][index] = {};
    __dictionnaries[dictionnary][index][language] = label;     
} 

Translation.insert = function(descriptor, dictionnary) {
    if(Helper.IsEmpty(dictionnary)) dictionnary = __DEFAULT;
    Helper.Assert(__dictionnaries.hasOwnProperty(dictionnary),"unknown dictionnary");
    if(typeof descriptor == 'string') Translation.__insert(descriptor, dictionnary);
    else if(Array.isArray(descriptor)) for(var id in descriptor) Translation.__insert(descriptor[id], dictionnary);
    else Helper.Assert(false,"descriptor wrongly formated");
}

Translation.__insert = function(descriptor, dictionnary) {
    var fields = descriptor.split(__SEPARATOR);
    var index = fields[0];
    if(!__dictionnaries[dictionnary].hasOwnProperty(index)) __dictionnaries[dictionnary][index]={};
    for(var i = 1; i < fields.length - 1; i=i+2) {
        var lang = fields[i];
        var value = fields[i+1];
        if(!Translation.languages.includes(lang)) Warning("unknown language: " + lang);
        else __dictionnaries[dictionnary][index][lang]=value;
    }
}


Translation.setLanguage = function(language) {
    if(Translation.languages.includes(language)) __language = language;
    //else Warning("unknown language: " + language);
}

