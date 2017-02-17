import React from 'react'
import ReactDOM from 'react-dom'
import PageList from '../components/PageList'
import InvoiceList from '../oxchains/InvoiceList'
import ReimburseList from '../oxchains/ReimburseList'
import ObjectUtil from '../util/ObjectUtil'
import { Grid, Row, Col, Clearfix, Panel} from 'react-bootstrap'

ReactDOM.render(
	<Grid>
	    <Row className="show-grid">
		  <Col md={10}>
		  	<Panel header={form_title}>
		  		<div id="tableRoot">loading...</div> 
		    </Panel>
		  </Col>
	      <Col md={10}></Col>
	    </Row>
    </Grid>
	, document.getElementById("root"));
const rootRow = $('#tableRoot').get(0);
console.log(ObjectUtil.getQueryString("state"))
if(pageParas.pageType == "invoiceList"){
	ReactDOM.render(
		<InvoiceList {...pageParas} keyword={ObjectUtil.getQueryString("q")} state={ObjectUtil.getQueryString("state")}/>, rootRow  
	)
}else if(pageParas.pageType == "reimburseList"){
	ReactDOM.render(
		<ReimburseList {...pageParas} keyword={ObjectUtil.getQueryString("q")} state={ObjectUtil.getQueryString("state")}/>, rootRow  
	)
}
else{
	ReactDOM.render(
		<PageList {...pageParas} keyword={ObjectUtil.getQueryString("q")} state={ObjectUtil.getQueryString("state")}/>, rootRow  
	)
}
