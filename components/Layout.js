import React from 'react'
import ReactDOM from 'react-dom'
// import EditTable from './components/EditTable'
import EditForm from './components/EditForm'
import { Grid, Row, Col, Clearfix, Panel} from 'react-bootstrap'

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
	<EditForm data = {table_init} />,
	rootRow  
)


// promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars')}
