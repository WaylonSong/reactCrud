import React, {
	Component,
	PropTypes
} from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';
import {EditFormD2, EditFormD3} from './EditFormDepartment';
import {TypeValuePairRow, SimpleRow} from '../components/EditableRow';

class TaskDtoD3 extends EditFormD3 {
	constructor(props) {
		super(props);
		this.state = {
			data : null,
			modalShow : false,
        	redirectFlag: false,
		};
	}

	componentDidMount(){
		$.ajax({
		    type: "get",
		    dataType: 'json',
		    url: this.props.url,
		    success: function(data){
		    	var formInit = ObjectUtil.dataToArray(data);
				ObjectUtil.mergeData(formInit, this.props.formExtend);
				this.setState({data: formInit, modalMethod:"alert", modalShow: false, modalMessage: "操作成功"});
				if(this.props.dataRetrieved)
					this.props.dataRetrieved(data.state);
		    }.bind(this),
		    error: function(data){
		        that.setState({ modalShow: false, modalMethod:"alert", modalMessage: "操作失败"});
		    }
		});
	}

	genRows(data){
		var that = this;
		return data.map(function(row){
			if(row.name == "groupList"){
				var group = [];
				var index;
				for(index in row.value){
					var item = row.value[index];
					group.push(<SimpleRow ref={item.category} readOnly={true} value={item.num} alias={item.category+"人数"}/> );
				}
				return group;
			}
			else if(row.name == "bacteria"){
				if(row.value == 0 || row.value == '0'){
					row.value = "无";
				}else if(row.value == 1 || row.value == '1'){
					row.value = "有";
				}
				delete row["type"];
			}
    		return <SimpleRow ref={row.name} readOnly={true}  {...row}/> 
    	});
	}
	//defaut add / modify
	genButtons(){
		// if("button" in this.props && this.props.button == "none")
		// 	return;
		// return (
		// 	<Button onClick={() => {this.fireGenExperts()}}
		// 		bsStyle="primary" style={{marginTop:"10px"}} disabled={this.state.genButtonDisabled}>生成专家列表</Button>
		// 	);
	}

	confirm(){
		this.setState({ modalShow: false, genButtonDisabled:"true"});
		if(this.state.modalMethod == "fireGenExperts")
			this.fireGenExperts();
	}

	fireGenExperts(){
		this.setState({genButtonDisabled:"true"});
		var ev = document.createEvent('HTMLEvents');
		ev.initEvent('genExperts', false, false);
		document.dispatchEvent(ev);
	}
}


class TaskDtoD2 extends TaskDtoD3{
	genRows(data){
		var that = this;
		var rows = [];
		for(var key in data){
			if(data[key].name == "bacteria"){
				;
			}else if(data[key].value.constructor == Array){
				rows.push(<TypeValuePairRow ref={data[key].name} {...data[key]}/>);
			}else{
				rows.push(<SimpleRow ref={data[key].name} readOnly="true" {...data[key]}/>);
			}
		}
		return rows;
	}
}
export {TaskDtoD3, TaskDtoD2};

