import React, {
	Component,
	PropTypes
} from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal, Checkbox} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';
import EditForm from './EditForm';
import DateUtil from '../util/DateUtil';
import {SelectAddableRow, SimpleRow} from './EditableRow';

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
export default EditFormD2;