import React, { Component, PropTypes } from 'react';
import { Pagination, Table, Button, Navbar, FormGroup, FormControl} from 'react-bootstrap';
import { Grid, Row, Col, Clearfix, Panel} from 'react-bootstrap'
import Modal from 'react';
import ReactDOM from 'react-dom'

import ModalDialog from '../components/ModalDialog'
import {TaskDtoD3, TaskDtoD2} from './TaskDtoForm'
import ObjectUtil from '../util/ObjectUtil'
import ExpertListDq from './ExpertListDq'
import TaskExpertList from './TaskExpertList'


class DqTaskExpert extends TaskExpertList{

	callback(taskState){
        this.genButtons.bind(this);
        this.genButtons(taskState);
        if(taskState != "处理中"){
        	if(taskState == "已生成" || taskState == "变更中")
				this.genConfirmButton();
        	this.setState({taskState:taskState});
        }
    }

	genButtons(taskState){
        //只有在dq中才有生成专家列表按钮
        if(taskState == "处理中"){
            ReactDOM.render(<Button className="noprint" onClick={() => {this.fireGenExperts()}}
                bsStyle="primary" style={{marginTop:"10px"}}>生成专家列表</Button>,
               	document.getElementById('genExpertsBtn'));
        }
    }
    
    genExpertList(){
        return (<ExpertListDq ref="expertList" taskId={this.props.taskId} department={this.props.department} 
        	taskState={this.state.taskState} replaceUrl={this.props.replaceUrl} taskExpertsUrl={this.props.taskExpertsUrl} genExpertsUrl={this.props.genExpertsUrl}/> );
    }

    confirm(){
    	this.refs["modalDialog"].setState({
    		modalShow: false
    	});
    	if(this.state.operation == "confirmExperts"){
            $.ajax({
                type: "put",
                url: this.props.confirmUrl,
                dataType: 'json',
                contentType : 'application/json',
                success: this.defaultSuccess.bind(this),
                error: this.defaultError.bind(this)
            });
    	}else if(this.state.operation == "redirect"){
            this.redirect();
        }
    }

    redirect(){
        ObjectUtil.redirectOrGoBack("/dq/list#1");
    }

    confirmExperts(){
    	this.setState({
    		operation: "confirmExperts"
    	});
    	this.refs["modalDialog"].setState({
    		modalShow: true,
            modalBody:"确认专家",
            modalType:"confirmAndCancel",
    	});
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

    fireGenExperts(){
        this.setState({genButtonDisabled:"none",taskState:"生成中"});
		this.genConfirmButton();
    }

    genConfirmButton(){
    	ReactDOM.render(<Button bsStyle="primary" onClick={this.confirmExperts.bind(this)}>确定名单</Button>,
               	document.getElementById('buttons'));
    }

}


export default DqTaskExpert;