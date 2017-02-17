import React, {
	Component,
	PropTypes
} from 'react';
import {Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal, Checkbox} from 'react-bootstrap';
import {EditFormWithStandardResp} from '../components/EditForm';
import {SimpleRow, SelectGroup, CityValuePairRow, ComplexRow} from '../components/EditableRow'


class InvoiceUrlList extends SimpleRow{

	render() {
    	var type = this.props.type;
    	var propsExt = {
    		placeholder : this.props.placeholder,
    		defaultValue : this.props.value,
    		name : this.props.name,
    		type : type,
    		style: {marginTop:"5px"}
    	};
    	var that = this;
    	var urls = this.props.value.map(function(item){
    		return <a href={"/invoice/"+that.props.ownerId+"/"+item} target="_blank" style={{paddingRight:"10px"}}>{item}</a>
    	});
		var style = {overflow: "hidden", margin: "10px 0" }
        return (
	        <FormGroup bgSize="lg" controlId={this.props.id} style={style} validationState={this.state.data.validateState}>
		      <Col sm={2} style={{textAlign:"right",paddingTop:"10px"}} componentClass={ControlLabel}>
		        {this.props.alias||this.props.name} 
		      </Col> 
		      <Col sm={10} style={{paddingTop:"10px"}} >
		        {urls}
		      </Col>
		    </FormGroup>
        );
    }
}

class ReimburseForm extends EditFormWithStandardResp{
	constructor(props) {
		super(props);
		this.state = {
			data : null,
			modalShow : false,
        	redirectFlag: false,
        	traderId : ""
		};
		this.ownerId = "";
	}
	componentDidMount() {
		if(this.props.method == "put"){
			var that = this;
			$.ajax({
			    type: "get",
			    dataType: 'json',
			    url: this.props.url,
			    success: function(data){
			    	var formInit = ObjectUtil.fillFormInit(data.data, this.props.formInit);

			    	if(data.data.state == "待处理")
			    		that.ownerId = data.data.submitter;
			    	else
			    		that.ownerId = data.data.companyTitle;
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
	genRows(data){
		var that = this;
		return data.map(function(row){
			if(row.name == "invoiceNumberList"){
				if(!(row.value instanceof Array)){
					var invoiceArray = row.value.split("\t");
					row.value = invoiceArray;
				}
				
				return <InvoiceUrlList ref={row.name} {...row} ownerId={that.ownerId}/>
			}
			if(row.selectGroup){
				return <SelectGroup ref={row.name} {...row}/>
			}
			if(row.validator && row.validator.dataType && row.validator.dataType == "location"){
			    return <CityValuePairRow ref={row.name} {...row}/>
			}
			if(row.type && row.type == "complexRow"){
				return <ComplexRow ref={row.name} {...row}/>
			}
    		return <SimpleRow ref={row.name} {...row}/> 
    	});
	}

	genButtons(){
		if(this.props.noButton == true)
			return;
		if(this.props.method == "put"){
			if(this.props.type == "individual")
				return (<div>
					<Button onClick={() => window.history.back()} 
						bsStyle="primary" style={{marginTop:"10px"}}>返回</Button>
					</div>);
			else
				return(<div>
					<Button onClick={() => this.setState({ modalShow: true, modalMessage:"确认报销?", modalMethod:"update"})} 
						bsStyle="primary" style={{marginTop:"10px"}}>确认报销</Button>
					</div>);
		}
	}


}
export default ReimburseForm;