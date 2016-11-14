import React, { Component, PropTypes } from 'react';
import { Pagination, Table, Button, Navbar, FormGroup, FormControl} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil'

class Expert extends Component{
	constructor(props) {
        super(props);
        this.state = {
        	data : this.props.data,
        	confirm : false
        };
    }
    editRow(e){
    	// window.location.href=this.props.editUrl+"/"+this.props.data[this.props.identifier]; 
    }
    changeExpert(e){
    	var input = this.refs.reason;
		var inputValue = input.value;
		if(inputValue == ""){
			alert("请填写替换原因");
			return;
		}
    	var data={reason:this.refs.reason.value};
    	$.ajax({
		    type: "post",
		    dataType: 'json',
		    url: this.props.replaceUrl+"/"+this.state.data.expertsId,
		    data: JSON.stringify(data),
			contentType : 'application/json',
		    success: function(data){
		    	alert("更换成功");
		    	this.refs.reason.value = "";
				this.setState({data:data});
		    }.bind(this),
		    error: function(data){
		        // that.setState({ modalShow: false, modalMethod:"alert", modalMessage: "操作失败"});
		    }
		});
    }
    render() {
    	var data = this.state.data;
    	var columnProps = [];
    	columnProps.push(data["category"]);
    	if(this.props.department == "d2")
            columnProps.push(data["categoryTwo"]);
    	columnProps.push(data["name"]);
    	columnProps.push(data["work"]);
    	columnProps.push(data["title"]);
    	columnProps.push(data["phone"]);
    	var columns = columnProps.map(function(prop){
    		return <td style={{verticalAlign:"middle"}}>{prop}</td>;
    	});
    	var disabled = {};
    	if(this.props.taskState == "变更中" && data["state"]!="待确认"){
    		disabled = {disabled:true}
    	}
        return (
	        <tr>
	        	<td style={{verticalAlign:"middle",textAlign:"center"}}>{this.props.rowNo}</td>
	        	{columns}
		        {this.props.taskState == "生成中" || this.props.taskState == "已生成" || this.props.taskState == "变更中"?
		        	<td style={{verticalAlign:"middle",textAlign:"center"}}><input ref='reason'/></td>:""}
		        {this.props.taskState == "生成中" || this.props.taskState == "已生成" || this.props.taskState == "变更中"?
		        	<td style={{verticalAlign:"middle",textAlign:"center"}}><Button {...disabled}  onClick={this.changeExpert.bind(this)}>更换</Button></td>:""}
    		{/*利用图片撑开最小高度*/}
	        	<td style={{visibility:"hidden",width:"0px",padding:0,margin:0}}><img style={{float:"left",minHeight:"40px",visibility:"hidden"}}/></td>
	        </tr>
        );
    }
}

class ExpertListDq extends Component {

    constructor(props) {
        super(props);
        this.state = {
        	data : [],
        	hasRetrieved:false
        };
    }

    fetchData(){
    	if(this.state.hasRetrieved){
    		return;
    	}
    	var url = this.props.taskExpertsUrl;
    	if(this.props.taskState == "生成中")
    		url = this.props.genExpertsUrl;
    	$.ajax({
		    type: "get",
		    dataType: 'json',
		    url: url,
		    success: function(data){
		    	this.setState({
		    		hasRetrieved : true,
		        	data : data
		        });
		    }.bind(this),
		    error: function(data){
		        // that.setState({ modalShow: false, modalMethod:"alert", modalMessage: "操作失败"});
		    }
		});
    }

    render() {
		var rowNo = 1;
		var data = this.state.data;
		var that = this;
    	var rows = data.map(function(row){
    		// console.log(row);
			return <Expert data={row} rowNo={rowNo++} taskState={that.props.taskState} department={that.props.department} replaceUrl={that.props.replaceUrl}/>
		});
		if(this.props.taskState == "" || this.props.taskState == "处理中"){
            return <div></div>;
        }
        this.fetchData();
        return (
        	<div>	
			  <Table  striped bordered condensed hover>
		        <thead>
		          <tr>
		          	<th style={{textAlign:"center"}}>#</th>
		          	<th style={{textAlign:"center"}}>组别</th>
                    {this.props.department == "d2"?<th style={{textAlign:"center"}}>科目</th>:""}
		          	<th style={{textAlign:"center"}}>姓名</th>
		          	<th style={{textAlign:"center"}}>工作单位</th>
		          	<th style={{textAlign:"center"}}>职务</th>
		          	<th style={{textAlign:"center"}}>电话</th>
		          	{this.props.taskState == "生成中" || this.props.taskState == "已生成" || this.props.taskState == "变更中"?<th style={{textAlign:"center"}}>更换理由</th>:""}
		          	{this.props.taskState == "生成中" || this.props.taskState == "已生成" || this.props.taskState == "变更中"?<th style={{textAlign:"center"}}>操作</th>:""}
		          </tr>
		        </thead>
		        <tbody>
		        	{rows}
		        </tbody>
		      </Table> 
	    	</div>
	    );
    }
}

export default ExpertListDq;
