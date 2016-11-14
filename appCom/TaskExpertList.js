import React, { Component, PropTypes } from 'react';
import { Pagination, Table, Button, Navbar, FormGroup, FormControl} from 'react-bootstrap';
import { Grid, Row, Col, Clearfix, Panel} from 'react-bootstrap'
import Modal from 'react';
import ReactDOM from 'react-dom'

import ModalDialog from '../components/ModalDialog';
import {TaskDtoD3, TaskDtoD2} from './TaskDtoForm'
import ObjectUtil from '../util/ObjectUtil'
import ExpertList from './ExpertListDepEdit'


class TaskExpertList extends Component{
	constructor(props) {
	  super(props);
	  this.state = {
	  	operation :"",
        genButtonDisabled : "block",
        taskState :""
	  };
	}
	alter(){
    	this.setState({
    		operation: "alter"
    	});
    	this.refs["modalDialog"].setState({
    		modalShow: true,
            modalBody:"修改任务",
            modalType:"confirmAndCancel",
    	});
    }
    cancel(){
    	this.setState({
    		operation: "cancel"
    	});
    	this.refs["modalDialog"].setState({
    		modalShow: true,
            modalBody:"取消任务",
            modalType:"confirmAndCancel",
    	});
    }
    redirect(){
        ObjectUtil.redirectOrGoBack(this.props.redirectUrl);
    }
    confirm(){
    	this.refs["modalDialog"].setState({
    		modalShow: false
    	});
    	if(this.state.operation == "alter"){
            console.log(this);
            var data = {};
            data["taskId"] = this.props.taskId;
            data["expertsIdList"] = this.refs["expertList"].getSelectedRows();
            if(data["expertsIdList"].length == 0){
                alert("更换列表不能为空！");
                return;
            }
            $.ajax({
                type: "put",
                url: this.props.alterUrl,
                data: JSON.stringify(data),
                dataType: 'json',
                contentType : 'application/json',
                success: this.defaultSuccess.bind(this),
                error: this.defaultError.bind(this)
            });

    	}else if(this.state.operation == "redirect"){
            this.redirect();
        }else if(this.state.operation == "cancel"){
            $.ajax({
                type: "delete",
                url: this.props.cancelUrl,
                // data: JSON.stringify(data),
                dataType: 'json',
                contentType : 'application/json',
                success: this.defaultSuccess.bind(this),
                error: this.defaultError.bind(this)
            });
    	}
    	for(var i in this.refs){
    		if(i == "modalDialog")
    			continue;	
    	}
    }

    defaultSuccess(){
        this.refs["modalDialog"].setState({
            modalShow: true,
            modalBody:"操作成功",
            modalType:"redirect",
        });
        this.setState({
            operation:"redirect"
        });
    }

    defaultError(){
        this.refs["modalDialog"].setState({
            modalShow: true,
            modalBody:"操作失败",
            modalType:"cancel",
        });
    }

    callback(taskState){
        this.genButtons.bind(this);
        this.genButtons(taskState);
        // this.genExpertList(args);
        this.setState({
            taskState : taskState
        });
    }

    

    genButtons(taskState){
        if(taskState == "已完成"){
            ReactDOM.render(<div style={{textAlign:"center",marginBottom:"100px"}}><Button bsStyle="warning" onClick={this.alter.bind(this)}>变更请求</Button>
               &nbsp;&nbsp;&nbsp;<Button bsStyle="danger" onClick={this.cancel.bind(this)}>取消任务</Button></div>,
               document.getElementById('buttons'));
        }
    }

    componentDidMount(){
        // this.refs["buttons"].setState({"taskState" : this.taskState});
    }

    genTaskDto(){
        if(this.props.department && this.props.department == "d3"){
            return <TaskDtoD3 ref="task" {...this.props} dataRetrieved={this.callback.bind(this)}/>
        }else
            return <TaskDtoD2 ref="task" {...this.props} dataRetrieved={this.callback.bind(this)}/>
    }

    genExpertList(){
        return (<ExpertList ref="expertList" taskState={this.state.taskState} taskExpertsUrl={this.props.taskExpertsUrl} department={this.props.department}/>);
    }

    render() {
        return (
        	<Grid>
			    <Row className="show-grid">
				  <Col lg={8} md={8}>
				  	<Panel header={this.props.title}>
				  		{this.genTaskDto()}
                        <div id="genExpertsBtn" style={{textAlign:"center", display:this.state.genButtonDisabled}}></div>
				    </Panel>
				  </Col>
                  <Col md={10}>
                    <div id="expertListDiv">{this.genExpertList()}</div>
                    <div id="buttons" style={{textAlign:"center"}}></div>
                  </Col>

			    </Row>
			    <ModalDialog ref="modalDialog" confirm={this.confirm.bind(this)} redirect={this.redirect.bind(this)}/>
		    </Grid>
	    );
    }
}

export default TaskExpertList;
