var ObjectUtil;
ObjectUtil.mergeData = function(orig, dest){
	for(var outer in dest){
		for(var inner in orig){
			if(orig[inner].id == dest[outer].id){
				Object.assign(orig[inner], orig[inner], dest[outer]);
				break;
			}
		}
	}
}

export default ObjectUtil;


