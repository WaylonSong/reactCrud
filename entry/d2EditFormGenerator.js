import React from 'react'
import ReactDOM from 'react-dom'
import {EditFormD2} from '../appCom/EditFormDepartment'
import ObjectUtil from '../util/ObjectUtil'
import { Grid, Row, Col, Clearfix, Panel} from 'react-bootstrap'

ReactDOM.render(
	<Grid>
	    <Row className="show-grid">
		  <Col xs={8} md={8} className="editForm">
		  	<Panel header={pageParas.title}>
		  		<div id="tableRoot">loading...</div> 
		    </Panel>
		  </Col>
	      <Col xs={10} md={10}></Col>
	    </Row>
    </Grid>
	, document.getElementById("root"));
const rootRow = $('#tableRoot').get(0); 
ReactDOM.render(
	<EditFormD2 {...pageParas}/>,
	rootRow  
)
