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
    	window.location.href=this.props.editUrl+"/"+this.props.data[this.props.identifier]; 
    }
    render() {
    	var filter = this.props.filter;
    	var data = this.props.data;
    	var columns = filter.map(function(col){
    		return <td style={{verticalAlign:"middle"}}>{data[col]}</td>;
    	});
        return (
	        <tr>
	        	<td style={{verticalAlign:"middle",textAlign:"center"}}>{this.props.rowNo}</td>
	        	{columns}
	        	<td style={{verticalAlign:"middle",textAlign:"center"}}><Button onClick={this.editRow.bind(this)}>编辑</Button></td>
    		{/*利用图片撑开最小高度*/}
	        	<td style={{visibility:"hidden",width:"0px",padding:0,margin:0}}><img style={{float:"left",minHeight:"40px",visibility:"hidden"}}/></td>
	        </tr>
        );
    }
}

class PageListTaskState extends PageList {
	getSelector(){
		return (<FormControl componentClass="select" placeholder="type" name="type">
			        <option value="all">全部类型</option>
			        <option value="待处理">待处理</option>
			        <option value="处理中">处理中</option>
			        <option value="已完成">已完成</option>
			        <option value="变更中">变更中</option>
			        <option value="已取消">已取消</option>
			     </FormControl>);
	}
}
export default PageList;