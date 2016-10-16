import React, {
	Component,
	PropTypes
} from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal, Checkbox} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';
import DateUtil from '../util/DateUtil';

class SimpleRow extends Component {
    constructor(props) {
        super(props);
        this.result = {};
        var data = {name:this.props.name, value:this.props.value, validateState:"unknown"};
        this.state = {
        	"data" : data
        };
    }
    componentDidMount(){
    	var data = {name:this.props.name, value:this.props.value, validateState:"unknown"};
    }

    validate(){
    	var data2 = this.state.data;
    	if(data2.validateState == "error")
    		return false;
		if(data2.validateState == "unknown"){
			var validateResult = this.validateAndSetState(data2);
	    	return data2.validateState != "error"
		}
		return true;
    }

    changeValue(event){
    	var data2 = this.state.data;
    	data2["value"] = event.target.value;
    	this.validateAndSetState(data2);
    }

    onCheck(event){
    	var data2 = this.state.data;
    	data2["value"] = event.target.checked;
    	this.setState({
    		"data" : data2
    	});
    }

    validateAndSetState(data2){
    	var validateResult = this.validateByValue(data2.value);
    	Object.assign(data2, validateResult);
    	this.setState({
    		"data" : data2
    	});
    	return validateResult;
    }

    validateByValue(value){
    	if(!this.props.validator)
    		return true;
		var properties = {
    		"errorMessage" :"",
    		"validateState" : ""
    	};
    	if(this.props.validator.notNull == true){
    		if($.trim(value)===""){
				properties["validateState"] = 'error';
    			properties["errorMessage"] = '字段不能为空';
    		}
    	}
    	
    	if(this.props.validator.dataType){
    		switch(this.props.validator.dataType){
    			case "number":
    				if((!value=="")&&!$.isNumeric(value)){
    					properties["validateState"] = 'error';
    					properties["errorMessage"] = '请填写数字';
    				}
    				break;
    			case "email":
    				var reg = /.*@.+\..+/;
    				if((!value=="")&&!reg.test(value)){
						properties["validateState"] = 'error';
						properties["errorMessage"] = '请填写正确邮箱格式';
    				}
    				break;
    			case "mobile":
    				if(!$.isNumeric(value) || value.length!=11){
    					properties["validateState"] = 'error';
    					properties["errorMessage"] = '请填写正确的手机号码';
    				}
    				break;
    			case "time":
    				if(!DateUtil.checkDateTime(value, this.props.validator.pattern)){
    					properties["validateState"] = 'error';
    					properties["errorMessage"] = '请填写正确时间类型，例如:2016-01-01 09:30:00';
    				}

    		
    		}
    	}
    	var minLength,maxLength;
    	if(minLength = this.props.validator.minLength){
    		if(value && value.length < minLength){
				properties["validateState"] = 'error';
    			properties["errorMessage"] = '字段最小长度应大于'+minLength;
    		}
    	}
    	if(maxLength = this.props.validator.maxLength){
    		if(value && value.length > maxLength){
				properties["validateState"] = 'error';
    			properties["errorMessage"] = '字段最大长度不能大于'+maxLength;
    		}
    	}
    	properties["value"] = value;
    	return properties;
    	
    }

    getResult(){
    	var result = {};
    	result[this.state.data.name] = this.state.data.value;
    	return result;
    }

    render() {
    	var type = this.props.type;
    	var propsExt = {
    		placeholder : this.props.placeholder,
    		defaultValue : this.props.value,
    		name : this.props.name,
    		type : type,
    		style: {marginTop:"5px"}
    	};
	    var options;
		var style = {overflow: "hidden", margin: "10px 0" }
		var hidden = "";
	    if(type){
			switch (type) {
				case "delete":
					return null;
					break;
				case "textArea":
				case "textarea":
					propsExt["componentClass"] = "textarea";
					break;
				case "checkbox":
					propsExt = {};				
					propsExt["componentClass"] = "checkbox";
					var checked = [];
					if(this.props.value == "1" || this.props.value == 1 || this.props.value == true){
						checked["checked"] = "true";
					}
					return (
				      	<FormGroup bgSize="lg" controlId={this.props.id} style={style} validationState={this.state.data.validateState}>
						      <Col sm={2} style={{textAlign:"right",paddingTop:"10px"}} componentClass={ControlLabel}>
						        {notNullTag}{this.props.alias||this.props.name} 
						      </Col> 
				      			<Col sm={10}>
						        	<Checkbox name={this.props.name} onClick={this.onCheck.bind(this)} style={{marginLeft:"10px"}} {...checked}>点选{checked}</Checkbox>
						      </Col>
				    	</FormGroup>
				    );
					break;
				case "readOnly":
					propsExt["value"] =  propsExt["defaultValue"];
					delete propsExt["defaultValue"];
					propsExt["readOnly"] = true;
					break;
				case "hidden":
					style["display"] = "none";
					propsExt["type"] = "hidden";
					break;
				case "select":
	    			propsExt["componentClass"] = "select";
					options = this.props.options.map(function(option,index){
						return <option value={option}>{option}</option>;
					});
					break;
			}
	    }else{
	    	propsExt["type"] = "text";
	    }
	    if(this.props.readOnly){
	    	propsExt["value"] =  propsExt["defaultValue"];
			delete propsExt["defaultValue"];
			propsExt["readOnly"] = true;
	    }

	    var notNullTag = "";
	    if(this.props.validator){
	    	if(this.props.validator.notNull)
	    		notNullTag = "* "
	    }
        return (
	        <FormGroup bgSize="lg" controlId={this.props.id} style={style} validationState={this.state.data.validateState}>
		      <Col sm={2} style={{textAlign:"right",paddingTop:"10px"}} componentClass={ControlLabel}>
		        {notNullTag}{this.props.alias||this.props.name} 
		      </Col> 
		      <Col sm={10}>
		        <FormControl  {...propsExt} onChange={this.changeValue.bind(this)}>
		        	{options}
		        </FormControl>
		        <HelpBlock>{this.state.data.errorMessage}</HelpBlock>
		        <FormControl.Feedback style={{right:"15px",top:"4px"}}/>
		      </Col>
		    </FormGroup>
        );
    }
}

class SelectAddableRow extends SimpleRow {
	constructor(props) {
        super(props);
        this.result = {};
        this.state = {
        	"data" : null
        };
    }
    componentDidMount(props) {
		var array = [];
        array.push({value:this.props.value, type:this.props.selector[0], validateState:""});
        var data = {name:this.props.name};
        data["value"] = array;
        // console.log(data);
        this.setState({
        	"data" : data
        });
    }
    addSub(){
    	var data2 = this.state.data;
    	data2.value.push({value:"1", type:this.props.selector[0], validateState:""});
    	this.setState({
    		"data" : data2
    	});
    }
    deleteSub(index){
    	var data2 = this.state.data;
    	data2.value.splice(index,1);
    	this.setState({
    		"data" : data2
    	});
    }

    validate(){
    	var flag = true;
    	var data2 = this.state.data;
    	for(var index in data2["value"]){
    		if(data2["value"][index].validateState == "error")
    			flag = false;
    		else if(data2["value"][index].validateState == "unknown"){
				var validateResult = this.validateAndSetState(data2["value"][index]);
		    	Object.assign(data2["value"][index], validateResult);
		    	if(validateResult.validateState == "error")
		    		flag = false;
			}
    	}
		this.setState({
    		"data" : data2
    	});
		return flag;
    }

    changeValue(index, event){
    	var data2 = this.state.data;
    	data2["value"][index].value = event.target.value;
    	var validateResult = this.validateByValue(event.target.value);
    	Object.assign(data2["value"][index], validateResult);
    	this.setState({
    		"data" : data2
    	});
    }
    changeType(index, event){
    	var data2 = this.state.data;
    	data2["value"][index].type = event.target.value;
    	this.setState({
    		"data" : data2
    	});
    }
    getResult(){
    	var result = {};
    	var array = this.state.data.value;
    	var resultArray = [];
    	for(var i in array){
    		resultArray.push({num: array[i].value, type:array[i].type});	
    	}
    	result[this.props.name] = resultArray;
    	return result;
    }
    render() {
	    if(this.state.data){
	    	var type = this.props.type;
		    var options = this.props.selector.map(function(option,index){
				return <option value={option}>{option}</option>;
			});
			var style = {overflow: "hidden", margin: "10px 0" }
		    var notNullTag = "";
		    if(this.props.validator){
		    	if(this.props.validator.notNull)
		    		notNullTag = "* "
		    }
		    var that = this;
	    	var formGroupList = this.state.data.value.map(function(group, index){
		    	var title;
		    	var button = <Button onClick={that.deleteSub.bind(that, index)}>-</Button>;
		    	if(index == 0){
		    		title = that.props.alias||that.props.name;
		    		button = <Button onClick={that.addSub.bind(that)}>+</Button>;
		    	}
		    	return (
			        <FormGroup bgSize="lg" controlId={that.props.id} style={style} validationState={group.validateState}>
				      <Col sm={2} style={{textAlign:"right",marginTop:"10px"}} componentClass={ControlLabel}>
				      {title}
				      </Col>
				      <Col sm={4} style={{textAlign:"right", paddingTop:"5px"}} componentClass={ControlLabel}>
				      	<FormControl  value={group.type} componentClass="select" onChange={that.changeType.bind(that,index)}>
				      		{options}
					    </FormControl>
				      </Col> 
				      <Col sm={5}>
				        <FormControl style={{textAlign:"left",marginTop:"5px"}} value={group.value} type="text" onChange={that.changeValue.bind(that,index)}>
				        </FormControl>
				        <HelpBlock>{group.errorMessage}</HelpBlock>
				        <FormControl.Feedback style={{right:"15px",top:"4px"}}/>
				      </Col>
				      <Col sm={1} style={{textAlign:"center" ,padding:"5px 0px"}} componentClass={ControlLabel}>
				      	{button}
				      </Col> 
				    </FormGroup>
		        );
		    });
	    	return (
	    		<div>{formGroupList}</div>
	    	);
	    }
	    else{
		    return <div></div>;
    	}
	    
    }
}

export {SimpleRow, SelectAddableRow};
