import React from 'react'
import ReactDOM from 'react-dom'
import DqTaskList from '../appCom/DqTaskList'
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
	      <Col xs={6} md={4}></Col>
	    </Row>
    </Grid>
	, document.getElementById("root"));
const rootRow = $('#tableRoot').get(0);
console.log(ObjectUtil.getQueryString("state"))
ReactDOM.render(
	<DqTaskList 
		{...pageParas}

		keyword={ObjectUtil.getQueryString("q")} 
		state={ObjectUtil.getQueryString("state")}

		/>,
	rootRow  
)
