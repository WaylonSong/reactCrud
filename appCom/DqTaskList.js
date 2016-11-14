import React from 'react'
import ReactDOM from 'react-dom'
import PageList,{Row} from '../components/PageList';

class DqRow extends Row{
	editRow(e){
		var department = "d2"
		if(this.props.data.source == "三科")
			department = "d3";
		window.location.href=this.props.editUrl+department+"/"+this.props.data[this.props.identifier]+"?pn="+window.location.hash.substring(1); 
    }
}

class DqTaskList extends PageList {
	genRows(){
		var identifier = this.props.identifier;
		var that = this;
    	var rowNo = (this.state.activePage-1)*this.state.pageSize + 1;

		return this.state.rowList.map(function(row){
			return <DqRow data={row} rowNo={rowNo++} filter={that.columnKeys} identifier={identifier} editUrl={that.props.editUrl}/>
		});
	}
}
export default DqTaskList;
