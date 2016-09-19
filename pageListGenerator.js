import React from 'react'
import ReactDOM from 'react-dom'
import PageList from './components/PageList'
import ObjectUtil from './util/ObjectUtil'
import { Grid, Row, Col, Clearfix, Panel} from 'react-bootstrap'
require("./lib/bootstrap-theme.min.css")
require("./lib/bootstrap.min.css")

ReactDOM.render(
	<Grid>
	    <Row className="show-grid">
		  <Col xs={12} md={12} lg={12}>
		  	<Panel header={form_title}>
		  		<div id="tableRoot">loading...</div> 
		    </Panel>
		  </Col>
	      <Col xs={6} md={4}></Col>
	    </Row>
    </Grid>
	, document.getElementById("root"));
const rootRow = $('#tableRoot').get(0); 
ReactDOM.render(
	<PageList 
		activePage={parseInt(pageParas.activePage)} 
		totalPage={pageParas.totalPage} 
		url={pageParas.url} 
		editUrl={pageParas.editUrl} 
		addUrl={pageParas.addUrl} 
		columns={pageParas.column_filter} 
		identifier={pageParas.column_identifier}
		pageSize={pageParas.pageSize}
		/>,
	rootRow  
)