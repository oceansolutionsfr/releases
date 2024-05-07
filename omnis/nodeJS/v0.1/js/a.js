


/** list of application constants **/
var INFO = 1;
var WARNING = 2;
var ERROR = 3;
var NONE = 4;

/** compnent **/
function a() {}


/** log level **/
a.level = INFO;


/** log a message with the type **/
a.Log = function(message, type)  { console.log("<" + type + " " + a.CurrentDate()+ ">" + message); }


/** log a message as an info **/
a.Info = function(message) { if(a.level <= INFO) a.Log(message, 'INFO'); }


/** log a message as an warning **/
a.Warning = function(message) { if(a.level <= WARNING) a.Log(message, 'WARNING'); }


/** log a message as an error **/
a.Error = function(message) { if(a.level <= ERROR) a.Log(message, 'ERROR'); }


/** log an object and a message with the given level **/
a.LogObject = function(message, level, object) {if(level != INFO && level != WARNING && level != ERROR) a.Error("c.LogObject(): unknown log level: " + level);switch(level) {case INFO:a.Info(message);break;case WARNING:a.Warning(message);break;case ERROR:a.Error(message);break;default:break;}console.log(object);}


/** return a json stream from an url **/
a.GetSynchronizedJson = function(url) {$.ajaxSetup({'async': false});return jQuery.parseJSON($.getJSON(url).responseText);}


/** get json and launch the callback function **/
a.GetJson = function(url, callback) {	$.getJSON( url, function(data) {callback(data);});} 


/** create a array of object from a HTML DOM table **/
a.ExtractData = function(table) { var elements = []; $("table#" + table + " tr").each(function() { var element = []; var tableData = $(this).find('td'); if (tableData.length > 0) { tableData.each(function() { element.push($(this).text()); }); elements.push(element);}});return elements;}


/** fill a DOM table with the provided data [[],[]] **/
a.RenderTable = function(table, data, title) { if(a.not_empty(title)) $('#' + table).append("<TR CLASS='sheader'><TD COLSPAN='2' ALIGN='center'>" + title.toUpperCase() + "</TD></TR>");	for(var i in data) {var element = data[i];$('#' + table).append("<TR><TD>" + element[0] + "</TD><TD>" + element[1] + "</TD></TR>");}}


/* create a data table. data is an array of array */
a.RenderDataTable = function(table, data, header) { var renderedtable = $('#' + table).DataTable( { dom: 'fBrti', deferRender: true,scroller: true,	data: data,	scrollY: 500,	buttons: [{	extend: 'csvHtml5',	text: 'get Connect format',	fieldSeparator: '\t',	filename: 'wipo-connect-right-owners'	}],	columns : header.columns,	columnDefs:  header.conf,	destroy: true }); return renderedtable;}


/** create a drop zone with the name and the function to be run on complete **/
a.RenderDropzone = function(name, box_message, oncomplete) {	$('#'+name).append("<form action='#' id='dz" + name + "' class='dropzone dz-clickable'><div class='dz-message' data-dz-message>" + box_message + "</div></form>");	Dropzone.options["dz"+name] = {thumbnailWidth: 10,thumbnailHeight: 10,init: function() {this.on("complete", function(file) {onload(file, name);this.removeAllFiles();this.removeEventListeners();});}};}

/** checks if a period is valid **/
a.IsValidPeriod = function(s, e) { if(a.IsEmpty(s) || a.IsEmpty(e)) return true; else return parseInt(s) <= parseInt(e); }

/** checks if to periods overlaps **/
a.DatesOverlap = function(s1, e1, s2, e2) {
	
	if(a.IsEmpty(s1) && a.IsEmpty(s2)) return true;
	if(a.IsEmpty(e1) && a.IsEmpty(e2)) return true;
	
	if(a.sEmpty(s1)) { 
		if(a.IsEmpty(e1)) return true;
		else return parseInt(e1) < parseInt(s2);
	}	else if(a.IsEmpty(s2)) { 
		if(a.IsEmpty(e2)) return true;
		else return parseInt(e2) < parseInt(s1);
	}	else { // s1 and s2 not empty
		if(a.IsEmpty(e1)) {
			
		} else if(a.IsEmpty(e2)) {
			
		} else {
			
		}
	}
	
	
	//parseInt
}


/** merge table2 in table 1 **/
a.MergeArrays = function(table1,table2){return Array.prototype.push.apply(table1, table2);}


/** quote a string and double the " **/
a.CSVQuote = function(input) {var out=a.clean(input);if(a.IsNotEmpty(out)){out=out.toString().replace(/"/g, '\"\"');out=out.toString().replace(/\t/g, ' ');out="\"" + out + "\"";}return out;};


/** clean a string **/
a.Clean = function(token) {	if(a.IsNotEmpty(token)) return a.IsNotEmpty(token) ? (a.IsString(token) ? token.trim() : token) : null;	else return "";};
    

/** test if a object is empty **/
a.IsNotEmpty = function(value) { if(value === null) return false;	if(value === undefined) return false;	if(value.length === 0) return false;	if(a.IsString(value)) {		if(value.trim().length === 0) return false;		if(value.toLowerCase() === "null") return false;	}	return true};


/** return true if value is empty **/
a.IsEmpty = function(value) {return !a.IsNotEmpty(value); }

 
/** prepare and quote a csv field **/
a.PrepareField = function(value) { return a.IsNotEmpty(value) ? a.CSVQuote(value) : ""; };


/** creates a string that is made of "count" time the string "value" **/
a.Multiply = function(value, count) {	var out = [];	for(i = 0; i < count; i++) out[i] = value; return out;};


/** format the date to YYYYMMDD **/
a.FormatDate = function(date, format) {	if(a.IsEmpty(format)) a.Error("a.FormatDate = function(date, format): empty format"); else if(format != "US" && format != "FR") a.Error("a.FormatDate = function(date, format): unknown format " + format);else if(a.not_empty(date)) {if(a.IsString(date)) date = date.trim();if(date.length === 10) {if(a.Equals("US", format)) return date.substring(0,4) + date.substring(5,7) + date.substring(8);else if(a.Equals("FR", format)) return date.substring(6) + date.substring(3,5) + date.substring(0,2);	}	else if("null" !== date) return date;	}	return "";}


/** format the number on size digit **/
a.FormatNumber = function(value, size) { var out = ""; for(i = 0; i < size; i++) out += "0"; out += a.clean(value); return out.substring(out.length - size, out.length);}


/** test if a variable is of type String **/ 
a.IsString = function(value) {	return typeof value === 'string'; }


/** test if the value is a date in YYYYMMDD format **/
a.IsDate = function(value) {	if(a.IsEmpty(value)) return false;	if(a.IsNumber(value)) return ((""+value).length === 8);	return false; }


/** test if the value is a number **/
a.IsNumber = function(value) { return !isNaN(value); }


/** compares 2 strings **/
a.Equals = function (string1, string2)  { if(a.IsNotEmpty(string1) && a.IsNotEmpty(string2)) return string1 === string2; else if(a.IsNotEmpty(string1)) return false; else if(a.IsNotEmpty(string2)) return false; return true; }


/** create an array filled with value **/
a.CreateArray = function(size, value) {	var a = [];	for(i = 0; i < size; i++) a[i] = value;	return a; }


/** returns the current date as from the locale **/
a.CurrentDate = function() { return (new Date()).toLocaleDateString(); }


/** returns the number of fields of an object **/
a.CountFields = function(object) { return Object.keys(object).length; }


/** checks if a value is contained in an array **/
a.ArrayContains = function(value, table) {	return ($.inArray(value, table)!== -1);}


/** parse a url to get the parameters **/
a.ParseURL = function(url) { return url.search.replace('?','').split('&').reduce( function(s,c) { var t=c.split('='); s[t[0]]=t[1]; return s; },{}); };

