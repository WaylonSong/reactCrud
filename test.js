import React from 'react'
import ReactDOM from 'react-dom'
// import EditTable from './components/EditTable'
import EditForm from './components/EditForm'
import ObjectUtil from './util/ObjectUtil'
import { Grid, Row, Col, Clearfix, Panel} from 'react-bootstrap'
require("./lib/bootstrap-theme.min.css")
require("./lib/bootstrap.min.css")
// import $ from './lib/jquery-2.2.1.min.js'

var table_init = [
	{id:"price", placeholder:"1.00"},
	{id:"state", placeholder:"1"},
	{id:"storageCount", placeholder:"100"},
	{id:"description", placeholder:"测试描述", type:"textarea"},
	{id:"shopInfoId", placeholder:"500dba0a-64a0-47b4-a5a8-c3e77b0eacb3"},
	{id:"medicineId", placeholder:"a9c60f29-49ff-45fe-9761-4accdc2fd29d"}
];

var extraProperties = [
	{id:"price", name:"价格"},
	{id:"state", name:"状态", type:"select", options:["上架","下架"]},
	{id:"storageCount", name:"库存"},
	{id:"description", name:"描述"},
	{id:"shopInfoId", name:"商品ID"},
	{id:"medicineId", name:"药品ID"}
];

ObjectUtil.mergeData(table_init, extraProperties);
console.log(table_init);

ReactDOM.render(
	<Grid>
	    <Row className="show-grid">
		  <Col xs={12} md={8}>
		  	<Panel header="添加表单">
		  		<div id="tableRoot">loading...</div> 
		    </Panel>
		  </Col>
	      <Col xs={6} md={4}></Col>
	    </Row>
    </Grid>
	, document.getElementById("root"));
const rootRow = $('#tableRoot').get(0); 
ReactDOM.render(
<EditForm data = {table_init} url="/" method="post"/>,
rootRow  
)

// promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars')}
