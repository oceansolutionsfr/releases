// basic model object
// @author sebastien.mamy@gmail.com
// @since 2019-08-12


var IModel = function() {

    // schemas of the data
    this.model = {}


    // validates an object with regards to the data
    this.Validate = function(params, debug) {
        var __name = "Model.Validate(params, debug)"
        Helper.Debug({"name":__name,"params":params,"instance":this},debug)
        Helper.Assert(params.schema !== undefined && params.object !== undefined, {"name": __name, "message" : "wrong parameters"})
        
    }

}



class Validator {
    
    static Date(date) {
        // TODO
        return true
    }
}

class Model {

    constructor() {

    }

    Validate(instance) {
        for(const [key, field] in instance) {

        }
    }
}


// field to be used by data elements
// 
class Field {

    constructor(value, source = "antipod", previous = null) {
        // link to the previous version of the field
        this.previous = previous

         // source of the data
        this.source = source

        // date of modification
        this.since = Helper.GetCurrentDate("")

        // value 
        this.value = value
    }

    duplicate() {
        var obj = new Field(this.value, this.source, this.previous)
    }

    get value() {return this.value}
    
    setValue(value, source = "antipod") {
        var prev = this.duplicate()
        this.previous = prev
        this.value = value
        this.source = source
    }


}


// manage fields that have multiple unique values (as an array)
var MutliValue = function() {
    
    // internal values
    this.values = [];

        
	// add a value to the list
    // @param {string} v value to add to the list
	this.Add = function(v) {
        if(Helper.IsEmpty(v)) return;
        if(!this.values.includes(v)) {
            this.values.push(v);
        }
    }

    
    // transform the object into a string
    // @return {string} a string representation of the list
	this.ToString = function() {
        var out = '';
        if(Helper.IsEmpty(this.values) || this.values.length < 1) return '';
        for(var i = 0 ; i < this.values.length - 1; i++) out += this.values[i] + '|';
        out += this.values[this.values.length - 1];
        return out;	
    }
}





// class for typed list: array of (type, value)
var TypedList = function() {

    // multiple value flag
    this.multiplevalue = true;

    
    // array of entries (type, value)    
    this._entries = [];

    
    // iterates over the list elements
    // @param {function} callback function to call for each (type, value)
    this.ForEach = function(callback) {
        this._entries.forEach(function(entry) {callback(entry);});
    }


    // checks if the list has an instance of type 
    // @param {string} type to look for
    // @return {boolean} true if the list contains at least one entry of type
    //
    this.ContainsType = function(ty) {
        return this.CountType(ty) > 0;
    }

	
    // checks if the list contains the value
    // @param {string} value to look for
    // @return {boolean} true if the list contains at least one entry of value
    //
    this.ContainsValue = function(va) {
        if(Helper.IsEmpty(va)) return true;
        for(var id in this._entries) if(Helper.StringsEqual(this._entries[id].value,va,false)) return true;
        return false;
    }


    // returns the number of element of type 
    // @param {string} type to look for
    // @return {int} number of entries of type t
    //
    this.CountType = function(t) { 
        var count = 0;
        if(Helper.IsEmpty(t)) return 0;
        if(Helper.GetType(t) !== 'string') {
            console.log("t is not string", t);
            t = "" + t;
        }
        for(var i in this._entries) if(t.toLowerCase() === this._entries[i].type.toLowerCase()) count++;
        return count;
    }


    // checks if type, value is not already present 
    // @param {object} o (type, value) entry to look for
    // @return {boolean} true if the list contains at least one entry of value
    //
    this.Contains = function(o) { 
        for(var i in this._entries) if(Helper.StringsEqual(o.type, this._entries[i].type) && Helper.StringsEqual(o.value, this._entries[i].value)) return true;
        return false; 
    }


    // gets the index of the object, -1 if the object is not in the list
    // @param {object} o (type, value) entry to look for
    // @return {int} index in the array of entries
    //
    this.GetIndex = function(o) {
        for(var i in this._entries) if(this._entries[i].type === o.type && this._entries[i].value === o.value) return i;
        return -1;
    }


    // add an object 
    // @param {object} o(type, value) entry to add
    //
    this.Add = function(t, v) {
        var o = v === undefined ? t : {type: t, value: v};
        var count = this.CountType(o.type);
        Helper.Assert(count === 0 || (count > 0 && this.multiplevalue), `TypedList.Add: duplicate type: ${o.type}` );    
        if(this.GetIndex(o) == -1 || this.multiplevalue) this._entries.push(o);
    }


    // removes all the entries of type 
    //  @param {string} type type to remove
    //
    this.RemoveType = function(type) {
        for (var i = this._entries.length - 1; i >= 0; i--) {
            if(this._entries[i].type === type) this._entries.splice(i, 1);
        }
    }

	
    // counts the number of elements 
    // @return {int} size of the list in number of entries
    //
    this.Size = function() {
        return this._entries.length;
    }


    // returns the element at index i
    // @param {int} i index of the element to get
    // @return {object} value of the element at index i, undefined if i is out of range
    //
    this.Get = function(i) {
        if(this.Size() <= i) return undefined;
        return this._entries[i];
    }
    
    
    // sets the element at index i
    // @param {object} o element to set
    // @param {int} i index of the element to set
    //
    this.Set = function(o, i) {
        if(this.Size() <= i) return null;
        if(o === undefined) return null;
        this._entries[i] = o;
    }
    
    
    // update the value with the current value 
    // @param {string} type type to look for
    // @param {string} value value to update to
    //
    this.UpdateValue = function(type, value) {
        var pos = this.GetTypeIndex(type);
        Helper.Assert(pos != -1, 'TypedList.UpdateValue: cannot update a value');
        this._entries[pos].value = value;
    }


    // gets the unique element 
    // @param {string} type type to look for
    // @return {string} the value of the looked type, undefined if not found
    this.GetValue = function(type) {
        var values = this.GetValues(type);
        if(Helper.Size(values) > 1) {
            console.log(values);
            Helper.Assert(Helper.Size(values) > 1, 'TypedList.GetValue: cannot return, not a single value');
        }
        return Helper.IsEmpty(values) ? undefined : values[0];
    }


    // gets all the value of type
    // @param {string} type type to look for
    // @return {array} the values of the looked type, undefined if not found
    this.GetValues = function(type) {
        var values = [];
        for(var id in this._entries) if(this._entries[id].type === type) values.push(this._entries[id].value);
        return values;
    }
    
    
    // returns the indexes of the values matching the values
    // @param {array} f fields to use for matching
    // @param {array} v values to look for
    // @parak {boolean} a specifies if the matching is exclusive (true) or inclusive (false). default: exclusive
    // @return {array} array of the ids of the matching value
    //
    this.GetMatchingIds = function(f, v, a) {
        var a = Helper.Init(a, true);
        Helper.Assert(f.length == v.length, "this.GetMatchingIds, wrong parameters");
        var o = [];
        if(a) {
            for(var i in this._entries) {
                var e = this._entries[i], inc = true;                
                for(var j in f) if(e[f[j]] === undefined || e[f[j]] !== v[j]) {inc = false;break;}
                if(inc && !o.includes(i)) o.push(i);
            }             
        } else {
            for(var i in this._entries) {
                var e = this._entries[i], inc = false;
                for(var j in f) if(e[f[j]] !== undefined && e[f[j]] === v[j]) {inc = true;break;}
                if(inc && !o.includes(i)) o.push(i);
            }            
        }           
        return o;
    }

    
    // returns the elements of the matching values
    // @param {array} f fields to use for matching
    // @param {array} v values to look for
    // @parak {boolean} a specifies if the matching is exclusive (true) or inclusive (false). default: exclusive
    // @return {array} array of the ids of the matching value
    //
    this.GetMatchingEntries = function(f, v, a) {
        var a = Helper.Init(a, true);
        Helper.Assert(f.length == v.length, "this.GetMatchingIds, wrong parameters");
        var o = [];
        if(a) {
            for(var i in this._entries) {
                var e = this._entries[i], inc = true;                
                for(var j in f) if(e[f[j]] === undefined || e[f[j]] !== v[j]) {inc = false;break;}
                if(inc && !o.includes(i)) o.push(e);
            }             
        } else {
            for(var i in this._entries) {
                var e = this._entries[i], inc = false;
                for(var j in f) if(e[f[j]] !== undefined && e[f[j]] === v[j]) {inc = true;break;}
                if(inc && !o.includes(i)) o.push(e);
            }            
        }           
        return o;
    }

}

// provide object templates for Library model
// @author sebastien.mamy@gmail.com
// @since 2019-12-31
//

/*
// internal variables
var _sequence = 0


// wrapper for Items
// @model { key: string}
var Item = {}

// instanciate a new Item
// @param {string} key the id of the object to use
// @return {Item} the created instance
//
Item.new = function(key) {
    return {'key': key === undefined ? _sequence++ : key}
}
*/

// wrapper for data handling
// @model { items: {}, sorted: boolean, property : string, sortedItems: []}

class Collection {

    constructor($items = {}) {
        this.items = $items
        this.index = Object.keys(this.items)
        this.sortedBy = null
        this.mNextKey = 0
    }
    

    get nextKey() {
        var _find = true
        while(_find) {
            if(this.items.hasOwnProperty("__" + this.mNextKey)) this.mNextKey++
            else _find = false
        }
        return "__" + this.mNextKey
    }

    // returns the item keys, sorted 
    //
    get keys() {
        this.sort()
        return this.index
    }

    // returns the item values, sorted 
    //
    get values() {
        this.sort()
        var _out = []
        this.forEach(function($item) { _out.push($item)})
        return _out
    }

    push($item) {
        Helper.TestEmpty($item)
        if($item.key === undefined) $item.key = this.nextKey
        if(this.items[$item.key] === undefined) this.index.push($item.key)
        this.items[$item.key] = $item
        this.sortedBy = null 
    }
    
    get($key) {
        Helper.TestEmpty($key)
        return this.items[$key]
    }

    getByIndex($index) {
        Helper.TestEmpty($index)
        if(this.sortedBy === null) this.sort()
        return this.index[$index]
    }


    getIndex($item) {
        Helper.TestEmpty($item)
        if(this.sortedBy === null) this.sort()
        return this.index.indexOf($item.key)
    }

    sort($property = "key", $reverse = false) {
        if($property === undefined && this.sortedBy === null) this.sortedBy = "key"
        else if($property === undefined || $property === this.sortedBy) return
        this.index = Object.keys(this.items)
        this.index.sort(
            function($item1, $item2) {
                var _direction = $reverse ? -1 : 1
                if($item1[$property] < $item2[$property]) return - _direction;
                else if($item1[$property] > $item2[$property]) return _direction;
                else return 0
            }
        )
        this.sortedBy = $property
    }
    
    
    
    // return the size of the set
    // @return {number} number of defined element in the set
    //
    get length () {
        return Object.keys(this.items).length
    }
    

    getAll() {
        return this.items
    }

    forEach($steps) {
        var _self = this
        _self.keys.forEach(function($key) {
            $steps(_self.get($key)) 
        })
    }

    static cast($collection) {
        var _collection = new Collection($collection.items)
        _collection.sort($collection.sortedBy)
        return _collection
    }
}

/*
var Set = {}


// instanciate a new Set
// @param {string} key the id of the object to use
// @return {Set} the created instance
//
Set.new = function(key) {
    var set = Item.new(key)
    set.items = {}
    set.sortedItems = []
    return set
}

// returns the item identified by the key
// @param {Set} set set to get the item from
// @param {string} key id of the item to look for
// @returns {Item} the identified item
//
Set.getnew = function(set, key) {
    if(Set.get(set,key) === undefined) return Set.new(key)
    return Set.get(set,key)
}

// add an item to a set
// @param {Set} set set to add the item to
// @param {Item} item item to add to the set
//
Set.push = function(set, item) {
    set.items = set.items === undefined ? {} : set.items
    set.sortedItems = set.sortedItems === undefined ? [] : set.sortedItems
    if(set.items[item.key] === undefined) {
        set.items[item.key] = item
        set.sortedItems.push(item)
        set.sorted = false
    }    
}


// returns the item identified by the key
// @param {Set} set set to get the item from
// @param {string} key id of the item to look for
// @returns {Item} the identified item
//
Set.get = function(set, key) {
    return set.items !== undefined ? set.items[key] : undefined
}


// returns the item at the index position
// @param {Set} set set to get the item from
// @param {int} index index of the item to look for
// @returns {Item} the identified item
//
Set.getByIndex = function(set, index) {
    if(!set.sorted) Set.sort(set)
    return set.sortedItems[index]
}


// sort the items according to the parameters
// @param {Set} set set to add the item to
// @param {string} (optional) property property to use to sort the items. default is 'key'
// @param {boolean} reverse (optional) set the direction of the sort. default is false
//
Set.sort = function(set, property = "key", reverse = false) {
    if(set.sorted) return 
    set.sortedItems.sort(
        function(item1, item2) {
            var direction = reverse ? -1 : 1
            if(item1[property] < item2[property]) return - direction;
            else if(item1[property] > item2[property]) return direction;
            else return 0
        }
    )
    set.sorted = true
    set.property = property
}


// returns the items, sorted by property
// @param {Set} set set to add the item to
// @param {string} (optional) property property to use to sort the items. default is 'key'
// @param {boolean} reverse (optional) set the direction of the sort. default is false
// @returns {array} sorted items
//
Set.getSortedItems = function(set, property, reverse) {
    if(set === undefined || set === null) return []
    if(!set.sorted || property !== set.property) Set.sort(set, property, reverse)
    return set.sortedItems
} 


// return the size of the set
// @return {number} number of defined element in the set
//
Set.length = function(set) {
    return set === null || set.items === undefined ?  0 : Object.keys(set.items).length
}

*/

var module = module === undefined ? null : module
if(module !== null) module.exports = {
   // "Item" : Item,
   //  "Set" : Set,
    "TypedList": TypedList,
    "Field" : Field,
    "Validator" : Validator,
    "Collection" : Collection
}
