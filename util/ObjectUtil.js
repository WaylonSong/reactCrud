var ObjectUtil = {};
ObjectUtil.mergeData = function(orig, dest){
	for(var outer in dest){
		for(var inner in orig){
			if(orig[inner].name == dest[outer].name){
				Object.assign(orig[inner], orig[inner], dest[outer]);
				break;
			}
		}
	}
}


ObjectUtil.dataToArray = function(obj){
	var result = [];
	for(var i in obj){
		var item = {};
		item["name"] = i;
		item["value"] = obj[i];
		result.push(item);
	}
	return result;
}


export default ObjectUtil;


