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

ObjectUtil.fillFormInit = function(data, form){
	var formInit = form;
	for(var row in formInit){
		if(formInit[row].name == "selectGroup"){
			for(var i = 0 ; i < formInit[row].selectGroup.length; i++){
				formInit[row].selectGroup[i]["value"] = data[formInit[row].selectGroup[i]["name"]];
			}
		}else
			formInit[row]["value"] = data[formInit[row].name];
	}
	return formInit;
}



ObjectUtil.getQueryString = function(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  decodeURI(r[2]); return null;
}


ObjectUtil.isReferrerWithinDomain = function(){
	var fromUrl = document.referrer;
	if(fromUrl){
		fromUrl = fromUrl.slice(7);
		var getUrl = fromUrl.split('/');
		var referrerDomain = getUrl[0];
		referrerDomain = referrerDomain.split(":")[0];
		if(referrerDomain == document.domain)
			return true;
		return false;
	}
	return false;
}

ObjectUtil.redirectOrGoBack = function(url){
	if(ObjectUtil.isReferrerWithinDomain()){
		window.location = document.referrer+"#"+ObjectUtil.getQueryString("pn");
	}else{
		window.location = url;
	}
}

window.ObjectUtil = ObjectUtil;
export default ObjectUtil;


