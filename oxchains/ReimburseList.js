import React, {
  Component,
  PropTypes
} from 'react';
import { Pagination, Table, Button, Navbar, FormGroup, FormControl, Checkbox} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';
import PageList from '../components/PageList';

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
        if(this.props.type != "individual")
          columns.push(<td style={{verticalAlign:"middle",textAlign:"center"}}><Button onClick={this.editRow.bind(this)}>{this.props.editButtonTitle||"处理"}</Button></td>);
        else
          columns.push(<td style={{verticalAlign:"middle",textAlign:"center"}}><Button onClick={this.editRow.bind(this)}>{this.props.editButtonTitle||"查看"}</Button></td>);

        var className;
        if(data["state"] == "处理中"){
          className = "danger";
        }else if(data["state"] == "变更中"){
          className = "warning";
        }
        return (
          <tr className={className}>
            <td style={{verticalAlign:"middle",textAlign:"center"}}>{this.props.rowNo}</td>
            {columns}
        {/*利用图片撑开最小高度*/}
            <td style={{visibility:"hidden",width:"0px",padding:0,margin:0}}><img style={{float:"left",minHeight:"40px",visibility:"hidden"}}/></td>
          </tr>
        );
    }
}
class ReimburseList extends PageList {
  genRows(){
    var identifier = this.props.identifier;
    var that = this;
    var rowNo = 1;
    if(this.state.rowList){
      return this.state.rowList.map(function(row){
        return <Row ref={"_"+rowNo} data={row} rowNo={rowNo++} filter={that.columnKeys} identifier={identifier} editUrl={that.props.editUrl} type={that.props.type}/>
      });
    }else{
      return <tr><td colSpan="6">数据列表为空！</td></tr>;
    }
  }
}
export default ReimburseList;
export {Row};