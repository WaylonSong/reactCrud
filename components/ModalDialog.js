import React, { Component, PropTypes } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal} from 'react-bootstrap';

class ModalDialog extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  	modalShow:false||this.props.modalShow,
        modalBody:"",
        modalType:"",
	  };
	}

	closeModal(){
    	this.setState({ modalShow: false});
    	if(this.state.modalType == "redirect")
    		this.props.redirect();
	}

    render() {
    	var modalButtons;
    	if(this.state.modalType == "confirmAndCancel")
    		modalButtons = <div><Button bsStyle="primary" onClick={this.props.confirm}>确认</Button>
		            <Button onClick={this.closeModal.bind(this)}>关闭</Button></div>;
		else if(this.state.modalType == "confirm")
			modalButtons = <div><Button bsStyle="primary" onClick={this.props.confirm}>确认</Button></div>;
		else if(this.state.modalType == "cancel")
			modalButtons = <div><Button onClick={this.closeModal.bind(this)}>关闭</Button></div>;
		else if(this.state.modalType == "redirect")
			modalButtons = <div><Button onClick={this.props.redirect}>关闭</Button></div>;
        return (
            <div className="modal-container">
		        <Modal
		          show={this.state.modalShow}
		          onHide={this.closeModal.bind(this)}
		          container={this}
		          aria-labelledby="contained-modal-title"
		        >
		          <Modal.Body>
		            	{this.state.modalBody}
		          </Modal.Body>
		          <Modal.Footer style={{textAlign:"center"}}>
			            {modalButtons}
		          </Modal.Footer>
		        </Modal>
		    </div>
        );
    }
}

export default ModalDialog;
