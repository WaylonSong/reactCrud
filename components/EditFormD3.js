import React, {
	Component,
	PropTypes
} from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';
import EditForm from './EditForm';
import {SimpleRow} from './EditableRow';

class EditFormD3 extends EditForm {
	dataWrap(){
		let nameValueArray = $("form").serializeArray();	
		var result = {};
		var groupList = [];
		
		for(var item in nameValueArray) {
			if(nameValueArray[item].name == "生产组人数"||nameValueArray[item].name == "质量组人数"){
				var groupItem = {};
				groupItem["num"] = nameValueArray[item].value;
				groupItem["category"] = nameValueArray[item].name.substr(0,3);
				groupList.push(groupItem);
			}else
				result[nameValueArray[item].name] = nameValueArray[item].value;
		}
		if(groupList){
			result["groupList"] = groupList;
		}
		if(result["bacteria"]){
			result["bacteria"] = "1";
		}else
			result["bacteria"] = "0";

		return result;
	}
}
export default EditFormD3;