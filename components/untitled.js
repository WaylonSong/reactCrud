<FormGroup bgSize="lg" controlId={that.props.id} style={style} validationState={this.state.data.validateState}>
              <Col sm={2} style={{textAlign:"right",marginTop:"10px"}} componentClass={ControlLabel}>
                {notNullTag}{this.props.alias||this.props.name} 
              </Col>
              <Col sm={5} style={{textAlign:"right", paddingTop:"5px"}} >
                <FormControl  componentClass="select" onChange={this.changeCity.bind(this)}>
                    {options}
                </FormControl>
              </Col> 
              <Col sm={5}>
                <FormControl style={{textAlign:"left",marginTop:"5px"}} type="text" onChange={this.changeCity.bind(this)} componentClass={ControlLabel}>
                </FormControl>
                <HelpBlock>{this.state.data.errorMessage}</HelpBlock>
                <FormControl.Feedback style={{right:"15px",top:"4px"}}/>
              </Col>
            </FormGroup>