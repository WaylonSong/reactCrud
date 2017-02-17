var DateUtil = {};
DateUtil.checkDateTime = function(str="", pattern = "yyyy-mm-dd hh:mm:ss") {
	if(pattern == "yyyy-mm-dd hh:mm:ss"){
		var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
		var r = str.match(reg);
		if (r == null) return false;
		r[2] = r[2] - 1;
		var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
		if (d.getFullYear() != r[1]) return false;
		if (d.getMonth() != r[2]) return false;
		if (d.getDate() != r[3]) return false;
		if (d.getHours() != r[4]) return false;
		if (d.getMinutes() != r[5]) return false;
		if (d.getSeconds() != r[6]) return false;
		return true;
	}else if(pattern == "yyyy-mm-dd"){
		var reg = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
		var r = str.match(reg);
		if (r == null) return false;
		r[2] = r[2] - 1;
		var d = new Date(r[1], r[2], r[3]);
		if (d.getFullYear() != r[1]) return false;
		if (d.getMonth() != r[2]) return false;
		if (d.getDate() != r[3]) return false;
		return true;
	}
	
}

export default DateUtil;
