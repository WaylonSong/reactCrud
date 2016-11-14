import React, { Component, PropTypes } from 'react';
import { Pagination, Table, Button, Navbar, FormGroup, FormControl, Checkbox} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';

class Expert extends Component{
	constructor(props) {
        super(props);
        this.state = {
        	data : this.props.data,
        	confirm : false,
        	check : false
        };
    }
    editRow(e){
    	// window.location.href=this.props.editUrl+"/"+this.props.data[this.props.identifier]; 
    }
    check(){
    	this.setState({
    		check : !this.state.check
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
        return (
	        <tr>
	        	<td style={{verticalAlign:"middle",textAlign:"center"}}>{this.props.rowNo}</td>
	        	{columns}
	        	<td style={{verticalAlign:"middle",textAlign:"center"}}><Checkbox onClick={this.check.bind(this)}></Checkbox></td>
    		{/*利用图片撑开最小高度*/}
	        	<td style={{visibility:"hidden",width:"0px",padding:0,margin:0}}><img style={{float:"left",minHeight:"40px",visibility:"hidden"}}/></td>
	        </tr>
        );
    }
}

class ExpertList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	data : [],
        	operation : "",
        };
    }

    componentDidMount() {
    	$.ajax({
		    type: "get",
		    dataType: 'json',
		    url: this.props.taskExpertsUrl,
		    success: function(data){
		    	this.setState({
		        	data : data
		        });
		    }.bind(this),
		    error: function(data){
		        // that.setState({ modalShow: false, modalMethod:"alert", modalMessage: "操作失败"});
		    }
		});
    }

    getSelectedRows(){
        var result = [];
        for(var row in this.refs){
            if(this.refs[row].state.check == true){
                result.push(this.refs[row].props.data["expertsId"]);
            }
        }
        return result;
    }
    
    genTable(){
        var data = this.state.data;
        var that = this;
        var rows = data.map(function(row, index){
            return <Expert data={row} rowNo={index+1} ref={"row"+index} department={that.props.department}/>
        });
        var th;
        if(this.props.department == "d2"){
            th = <th style={{textAlign:"center"}}>科目</th>;
        }
        return (
            <Table  striped bordered condensed hover>
                <thead>
                  <tr>
                    <th style={{textAlign:"center"}}>#</th>
                    <th style={{textAlign:"center"}}>组别</th>
                    {th}
                    <th style={{textAlign:"center"}}>姓名</th>
                    <th style={{textAlign:"center"}}>工作单位</th>
                    <th style={{textAlign:"center"}}>职务</th>
                    <th style={{textAlign:"center"}}>电话</th>
                    <th style={{textAlign:"center"}}>需要更换</th>
                  </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        );
    }

    render() {
        if(this.props.taskState == "" || this.props.taskState == "处理中"){
            return <div></div>;
        }
        return (
        	<div>	
			  {this.genTable()}
	    	</div>
	    );
    }
}

export default ExpertList;
