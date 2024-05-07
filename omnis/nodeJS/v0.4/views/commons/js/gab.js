/** global art base **/


var business = {};
var view = {
	works : {
		id: {
			width:10,
			label:"id", 
			getter:function(add) {return add.row;},
			setter:function(add,val,ind) {AUpdateAddress(add,val)},
			type: 'value'
		},
		type: {
			width:25,
			label:"type", 
			getter:function(add) {return ATableToString($Cell(add),'/');},
			setter: undefined, //ASetString,
			type:'value'
		},
		titles: {
			width:25,
			label:"title(s)",
			getter:$Cell,
			setter:function(add,val,ind) {
				var obj = $Get(add);
				obj[ind] = A(val);
				$Set(add,obj);
			},
			type: 'list'
		},
		codes: {
			width:15,
			label:"code(s)", 
			getter:function(add) {
				var obj = $Get(add).codes;
				var arr = [];
				for(var pro in obj) if(obj.hasOwnProperty(pro)) 
					arr.push(A(pro)+'\t'+A(obj[pro]));
				return arr;
				
			}, 
			setter:undefined, //a.setString,
			type: 'list'
		},
		shares: {
			width:25,
			label:"share(s)", 
			getter:$Cell, 
			setter:undefined, //a.setString,
			type: 'list'
		}
	}
}


business.workToRow = function(id) {
	if(!AData.works.hasOwnProperty(id)) return null;
	var work = AData.works[id];
	var row = [];
	row.push(id);
	row.push(ATableToString(work.type));
	row.push(ATableToString(work.titles));
	row.push(AMapToString(work.identifiers));
	row.push(business.sharesToString(work.shares, work.basis));
	return row;
}

business.sharesToString = function(shares,basis) {
	return AMapToString(
		shares,
		function(id) {
			return business.nameToString(id);
		},
		function(value) {
			if(AStringsEqual('100',''+basis)) basis = '%';
			else basis = '/' + basis;
			return A(value.role) + ' ' + A(value.value)+basis;
		});
}

business.nameToString = function(id) {
	if(!AData.names.hasOwnProperty(id)) return id;
	return ATableToString(AData.names[id].values,' ');
}






