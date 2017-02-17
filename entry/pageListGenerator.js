import React from 'react'
import ReactDOM from 'react-dom'
import PageList from '../components/PageList'
import SortList from '../components/SortList'
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

if(pageParas.pageType && pageParas.pageType == "sortList"){
	ReactDOM.render(<SortList {...pageParas} keyword={ObjectUtil.getQueryString("q")} state={ObjectUtil.getQueryString("state")}/>,rootRow);
}
else{
	ReactDOM.render(<PageList {...pageParas} keyword={ObjectUtil.getQueryString("q")} state={ObjectUtil.getQueryString("state")}/>,rootRow);
}