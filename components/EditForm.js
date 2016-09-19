import React, {
	Component,
	PropTypes
} from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';

class EditFormGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	"validateState" : "unkown",
        }
    }
    validate(e){
    	this.validateByValue(e.target.value);
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
    			console.log(value.length);
    				if((value!="") && (value.length!=11 || !$.isNumeric(value))){
    					properties["validateState"] = 'error';
    					properties["errorMessage"] = '请填写正确的手机号码';
    				}
    				break;
    		
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
    	this.setState(properties);
    	return properties.validateState == "";
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
	    var value = "defaultValue";
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
	    var notNullTag = "";
	    if(this.props.validator){
	    	if(this.props.validator.notNull)
	    		notNullTag = "* "
	    }
        return (
	        <FormGroup bgSize="lg" controlId={this.props.id} style={style} validationState={this.state.validateState}>
		      <Col sm={2} style={{textAlign:"right",paddingTop:"10px"}} componentClass={ControlLabel}>
		        {notNullTag}{this.props.alias||this.props.name} 
		      </Col> 
		      <Col sm={10}>
		        <FormControl  {...propsExt} onChange={this.validate.bind(this)}>
		        	{options}
		        </FormControl>
		        <HelpBlock>{this.state.errorMessage}</HelpBlock>
		        <FormControl.Feedback style={{right:"15px",top:"4px"}}/>
		      </Col>
		    </FormGroup>
        );
    }
}

class EditForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data : null,
			modalShow : false,
        	redirectFlag: false
		};
	}
	componentDidMount() {
		if(this.props.method == "put"){
			$.ajax({
			    type: "get",
			    dataType: 'json',
			    url: this.props.url,
			    success: function(data){
			    	var formInit = ObjectUtil.dataToArray(data);
					ObjectUtil.mergeData(formInit, this.props.formExtend);
					this.setState({data: formInit, modalMethod:"alert", modalShow: false, modalMessage: "操作成功"});
			    }.bind(this),
			    error: function(data){
			        this.setState({ modalShow: false, modalMethod:"alert", modalMessage: "操作失败"});
			    }
			});

		}else if(this.props.method == "post"){
			var formInit = this.props.formInit;
			ObjectUtil.mergeData(formInit, this.props.formExtend);
			this.setState({data: formInit});
		}
	}
	default_success_callback(data){
	    var msg;
	    var states = {modalMethod:"alert", modalShow: true};
	    if(data.status == 1){
	        msg = data.message || "操作成功";
			states["redirectFlag"] = "true";
	    }
	    else{
	        msg = data.message || "操作失败";
	    }
	    states["modalMessage"] = msg;
	    console.log(states);
		this.setState(states);
	}
	
	ajaxSubmit(submitType, url, data){
		var callback = this.default_success_callback.bind(this);
		var that = this;
        $.ajax({
            type: submitType,
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType : 'application/json',
            success: callback,
            error: function(data){
				that.setState({modalMethod:"alert", modalShow: true, modalMessage: "操作失败"});
            }
        });
	}
	submit(){
		var list = this.dataWrap();
		if(this.validate())
			this.ajaxSubmit(this.props.method, this.props.url, list);
	}

	dataWrap(){
		let nameValueArray = $("form").serializeArray();	
		var result = {};
		for(var item in nameValueArray) {
			result[nameValueArray[item].name] = nameValueArray[item].value;
		}
		return result;
	}

	confirm(){
		if(this.state.modalMethod == "update")
			this.submit();
		else if(this.state.modalMethod == "delete")
			this.delete();
		this.setState({ modalShow: false});
	}
	closeModal(){
    	this.setState({ modalShow: false});
    	console.log(this.props.redirectUrl);
    	if(this.state.redirectFlag){
    		if(this.props.redirectUrl)
	    		window.location = this.props.redirectUrl;
	    	else
	    		location.reload();
    	}
	}
	/*
	children的state和validate函数联合判断，由于validate再change时触发，所以拆分原有子类的validate的函数，解绑事件参数，
	validateState初始化为unknown，只有change才会触发变化，所以要针对这种情况手动触发子类validateByValue方法
	*/
	validate(){
		var cRefs = this.refs;
		var flag = true;
		for(var index in cRefs){
			var cState = cRefs[index].state;
			if(cState.validateState == "error"){
				flag = false;
			}
			if(cState.validateState == "unkown" && !cRefs[index].validateByValue(cState.value)){
				flag = false;
			}
		}
		return flag;
	}


	delete(){
		var list = this.dataWrap();
		this.ajaxSubmit("delete", this.props.url, list);
	}
	render() {
		var buttons, modalButtons;
		if(this.props.method == "put"){
			buttons = <div>
				<Button onClick={() => this.setState({ modalShow: true, modalMessage:"确认修改?", modalMethod:"update"})} 
					bsStyle="primary" style={{marginTop:"10px"}}>修改</Button>
				<Button onClick={() => this.setState({ modalShow: true, modalMessage:"确认删除?", modalMethod:"delete"})} 
					style={{margin:"10px 0 0 20px"}}>删除</Button>
				</div>;
		}else{
			buttons = <div><Button onClick={this.submit.bind(this)} bsStyle="primary" style={{marginTop:"10px",padding:"5px 20px 5px 20px"}}>添加</Button></div>;
		}
		if(this.state.modalMethod == "alert"){
			modalButtons = <Button onClick={this.closeModal.bind(this)}>关闭</Button>;
		}else{
			modalButtons = <div><Button bsStyle="primary" onClick={this.confirm.bind(this)}>确认</Button>
		            <Button onClick={this.closeModal.bind(this)}>关闭</Button></div>;
		}
		var data = this.state.data;
		if(!data)
			return <div>loading...</div>;
		var rows = data.map(function(row){
    		return <EditFormGroup ref={row.name} {...row}/> 
    	});
		return (
			<form >
				{rows}
				<FormGroup>
			      <Col md={12} lg={12} style={{textAlign:"center"}}>
			        	{buttons}
			      </Col>
			    </FormGroup>
			    <div className="modal-container">
			        <Modal
			          show={this.state.modalShow}
			          onHide={this.closeModal.bind(this)}
			          container={this}
			          aria-labelledby="contained-modal-title"
			        >
			          <Modal.Body>
			            {this.state.modalMessage}
			          </Modal.Body>
			          <Modal.Footer style={{textAlign:"center"}}>
			            {modalButtons}
			          </Modal.Footer>
			        </Modal>
			    </div>
			</form>
			
    	);
	}
}
export default EditForm;