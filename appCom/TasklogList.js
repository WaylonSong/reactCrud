import React, { Component, PropTypes } from 'react';
import { Pagination, Table, Button, Navbar, FormGroup, FormControl} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil'

class Log extends Component{
	constructor(props) {
        super(props);
        this.state = {
        	data : this.props.data,
        	confirm : false
        };
    }
    render() {
    	var data = this.state.data;
    	var columnProps = [];
    	columnProps.push(data["newName"]);
    	columnProps.push(data["oldName"]);
    	columnProps.push(data["reason"]);
    	columnProps.push(data["createUser"]);
    	columnProps.push(data["createTime"]);
    	var columns = columnProps.map(function(prop){
    		return <td style={{verticalAlign:"middle"}}>{prop}</td>;
    	});
        return (
	        <tr>
	        	<td style={{verticalAlign:"middle",textAlign:"center"}}>{this.props.rowNo}</td>
	        	{columns}
    		{/*利用图片撑开最小高度*/}
	        	<td style={{visibility:"hidden",width:"0px",padding:0,margin:0}}><img style={{float:"left",minHeight:"40px",visibility:"hidden"}}/></td>
	        </tr>
        );
    }
}

class TasklogList extends Component {

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
    	var url = this.props.tasklogUrl;
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
			return <Log data={row} rowNo={rowNo++}/>
		});
		
        this.fetchData();
        return (
        	<div>	
			  <Table  striped bordered condensed hover>
		        <thead>
		          <tr>
		          	<th style={{textAlign:"center"}}>#</th>
		          	<th style={{textAlign:"center",minWidth:"51px"}}>新选专家</th>
		          	<th style={{textAlign:"center",minWidth:"51px"}}>被替专家</th>
		          	<th style={{textAlign:"center",minWidth:""}}>替换原因</th>
		          	<th style={{textAlign:"center",minWidth:"51px"}}>操作人</th>
		          	<th style={{textAlign:"center",minWidth:""}}>时间</th>
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

export default TasklogList;
