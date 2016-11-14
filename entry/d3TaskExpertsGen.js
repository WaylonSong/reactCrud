import React from 'react'
import ReactDOM from 'react-dom'
import {TaskDtoD3} from '../appCom/TaskDtoForm'
import ObjectUtil from '../util/ObjectUtil'
import ExpertListDq from '../appCom/ExpertListDq'
import { Grid, Row, Col, Clearfix, Panel} from 'react-bootstrap'

ReactDOM.render(
	<Grid>
	    <Row className="show-grid">
		  <Col lg={8} md={8} className="editForm">
		  	<Panel header={pageParas.title}>
		  		<div id="tableRoot">loading...</div> 
		    </Panel>
		  </Col>
	      <Col lg={10} md={10}><div id="expertDiv"></div></Col>
		  		
	    </Row>
    </Grid>
	, document.getElementById("root"));
const rootRow = $('#tableRoot').get(0); 
const expertDiv = $('#expertDiv').get(0); 
ReactDOM.render(
	<TaskDtoD3 {...pageParas}/>,
	rootRow  
)
window.document.addEventListener("genExperts", function (e) {
	ReactDOM.render(
		<ExpertListDq taskId={id}/>,
		expertDiv  
	)
}, false);

