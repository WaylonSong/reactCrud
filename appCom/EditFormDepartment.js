import React, {
	Component,
	PropTypes
} from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal, Checkbox} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';
import DateUtil from '../util/DateUtil';
import EditForm from '../components/EditForm';
import {SelectAddableRow, SimpleRow} from '../components/EditableRow';

class EditFormD2 extends EditForm {

	genRows(data){
		var that = this;
		return data.map(function(row){
			if(row.group){
				return <SelectAddableRow ref={row.name} {...row} selector={that.props.selector[row.group]}/>
			}
    		return <SimpleRow ref={row.name} {...row}/> 
    	});
	}
}

class EditFormD3 extends EditForm {
	dataWrap(){
		// let nameValueArray = $("form").serializeArray();	
		// var result = {};
		var groupList = [];
		var result = super.dataWrap();
		
		for(var item in result) {
			if(item == "生产组人数"||item == "质量组人数"){
				var groupItem = {};
				groupItem["num"] = result[item];
				groupItem["category"] = item.substr(0,3);
				groupList.push(groupItem);
				delete result[item];
			}
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
export {EditFormD2, EditFormD3};