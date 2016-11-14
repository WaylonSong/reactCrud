import React from 'react'
import ReactDOM from 'react-dom'
import {TaskDtoD3} from '../appCom/TaskDtoForm'
import ObjectUtil from '../util/ObjectUtil'
import DqTaskExpert from '../appCom/DqTaskExpert'
import { Grid, Row, Col, Clearfix, Panel} from 'react-bootstrap'

ReactDOM.render(<DqTaskExpert {...pageParas}/>, document.getElementById("root"));

