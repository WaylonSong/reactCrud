import React, {
	Component,
	PropTypes
} from 'react';
import { Pagination, Table, Button, Navbar, FormGroup, FormControl} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';

class Row extends Component {
    constructor(props) {
        super(props);
    }
    editRow(e){
    	window.location.href=this.props.editUrl+"/"+this.props.data[this.props.identifier]+"?pn="+window.location.hash.substring(1); 
    }
    render() {
    	var filter = this.props.filter;
    	var data = this.props.data;
    	var columns = filter.map(function(col){
    		return <td style={{verticalAlign:"middle"}}>{data[col]}</td>;
    	});
    	if(this.props.editUrl)
    		columns.push(<td style={{verticalAlign:"middle",textAlign:"center"}}><Button onClick={this.editRow.bind(this)}>{this.props.editButtonTitle||"处理"}</Button></td>);
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

class PageList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: this.props.activePage||1,
			totalPage : 1,
			pageSize : 10,
			rowList:[],
			taskState: this.props.state
		};
		this.curpage = this.props.activePage;
		this.columnKeys = [];
		this.columnValues = [];

		for(var key in this.props.columnFilter){
			this.columnKeys.push(this.props.columnFilter[key].name);
			this.columnValues.push(this.props.columnFilter[key].alias);
		}
		this.vhs = this.columnValues.map(function(val){
    		return <th style={{textAlign:"center"}}>{val}</th>
    	});
    	if(this.props.editUrl)
			this.vhs.push(<th style={{textAlign:"center"}}>操作</th>);
	}

	componentDidMount() {
		this.handlePageSelect(this.state.activePage);
	}
	fetchList(pageNum){
		$.ajax({
			type: "get",
			dataType: 'json',
			url: this.props.url+"/"+pageNum,
			success: function(data) {
				this.setState({
					totalPage : data.totalPage,
					pageSize : data.pageSize || 10,
					rowList: data.data
				});
			}.bind(this),
			error: function(data) {
				alert("操作失败");
			}
		});
	}

	handlePageSelect(eventKey) {
		// if(eventKey == this.state.activePage)
		// 	return;
		this.setState({
			activePage: eventKey,
		});
		window.location.hash = eventKey;
		var url = eventKey;

		if(this.props.keyword){
			url += "?q="+this.props.keyword;
			$("input[name=q]").val(this.props.keyword);
		}
		if(this.props.state){
			if(url.lastIndexOf("?") > -1){
				url += "&";
			}else{
				url += "?";
			}
			url += "state="+this.props.state;
		}
		this.fetchList(url);

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

	getSelector(){
		if(!("selector" in this.props))
			return "";
		var options = this.props.selector.value.map(function(option){
			return <option value={option.value}>{option.name}</option>
		});
		return (<FormControl componentClass="select" placeholder="type" name={this.props.selector.name} value={this.state.taskState} onChange={this.taskStateChange.bind(this)}>
	        {options}
	     </FormControl>);
	}

	taskStateChange(event){
		this.setState({
			taskState : event.target.value
		});
	}

	genRows(){
		var identifier = this.props.identifier;
		var that = this;
    	var rowNo = (this.state.activePage-1)*this.state.pageSize + 1;

		return this.state.rowList.map(function(row){
			return <Row data={row} rowNo={rowNo++} filter={that.columnKeys} identifier={identifier} editUrl={that.props.editUrl}/>
		});
	}

	genAddButton(){
		if(this.props.addUrl)
			return <Button onClick={this.directToAddPage.bind(this)} bsStyle="primary" style={{float:"right",margin:"-15px 0px 10px 0",padding:"5px 15px 5px 15px"}}>添加</Button>;
	}

	render() {
		if(!this.state.rowList){
			return;
		}
		var rows = this.genRows();
		var searchBar = "";
		if(this.props.searchBar){
			searchBar = (
				<form action={window.location.href.split('?')[0].split('#')[0]}>
	    		  <Navbar>
				    <Navbar.Header>
				      <Navbar.Brand>
				        <a href="#" style={{fontSize:16}}>搜索</a>
				      </Navbar.Brand>
				      <Navbar.Toggle />
				    </Navbar.Header>
				    <Navbar.Collapse>
				      <Navbar.Form pullLeft>
				        <FormGroup >
				          <FormControl type="text" name="q" placeholder="Search" defaultValue={this.props.keyword}/>
				        </FormGroup>
				        {' '}
				        {this.getSelector()}
				        {' '}
				        <Button type="submit">提交</Button>
				      </Navbar.Form>
				    </Navbar.Collapse>
				  </Navbar>
	    		</form>
			);
		}
	    return (
	    	<div>
	    		 {searchBar}
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
			      {this.genAddButton()}
	        </div>
	    );
	  }
}
export default PageList;
export {Row};