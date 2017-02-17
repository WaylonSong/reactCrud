import React, {
  Component,
  PropTypes
} from 'react';
import { Table, Button, Navbar, FormGroup, FormControl, Checkbox} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
          switch: false
        }
        this.retNum = "";
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
      {/*利用图片撑开最小高度*/}
          <td style={{visibility:"hidden",width:"0px",padding:0,margin:0}}><img style={{float:"left",minHeight:"40px",visibility:"hidden"}}/></td>
        </tr>
      );
    }
}

class SortList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskState: this.props.state
    };
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
      this.vhs.push(<th style={{textAlign:"center"}}>查看</th>);
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
    if(this.state.rowList && this.state.rowList.length > 0 ){
      return this.state.rowList.map(function(row){
        return <Row ref={"_"+rowNo} data={row} rowNo={rowNo++} filter={that.columnKeys} identifier={identifier} editUrl={that.props.editUrl}/>
      });
    }else{
      return <tr><td colSpan="8">数据列表为空！</td></tr>;
    }
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
                <FormGroup >
                  <FormControl type="text" name="q" placeholder="Search" defaultValue={this.props.keyword}/>
                </FormGroup>
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
          </div>
      );
    }
}
export default SortList;
export {Row};


