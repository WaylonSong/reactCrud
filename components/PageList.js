import React, {
	Component,
	PropTypes
} from 'react';
import { Pagination, Table, Button} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';

class Row extends Component {
    constructor(props) {
        super(props);
    }editRow
    editRow(e){
    	console.log(this.props.data[this.props.identifier]);
    	window.location.href=this.props.editUrl+"/"+this.props.data[this.props.identifier]; 
    }
    render() {
    	var filter = this.props.filter;
    	var data = this.props.data;
    	var columns = filter.map(function(col){
    		return <td style={{verticalAlign:"middle"}}>{data[col]}</td>;
    	});
        return (
	        <tr style={{cursor:"pointer"}} onClick={this.editRow.bind(this)}>
	        	
	        	<td style={{verticalAlign:"middle",textAlign:"center"}}>{this.props.rowNo}</td>
	        	{columns}
    		{/*利用图片撑开最小高度*/}
	        	<td style={{visibility:"hidden",width:"0px",padding:0,margin:0}}><img style={{float:"left",minHeight:"40px",visibility:"hidden"}}/></td>
	        </tr>
        );
    }
}

class PageList extends Component {

	componentDidMount() {
		console.log("componentDidMount");
		this.handlePageSelect(this.state.activePage);
	}
	fetchList(pageNum){
		$.ajax({
			type: "get",
			dataType: 'json',
			url: this.props.url+"/"+pageNum,
			success: function(data) {
				this.setState({
					rowList: data
				});
			}.bind(this),
			error: function(data) {
				alert("操作失败");
			}
		});
	}

	constructor(props) {
		super(props);
		this.state = {
			activePage: this.props.activePage||1,
			totalPage: this.props.totalPage||1,
			rowList:[]
		};
		this.curpage = this.props.activePage;
		console.log("constructor: this.state.activePage "+this.state.activePage);
		this.columnKeys = [];
		this.columnValues = [];

		for(var key in this.props.columns){
			this.columnKeys.push(key);
			this.columnValues.push(this.props.columns[key]);
		}
		this.vhs = this.columnValues.map(function(val){
    		return <th style={{textAlign:"center"}}>{val}</th>
    	});
	}


	handlePageSelect(eventKey) {
		// if(eventKey == this.state.activePage)
		// 	return;
		this.setState({
			activePage: eventKey,
		});
		window.location.hash = eventKey;
		this.fetchList(eventKey);
	}


	default_success_callback(data) {
		var msg;
		if (data.status == 1)
			msg = data.message || "操作成功";
		else
			msg = data.message || "操作失败";
		alert(msg);
	}

	directToAddPage(){
		window.location.href = this.props.addUrl;
	}

	render() {
		
		if(!this.state.rowList){
			return;
		}

		console.log("render");
		var identifier = this.props.identifier;
		var that = this;
    	var rowNo = (this.state.activePage-1)*this.props.pageSize + 1;
			console.log(rowNo);

		var rows = this.state.rowList.map(function(row){
			// console.log(row);
			return <Row data={row} rowNo={rowNo++} filter={that.columnKeys} identifier={identifier} editUrl={that.props.editUrl}/>
		});
	    return (
	    	<div>
	    		  <Table  striped bordered condensed hover>
			        <thead>
			          <tr>
			          	<th style={{textAlign:"center"}}>序号</th>
			            {this.vhs}
			          </tr>
			        </thead>
			        <tbody>
			        	{rows}
			        </tbody>
			      </Table>
			      <Pagination
			        prev
			        next
			        first
			        last
			        ellipsis
			        boundaryLinks
			        items={this.state.totalPage}
			        maxButtons={5}
			        activePage={this.state.activePage}
			        onSelect={this.handlePageSelect.bind(this)} 
			        style={{marginTop:"-15px"}}
			        />
			      <Button onClick={this.directToAddPage.bind(this)} bsStyle="primary" style={{float:"right",margin:"-15px 0px 10px 0",padding:"5px 15px 5px 15px"}}>添加</Button>
	        </div>
	    );
	  }
}
export default PageList;