import React, {
	Component,
	PropTypes
} from 'react';
import { Pagination, Table } from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';

class Row extends Component {
    constructor(props) {
        super(props);
    }editRow
    editRow(e){
    	// console.log(this.props.identifier);
    	// let index = $($(e.target).parent()).index();
    	console.log(this.props.data[this.props.identifier]);
    	window.location.href="edit/"+this.props.data[this.props.identifier]; 
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
	        	<td style={{visibility:"hidden"}}><img style={{float:"left",minHeight:"40px",visibility:"hidden",width:"0px"}}/></td>
	        </tr>
        );
    }
}

class PageList extends Component {

	componentDidMount() {
		console.log("mounted"+this.state.activePage);
		this.handlePageSelect(this.state.activePage);
	}
	componentWillMount() {
	  	this.setState({
			activePage: this.props.activePage,
		});
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
    		return <th>{val}</th>
    	});
	}


	handlePageSelect(eventKey) {
		if(eventKey == this.state.activePage)
			return;
		this.setState({
			activePage: eventKey,
		});

		window.location.hash = eventKey;
		//解决初始化active样式
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
			return <Row data={row} rowNo={rowNo++} filter={that.columnKeys} identifier={identifier}/>
		});
	    return (
	    	<div>
	    		  <Table  striped bordered condensed hover>
			        <thead>
			          <tr>
			          	<th>序号</th>
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
			        onSelect={this.handlePageSelect.bind(this)} />
	        </div>
	    );
	  }
}
export default PageList;