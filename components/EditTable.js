import React, {
	Component,
	PropTypes
} from 'react';
import { Button, Table, Input } from 'reactstrap';


class EditRow extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	var type = this.props.type;
	    var readOnly = false;
	    var value = "defaultValue";
	    var options;

		var inputProps = {
			type: "text",
			defaultValue : this.props.value
		};

	    if(type){
			switch (type) {
				case "readOnly":
					inputProps["value"] =  inputProps["defaultValue"];
					delete inputProps["defaultValue"];
					break;
				case "select":
					options = this.props.options.map(function(option){
						return <option>{option}</option>
					});
				default:
					inputProps["type"] = type;
			}
	    }
        return (
            <tr><td>{this.props.name}</td><td><Input {...inputProps}>{options}</Input></td></tr>
        );
    }
}


class EditTable extends Component {

	componentDidMount() {
	}

	constructor(props) {
		super(props);
		this.state ={

		};
	}

	submit(){
		alert("submit");
	}

	render() {
		var data = this.props.data;
		var rows = data.map(function(row){
					console.log(row.name)
	        		return <EditRow name={row.name} value={row.value} type={row.type}/>
	        	});
		return (
		<div>
	      <Table  striped bordered condensed hover>
	        <thead>
	          <tr>
	            <th>属性</th>
	            <th>输入</th>
	          </tr>
	        </thead>
	        <tbody>
	        	{rows}
	        </tbody>
	        
	      </Table>
			<Button color="primary" onClick={this.submit}>提交</Button>
	      </div>
    	);
	}

}
export default EditTable;