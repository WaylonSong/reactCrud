import React, {
  Component,
  PropTypes
} from 'react';
import { Pagination, Table, Button, Navbar, FormGroup, FormControl, Checkbox} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
          switch: false
        }
        this.retNum = "";
    }
    getCheckedNum(){
      if(this.checkbox == checked){
        return this.props.data["number"]
      }else
        return "";
    }
    render() {
      var filter = this.props.filter;
      var data = this.props.data;
      var columns = filter.map(function(col){
        return <td style={{verticalAlign:"middle"}}>{data[col]}</td>;
      });
      if(this.props.editUrl)
        columns.push(<td style={{verticalAlign:"middle",textAlign:"center"}}><Checkbox disabled={data["status"]!="流转中"?true:false} inputRef={ref=>{this.checkbox = ref;}}></Checkbox></td>);
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

class InvoiceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskState: this.props.state
    };
    this.columnKeys = [];
    this.columnValues = [];
    this.reimburseList = [];
    for(var key in this.props.columnFilter){
      this.columnKeys.push(this.props.columnFilter[key].name);
      this.columnValues.push(this.props.columnFilter[key].alias);
    }
    this.vhs = this.columnValues.map(function(val){
        return <th style={{textAlign:"center"}}>{val}</th>
      });
      if(this.props.editUrl)
      this.vhs.push(<th style={{textAlign:"center"}}>选择</th>);
  }

  componentDidMount() {
    // this.handlePageSelect(this.state.activePage);
    this.fetchList();
  }
  fetchList(){
    $.ajax({
      type: "get",
      dataType: 'json',
      url: this.props.url,
      success: function(data) {
        this.setState({
          rowList: data.data,
          storedList: data.data
        });
      }.bind(this),
      error: function(data) {
        alert("操作失败");
      }
    });
  }

  // default_success_callback(data) {
  //   var msg;
  //   if (data.status == 1)
  //     msg = data.message || "操作成功";
  //   else
  //     msg = data.message || "操作失败";
  //   alert(msg);
  // }

  // directToAddPage(){
  //   window.location.href = this.props.addUrl;
  // }

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
    console.log(this.state.storedList);
    var status = event.target.value;
    if(status == "all"){
      this.setState({
        rowList : this.state.storedList
      });
    }else{
      var rows = this.state.storedList.filter(function(row){
        return row["status"] == status;
      });
      this.setState({
        rowList : rows
      });
    }
  }

  genRows(){
    var identifier = this.props.identifier;
    var that = this;
    var rowNo = 1;
    console.log("----------------------");
    console.log(this.state.rowList);
    if(this.state.rowList && this.state.rowList.length > 0 ){
      return this.state.rowList.map(function(row){
        return <Row ref={"_"+rowNo} data={row} rowNo={rowNo++} filter={that.columnKeys} identifier={identifier} editUrl={that.props.editUrl}/>
      });
    }else{
      return <tr><td colSpan="8">数据列表为空！</td></tr>;
    }
  }

  reimburse(){
    var list = "";
    var buyerId = "";
    for(var r in this.refs){
      if(this.refs[r].checkbox.checked){
        var row = this.refs[r].props.data;
        list = list+"-"+row["number"];
        if(row["status"] != "流转中"){
          alert("请选择流转中的发票！");
          return;
        }
        if(buyerId == ""){
          buyerId = row["buyerId"];
        }else if(buyerId != row["buyerId"]){
          alert("请选择相同的单位报销！");
          return;
        }
      }
    }
    if (list == "") {
      alert("报销列表为空");
      return;
    }
    window.location = "/reimburse/add?buyerId="+buyerId+"&list="+list.substring(1);
  }

  genAddButton(){
    return <Button onClick={this.reimburse.bind(this)} bsStyle="primary" style={{float:"right",margin:"-5px 5px 0px 0",padding:"5px 20px 5px 20px"}}>报销</Button>;
  }

  render() {
    if(!this.state.rowList){
      return <div></div>;
    }
    var rows = this.genRows();
    var searchBar = "";
    if(this.props.searchBar){
      searchBar = (
        <form action={window.location.href.split('?')[0].split('#')[0]}>
            <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#" style={{fontSize:16}}>筛选：</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Navbar.Form pullLeft>
                {/*<FormGroup >
                  <FormControl type="text" name="q" placeholder="Search" defaultValue={this.props.keyword}/>
                </FormGroup>*/}
                {' '}
                {this.getSelector()}
                {' '}
                {/*<Button type="submit">提交</Button>*/}
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
            {this.genAddButton()}
          </div>
      );
    }
}
export default InvoiceList;
export {Row};