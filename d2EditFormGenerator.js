import React from 'react'
import ReactDOM from 'react-dom'
import EditFormD2 from './components/EditFormD2'
import ObjectUtil from './util/ObjectUtil'
import { Grid, Row, Col, Clearfix, Panel} from 'react-bootstrap'

ReactDOM.render(
	<Grid>
	    <Row className="show-grid">
		  <Col xs={12} md={8}>
		  	<Panel header={pageParas.title}>
		  		<div id="tableRoot">loading...</div> 
		    </Panel>
		  </Col>
	      <Col xs={6} md={4}></Col>
	    </Row>
    </Grid>
	, document.getElementById("root"));
const rootRow = $('#tableRoot').get(0); 
ReactDOM.render(
	<EditFormD2 {...pageParas}/>,
	rootRow  
)
