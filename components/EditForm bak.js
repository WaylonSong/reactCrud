import React, {
	Component,
	PropTypes
} from 'react';
import {Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal, Checkbox} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';
import DateUtil from '../util/DateUtil';
import {SimpleRow, SelectGroup, CityValuePairRow, ComplexRow, HintRow, SelectAddableRow} from './EditableRow'

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
			var that = this;
			$.ajax({
			    type: "get",
			    dataType: 'json',
			    url: this.props.url,
			    success: function(data){
			    	var formInit = ObjectUtil.fillFormInit(data, this.props.formInit);
					ObjectUtil.mergeData(formInit, this.props.formExtend);
					this.setState({data: formInit, modalMethod:"alert", modalShow: false, modalMessage: "操作成功"});
			    }.bind(this),
			    error: function(data){
			        that.setState({ modalShow: false, modalMethod:"alert", modalMessage: "操作失败"});
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
	        msg = "操作成功" + (data.message?":"+data.message:"") ;
			states["redirectFlag"] = "true";
	    }
	    else{
	        msg = "操作失败" + (data.message?":"+data.message:"") ;
	    }
	    states["modalMessage"] = msg;
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
		var data = {};
		var cRefs = this.refs;
		for(var index in cRefs){
			Object.assign(data, cRefs[index].getResult());
		}
		return data;
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
			if(cRefs[index].validate() == false){
				flag = false;
			}
		}
		return flag;
	}


	delete(){
		var data = this.dataWrap();
		this.ajaxSubmit("delete", this.props.url, data);
	}

	genRows(data){
		var that = this;
		return data.map(function(row){
			if(row.selectGroup){
				return <SelectGroup ref={row.name} {...row}/>
			}
			if(row.group){
				return <SelectAddableRow ref={row.name} {...row} selector={that.props.selector[row.group]}/>
			}
			if(row.validator && row.validator.dataType && row.validator.dataType == "location"){
				console.log(row.validator)
			    return <CityValuePairRow ref={row.name} {...row}/>
			}
			if(row.type && row.type == "complexRow"){
				return <ComplexRow ref={row.name} {...row}/>
			}
			if(row.type && row.type=="hint"){
				return <HintRow ref={row.name} {...row}/>
			}
    		return <SimpleRow ref={row.name} {...row}/> 
    	});
	}
	//defaut add / modify
	genButtons(){
		if(this.props.noButton == true)
			return;
		if(this.props.method == "put"){
			return(<div>
				<Button onClick={() => this.setState({ modalShow: true, modalMessage:"确认修改?", modalMethod:"update"})} 
					bsStyle="primary" style={{marginTop:"10px"}}>修改</Button>
				<Button onClick={() => this.setState({ modalShow: true, modalMessage:"确认删除?", modalMethod:"delete"})} 
					style={{margin:"10px 0 0 20px"}}>删除</Button>
				</div>);
		}else if(this.props.method == "post"){
			return(<div><Button onClick={this.submit.bind(this)} bsStyle="primary" style={{marginTop:"10px",padding:"5px 20px 5px 20px"}}>确认</Button></div>);
		}
	}

	render() {
		var buttons, modalButtons;
		buttons = this.genButtons();
		if(this.state.modalMethod == "alert"){
			modalButtons = <Button onClick={this.closeModal.bind(this)}>关闭</Button>;
		}else{
			modalButtons = <div><Button bsStyle="primary" onClick={this.confirm.bind(this)}>确认</Button>
		            <Button onClick={this.closeModal.bind(this)}>关闭</Button></div>;
		}
		var data = this.state.data;
		if(!data)
			return <div>loading...</div>;
		var rows = this.genRows(data);

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

class EditFormWithStandardResp extends EditForm{
	componentDidMount() {
		if(this.props.method == "put"){
			var that = this;
			$.ajax({
			    type: "get",
			    dataType: 'json',
			    url: this.props.url,
			    success: function(data){
			    	var formInit = ObjectUtil.fillFormInit(data.data, this.props.formInit);
					ObjectUtil.mergeData(formInit, this.props.formExtend);
					this.setState({data: formInit, modalMethod:"alert", modalShow: false, modalMessage: "操作成功"});
			    }.bind(this),
			    error: function(data){
			        that.setState({ modalShow: false, modalMethod:"alert", modalMessage: "操作失败"});
			    }
			});

		}else if(this.props.method == "post"){
			var formInit = this.props.formInit;
			ObjectUtil.mergeData(formInit, this.props.formExtend);
			this.setState({data: formInit});
		}
	}
}

export default EditForm;
export {EditFormWithStandardResp};