

/** compnent **/
function a() {}


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

 
/** prepare and quote a csv field **/
a.PrepareField = function(value) { return a.IsNotEmpty(value) ? a.CSVQuote(value) : ""; };


/** creates a string that is made of "count" time the string "value" **/
a.Multiply = function(value, count) {	var out = [];	for(i = 0; i < count; i++) out[i] = value; return out;};


/** parse a url to get the parameters **/
a.ParseURL = function(url) { return url.search.replace('?','').split('&').reduce( function(s,c) { var t=c.split('='); s[t[0]]=t[1]; return s; },{}); };

