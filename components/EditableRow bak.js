import React, {
    Component,
    PropTypes
} from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal, Checkbox} from 'react-bootstrap';
import ObjectUtil from '../util/ObjectUtil';
import DateUtil from '../util/DateUtil';

class SimpleRow extends Component {
    constructor(props) {
        super(props);
        this.result = {};
        var validateState = "unknown";
        if(!this.props.validator){
            validateState = "";
        }
        var data = {name:this.props.name, value:this.props.value, validateState:validateState};
        if(this.props.type && this.props.type == "select")
            data.value = data.value || this.props.options[0];
        if(this.props.type && this.props.type == "checkbox")
            data.value = data.value || 0;
        this.state = {
            "data" : data
        };
    }
    componentDidMount(){
    }

    validate(){
        var data2 = this.state.data;
        if(data2.validateState == "error")
            return false;
        if(data2.validateState == "unknown"){
            var validateResult = this.validateAndSetState(data2);
            return data2.validateState != "error"
        }
        return true;
    }

    changeValue(event){
        if(this.props.onChange){
            this.props.onChange(event);
            return;
        }
        var data2 = this.state.data;
        data2["value"] = event.target.value;
        this.validateAndSetState(data2);
    }

    onCheck(event){
        var data2 = this.state.data;
        data2["value"] = event.target.checked;
        if(data2["value"])
            data2["value"] = 1;
        else
            data2["value"] = 0;
        this.setState({
            "data" : data2
        });
    }

    validateAndSetState(data2){
        var validateResult = this.validateByValue(data2.value);
        Object.assign(data2, validateResult);
        this.setState({
            "data" : data2
        });
        return validateResult;
    }

    validateByValue(value){
        if(!this.props.validator)
            return true;
        var properties = {
            "errorMessage" :"",
            "validateState" : ""
        };
        if(this.props.validator.notNull == true){
            if($.trim(value)===""){
                properties["validateState"] = 'error';
                properties["errorMessage"] = '字段不能为空';
            }
        }
        
        if(this.props.validator.dataType){
            switch(this.props.validator.dataType){
                case "number":
                    if((!value=="")&&!$.isNumeric(value)){
                        properties["validateState"] = 'error';
                        properties["errorMessage"] = '请填写数字';
                    }
                    break;
                // case "location":
                //     var reg = /.*[省市区县].*/;
                //     if((!value=="")&&!reg.test(value)){
                //         properties["validateState"] = 'error';
                //         properties["errorMessage"] = '请填写正确单位信息，需包含省、市、区或县等关键词';
                //     }
                //     break;
                case "email":
                    var reg = /.*@.+\..+/;
                    if((!value=="")&&!reg.test(value)){
                        properties["validateState"] = 'error';
                        properties["errorMessage"] = '请填写正确邮箱格式';
                    }
                    break;
                case "mobile":
                    if(!$.isNumeric(value) || value.length!=11){
                        properties["validateState"] = 'error';
                        properties["errorMessage"] = '请填写正确的手机号码';
                    }
                    break;
                case "time":
                    if(!DateUtil.checkDateTime(value, this.props.validator.pattern)){
                        properties["validateState"] = 'error';
                        properties["errorMessage"] = '请填写正确时间类型，例如:2016-01-01';
                    }

            
            }
        }
        var minLength,maxLength;
        if(minLength = this.props.validator.minLength){
            if(value && value.length < minLength){
                properties["validateState"] = 'error';
                properties["errorMessage"] = '字段最小长度应大于'+minLength;
            }
        }
        if(maxLength = this.props.validator.maxLength){
            if(value && value.length > maxLength){
                properties["validateState"] = 'error';
                properties["errorMessage"] = '字段最大长度不能大于'+maxLength;
            }
        }
        properties["value"] = value;
        return properties;
        
    }

    getResult(){
        var result = {};
        result[this.state.data.name] = this.state.data.value;
        return result;
    }

    render() {
        var type = this.props.type;
        var propsExt = {
            placeholder : this.props.placeholder,
            defaultValue : this.props.value,
            name : this.props.name,
            type : type,
            style: {marginTop:"5px"}
        };
        var options;
        var style = {overflow: "hidden", margin: "10px 0" }
        var hidden = "";
        if(type){
            switch (type) {
                case "delete":
                    return null;
                    break;
                case "textArea":
                case "textarea":
                    propsExt["componentClass"] = "textarea";
                    break;
                case "checkbox":
                    propsExt = {};              
                    propsExt["componentClass"] = "checkbox";
                    var checked = [];
                    if(this.props.value == "1" || this.props.value == 1 || this.props.value == true){
                        checked["checked"] = "true";
                    }
                    if(this.props.readOnly){
                        checked["disabled"] = "disabled"
                    }
                    return (
                        <FormGroup bgSize="lg" controlId={this.props.id} style={style} validationState={this.state.data.validateState}>
                              <Col sm={2} style={{textAlign:"right",paddingTop:"10px"}} componentClass={ControlLabel}>
                                {notNullTag}{this.props.alias||this.props.name} 
                              </Col> 
                                <Col sm={10}>
                                    <Checkbox name={this.props.name} onClick={this.onCheck.bind(this)} style={{marginLeft:"10px"}} {...checked}>点选{checked}</Checkbox>
                              </Col>
                        </FormGroup>
                    );
                    break;
                case "readOnly":
                    propsExt["value"] =  propsExt["defaultValue"];
                    delete propsExt["defaultValue"];
                    propsExt["readOnly"] = true;
                    break;
                case "hidden":
                    style["display"] = "none";
                    propsExt["type"] = "hidden";
                    break;
                case "select":
                    propsExt["componentClass"] = "select";
                    options = this.props.options.map(function(option,index){
                        return <option value={option}>{option}</option>;
                    });
                    break;
            }
        }else{
            propsExt["type"] = "text";
        }
        if(this.props.readOnly){
            propsExt["value"] =  propsExt["defaultValue"];
            delete propsExt["defaultValue"];
            propsExt["readOnly"] = true;
        }

        var notNullTag = "";
        if(this.props.validator){
            if(this.props.validator.notNull)
                notNullTag = "* "
        }
        return (
            <FormGroup bgSize="lg" controlId={this.props.id} style={style} validationState={this.state.data.validateState}>
              <Col sm={2} style={{textAlign:"right",paddingTop:"10px"}} componentClass={ControlLabel}>
                {notNullTag}{this.props.alias||this.props.name} 
              </Col> 
              <Col sm={10}>
                <FormControl  {...propsExt} onChange={this.changeValue.bind(this)} inputRef={ref => { this.input = ref}}>
                    {options}
                </FormControl>
                <HelpBlock>{this.state.data.errorMessage}</HelpBlock>
                <FormControl.Feedback style={{right:"15px",top:"4px"}}/>
              </Col>
            </FormGroup>
        );
    }
}

class SelectGroup extends Component {
    validate(){
        return true;
    }
    constructor(props) {
        super(props);
        this.state = {
            categoryTwoOptions : this.props.selector.categoryTwo[this.props.selectGroup[0].value||"组长"],
            data : {category:this.props.selectGroup[0].value||"组长", categoryTwo:this.props.selectGroup[1].value||"注射剂"}
        }
    }
    getResult(){
        return this.state.data;
    }
    change(event){
        this.setState({
            categoryTwoOptions:this.props.selector.categoryTwo[event.target.value],
            data:{category:event.target.value, categoryTwo:this.props.selector.categoryTwo[event.target.value][0]}
        });
    }
    changeTwo(event){
        this.setState({
            data:{category:this.state.data["category"], categoryTwo:event.target.value}
        });
    }
    render(){
        return (<div><SimpleRow name={this.props.selectGroup[0].name} alias={this.props.selectGroup[0].alias} 
            value={this.state.data.category} options={this.props.selector.category} type="select" onChange={this.change.bind(this)}/>
            <SimpleRow name={this.props.selectGroup[1].name} alias={this.props.selectGroup[1].alias} 
            value={this.state.data.categoryTwo} options={this.state.categoryTwoOptions} onChange={this.changeTwo.bind(this)} type="select"/></div>
        );
    }
}

class SelectAddableRow extends SimpleRow {
    constructor(props) {
        super(props);
        this.result = {};
        this.state = {
            "data" : null
        };
    }
    componentDidMount(props) {
        var array = [];
        array.push({value:this.props.value, type:this.props.selectorValue||this.props.category||this.props.type||this.props.selector[0], validateState:""});
        var data = {name:this.props.name};
        data["value"] = array;
        this.setState({
            "data" : data
        });
    }
    addSub(){
        var data2 = this.state.data;
        data2.value.push({value:"1", type:this.props.selector[0], validateState:""});
        this.setState({
            "data" : data2
        });
    }
    deleteSub(index){
        var data2 = this.state.data;
        data2.value.splice(index,1);
        this.setState({
            "data" : data2
        });
    }

    validate(){
        var flag = true;
        var data2 = this.state.data;
        for(var index in data2["value"]){
            if(data2["value"][index].validateState == "error")
                flag = false;
            else if(data2["value"][index].validateState == "unknown"){
                var validateResult = this.validateAndSetState(data2["value"][index]);
                Object.assign(data2["value"][index], validateResult);
                if(validateResult.validateState == "error")
                    flag = false;
            }
        }
        this.setState({
            "data" : data2
        });
        return flag;
    }

    changeValue(index, event){
        var data2 = this.state.data;
        data2["value"][index].value = event.target.value;
        var validateResult = this.validateByValue(event.target.value);
        Object.assign(data2["value"][index], validateResult);
        this.setState({
            "data" : data2
        });
    }
    changeType(index, event){
        var data2 = this.state.data;
        data2["value"][index].type = event.target.value;
        this.setState({
            "data" : data2
        });
    }
    getResult(){
        var result = {};
        var array = this.state.data.value;
        var resultArray = [];
        var col0 = this.props.columnNames[0]||"num";
        var col1 = this.props.columnNames[1]||"type";
        for(var i in array){
            var obj = {};
            obj[col0] = array[i].value;
            obj[col1] = array[i].type;
            resultArray.push(obj);
        }
        result[this.props.name] = resultArray;
        return result;
    }
    render() {
        if(this.state.data){
            var type = this.props.type;
            var options = this.props.selector.map(function(option,index){
                return <option value={option}>{option}</option>;
            });
            var style = {overflow: "hidden", margin: "10px 0" }
            var notNullTag = "";
            if(this.props.validator){
                if(this.props.validator.notNull)
                    notNullTag = "* "
            }
            var that = this;
            var formGroupList = this.state.data.value.map(function(group, index){
                var title;
                var button = <Button onClick={that.deleteSub.bind(that, index)}>-</Button>;
                if(index == 0){                   
                    title = that.props.alias||that.props.name;
                    button = <Button onClick={that.addSub.bind(that)}>+</Button>;
                }
                return (
                    <FormGroup bgSize="lg" controlId={that.props.id} style={style} validationState={group.validateState}>
                      <Col sm={2} style={{textAlign:"right",marginTop:"10px"}} componentClass={ControlLabel}>
                      {title}
                      </Col>
                      <Col sm={5} style={{textAlign:"right", paddingTop:"5px"}} componentClass={ControlLabel}>
                        <FormControl  value={group.type} componentClass="select" onChange={that.changeType.bind(that,index)}>
                            {options}
                        </FormControl>
                      </Col> 
                      <Col sm={4}>
                        <FormControl style={{textAlign:"left",marginTop:"5px"}} value={group.value} type="text" onChange={that.changeValue.bind(that,index)}>
                        </FormControl>
                        <HelpBlock>{group.errorMessage}</HelpBlock>
                        <FormControl.Feedback style={{right:"15px",top:"4px"}}/>
                      </Col>
                      <Col sm={1} style={{textAlign:"center" ,padding:"5px 0px"}} componentClass={ControlLabel}>
                        {button}
                      </Col> 
                    </FormGroup>
                );
            });
            return (
                <div>{formGroupList}</div>
            );
        }
        else{
            return <div></div>;
        }       
    }
}


class SelectAddHintRow extends SelectAddableRow {
    componentDidMount(props) {
        var array = [];
        array.push({value:this.props.value, type:this.props.selectorValue||this.props.category||this.props.type||this.props.selector[0], validateState:""});
        var data = {name:this.props.name};
        data["value"] = array;
        this.setState({
            "data" : data
        });
    }  
    addSub(){
        var data2 = this.state.data;
        data2.value.push({value:"", type:"", validateState:""});
        this.setState({
            "data" : data2
        });
    }
   
    render() {
        if(this.state.data){
            var type = this.props.type;
            var style = {"position":"relative","marginBottom":"0px"}
            var notNullTag = "";
            if(this.props.validator){
                if(this.props.validator.notNull)
                    notNullTag = "* "
            }
            //  var options = this.props.selector.map(function(option,index){
            //     return <option value={option}>{option}</option>;
            // });
            var that = this;
            var formGroupList = this.state.data.value.map(function(group, index){
                var title;
                var button = <Button onClick={that.deleteSub.bind(that, index)}>-</Button>;                    
                if(index == 0){
                    title = that.props.alias||that.props.name;                  
                    button = <Button onClick={that.addSub.bind(that)}>+</Button>;
                }
                return (
                    <FormGroup bgSize="lg" controlId={that.props.id} style={style} validationState={group.validateState}>
                      <Col sm={2} style={{textAlign:"right",marginTop:"10px"}} componentClass={ControlLabel}>
                      {title}
                      </Col>
                      <Col sm={5} style={{textAlign:"right"}} componentClass={ControlLabel}>
                         <HintInput />
                      </Col> 
                      <Col sm={4}>
                        <FormControl style={{textAlign:"left",marginTop:"5px"}} value={group.value} type="text" onChange={that.changeValue.bind(that,index)}>
                        </FormControl>
                        <HelpBlock>{group.errorMessage}</HelpBlock>
                        <FormControl.Feedback style={{right:"15px",top:"4px"}}/>
                      </Col>
                      <Col sm={1} style={{textAlign:"center" ,padding:"5px 0px"}} componentClass={ControlLabel}>
                        {button}
                      </Col> 
                       <div style={{"clear":"both"}}></div> 
                    </FormGroup>
                );
            });
            return (
                <div>{formGroupList}</div>
            );
        }
        else{
            return <div></div>;
        }       
    }    
    
    
   
}

class TypeValuePairRow extends SelectAddableRow{
    componentDidMount(props) {
    }
    render(){
        // var type = this.props.type||this.props.category;
        var style = {overflow: "hidden", margin: "10px 0" }
        var notNullTag = "";
        var that = this;

        var formGroupList = this.props.value.map(function(group, index){
            return (
                <FormGroup bgSize="lg" controlId={that.props.id} style={style} validationState={group.validateState}>
                  <Col sm={2} style={{textAlign:"right",marginTop:"10px"}} componentClass={ControlLabel}>
                  {group.category}
                  </Col>
                  <Col sm={4} style={{textAlign:"right", paddingTop:"5px"}} componentClass={ControlLabel}>
                    <FormControl  value={group.categoryTwo} readOnly="true" type="text">
                    </FormControl>
                  </Col> 
                  <Col sm={6} style={{textAlign:"left",marginTop:"5px"}}>
                    <FormControl  value={group.num} readOnly="true" type="text">
                    </FormControl>
                  </Col>
                </FormGroup>
            );
        });
        return (
            <div>{formGroupList}</div>
        );
    }
}

class CityValuePairRow extends SimpleRow{
    constructor(props) {
        super(props);
        this.state = {
            data : {attribution:"", work:"", validateState:"unknown", validateState2:"unknown",validateStatetemp:"unknown"}
        }
    }
    changeCity(event){
        var data2 = this.state.data;
        data2["attribution"] = event.target.value;
        this.validateAndSetState(data2, "attribution");
    }
    changeValue(event){
        var data2 = this.state.data;
        data2["work"] = event.target.value;
        this.validateAndSetState(data2, "value");
    }


    validate(){
        var data2 = this.state.data;
        if(data2.validateState == "error" || data2.validateState2 == "error"){
            console.log(data2.validateState)
            return false;
        }
        if(data2.validateState == "unknown" || data2.validateState2 == "unknown"){
            var validateResult = this.validateAndSetState(data2);
            if(validateResult.validateState == "error")
                return false;
            var validateResult2 = this.validateAndSetState(data2, "attribution");
            
            return validateResult2.validateState2 != "error" 
        }
        return true;
    }
    validateByCity(attribution){
        var properties = {
            "errorMessage2" :"",
            "validateState2" : ""
        };
        if(attribution == "" || attribution == "-选择归属地"){
            properties["errorMessage2"] = "请选择归属地";
            properties["validateState2"] = 'error';
        }
        return properties;
    }

    validateAndSetState(data2, type="value"){
        var validateResult;
        if(type == "value")
            validateResult = this.validateByValue(data2.work);
        else{
            validateResult = this.validateByCity(data2.attribution);
        }
        Object.assign(data2, validateResult);
        this.setState({
            "data" : data2
        });
        return validateResult;
    }

    getResult(){
        var result = this.state.data;
        result["work"] = this.state.data.work;
        result["attribution"] = this.state.data.attribution;
        return result;
    }

    render(){
        var propsExt = {
            placeholder : this.props.placeholder,
            value : this.props.value,
            name : this.props.name,
            type : "text",
            style: {marginTop:"5px"}
        };
        var style = {overflow: "hidden", margin: "10px 0" }
        var options = ["-选择归属地","省直","哈尔滨市"].map(function(option,index){
                return <option value={option}>{option}</option>;
            });
        var that = this;
        return (
            <FormGroup bgSize="lg" controlId={that.props.id} style={style} validationState={this.state.data.validateState}>
              <Col sm={2} style={{textAlign:"right",marginTop:"10px"}} componentClass={ControlLabel}>
                *{this.props.alias||this.props.name} 
              </Col>
              <Col sm={3} style={{textAlign:"right", paddingTop:"5px"}} >
                <FormControl  componentClass="select" ref="city" onChange={this.changeCity.bind(this)}>
                    {options}
                </FormControl>
                <HelpBlock>{this.state.data.errorMessage2}</HelpBlock>
              </Col> 
              <Col sm={7}>
                <FormControl {...propsExt} onChange={this.changeValue.bind(this)}>
                </FormControl>
                <HelpBlock>{this.state.data.errorMessage}</HelpBlock>
                <FormControl.Feedback style={{right:"15px",top:"4px"}}/>
              </Col>
            </FormGroup>
        );
    }
}

class ComplexRow extends SimpleRow{
    validate(){
        return true;
    }
    getResult(){
        var details = {};
        for(var r in this.refs){
            Object.assign(details,details, this.refs[r].getResult());
        }
        var result = {};
        if (this.props.value instanceof Array) {
            result[this.props.name] = [];
            result[this.props.name].push(details);
        }else
            result[this.props.name] = details;
        return result;
    }
    render(){
        var type = this.props.type;
        var propsExt = {
            name : this.props.name,
            style: {marginTop:"5px"}
        };
        var style = {overflow: "hidden", margin: "10px 0" };
        var data;
        if(this.props.value instanceof Array)
            data = this.props.value[0];
        else
            data = this.props.value;

        var details = [];
        var index = 0;
        for(var key in data){
            if(key in this.props.hiddens)
                continue;
            details.push(<SimpleRow name={key} alias={this.props.aliasDict[key]} value={data[key]} ref={"_"+index}/>);
            index++;
        }

        // var details = data.map(function(detail,index){
        //     return <SimpleRow name={detail[0]} alias={detail[1]} value={detail[2]?detail[2]:undefined} valueref={"_"+index}/>;
        // });
        return (
            <FormGroup bgSize="lg" controlId={this.props.id} style={style} validationState={this.state.data.validateState}>
              <Col sm={2} style={{textAlign:"right",paddingTop:"10px"}} componentClass={ControlLabel}>
                {this.props.alias||this.props.name} 
              </Col> 
              <Col sm={10}>
                {details}
                {/*<FormControl  {...propsExt} onChange={this.changeValue.bind(this)}>
                    {options}
                </FormControl>
                <HelpBlock>{this.state.data.errorMessage}</HelpBlock>
                <FormControl.Feedback style={{right:"15px",top:"4px"}}/>*/}
              </Col>
            </FormGroup>
        );    
    }
}

var listStyle={
   float:"left",
   paddingLeft:8,
   position:"absolute",
   minHeight:50,
   width:250,
   zIndex:10000,
   borderWidth:1,
   borderColor:"#ddd",
   borderStyle:"solid",
   listStyle:"none",
   backgroundColor:"#fff",
   top: "34px",
   left: "0px",  
   textAlign:"left" 
}

class HintGroupRow extends SimpleRow{
    constructor(props) {
        super(props);
        var validateState = "unknown";
        if(!this.props.validator){
            validateState = "";
        }
        this.index=0;
        var data = {name:this.props.name, value:this.props.value, validateState:validateState};
        this.state = {
           "data" : data,
           searchInfo:""
          }     
    }

    render(){
        var notNullTag = "";
        if(this.props.validator){
            if(this.props.validator.notNull)
                notNullTag = "* "
        }
        var style = {margin: "0" }
        return(
          <div id="hintInput" style={{"position":"relative"}}>
            <FormGroup  bgSize="lg" controlId={this.props.id} style={style} validationState={this.state.data.validateState}>       
              <Col sm={2} style={{textAlign:"right",paddingTop:"10px"}} componentClass={ControlLabel}>
                {notNullTag}{this.props.alias||this.props.name} 
              </Col>  
              <Col>
                <HintInput />
              </Col>
            </FormGroup>
        </div>   
        );
    }  
}

class HintInput extends SimpleRow{
    constructor(props) {
        super(props);
        var validateState = "unknown";
        if(!this.props.validator){
            validateState = "";
        }
        this.index=0;
        var data = {name:this.props.name, value:this.props.value, validateState:validateState};
        this.state = {
           "data" : data,
           searchInfo:""
          }     
    }
    changeValue(event){
        if(this.props.onChange){
            this.props.onChange(event);
            return;
        }
        var data2 = this.state.data;
        data2["value"] = event.target.value;
        this.validateAndSetState(data2);
        this.searchKeyword(event)
    }
    liClickSelected(e){
        var data2 = this.state.data;
        data2["value"] = e.target.innerText;
        this.validateAndSetState(data2);
        this.setState({
            searchInfo:"",
        });      
     }
    handleKeyPress(e){
        var code = e.keyCode;
        var lis=$(".selected>li");
        lis.removeClass("active");
        var firstLi=$(".selected>li:first-child");
        //console.log(firstLi);
        var lastLi=$(".selected>li:last-child");
        //firstLi.attr("class","selected");
        //下
        if (code == 40) {   
            if(this.index==($(".selected>li").length)){             
                return;
            }              
            $(lis[this.index]).addClass("active"); 
             this.index++;  
        }       

        //上
        if (code == 38) {         
            if(this.index==0){
               return;      
            }    
            this.index--;                   
            $(lis[this.index-1]).addClass("active");                           
        }         
        
        if (code == 13) {
            // this.refs.information.value=$(".selected>li")[this.index-1].innerText;
            //console.log($($(".selected>li")[this.index]));
            this.setState({
                searchInfo:""
            }); 
            var data2 = this.state.data;
            data2["value"] = $(".selected>li")[this.index-1].innerText;
            this.validateAndSetState(data2);        
            this.index=0;
        }
     }
    searchKeyword(e){
        this.index=0;
        let name = e.target.value;
        if(name == ""){
          this.setState({
            searchInfo : ""
          });
          return;
        }
        var initWords = ["计算机科学与技术","电子科学与技术","机械电子工程／生物医学工程（医疗机器人与仪器研究）","机械电子工程（康复医疗器械的研究）","机械电子工程","控制科学与工程","控制理论与控制工程","光电子技术、光物理","光学工程","药学检验","药理检验","临床检验","检验","医学检验","放射诊断","放射线、核医学","医学影像及放射线","超声诊断（影像医学）","超声诊断","口腔专业医疗设备仪器维修","肾脏疾病","肾内科、血液净化","中医外科临床教学","中医康复","中西医结合神经内科","中西医结合外科","中西医结合科","中西医结合耳鼻喉","免疫","神经病","精神科","肿瘤科","肿瘤血液","血液肿瘤科风湿科","血液病","血管外科","心血管内科","神经外科","神经内科","临床试验管理办公室","皮肤科","骨科","骨外科","妇产科","产科","消化、内分泌、腔镜","消化内科","内分泌科","老年呼吸科","物理诊断科","实验诊断部","口腔科","耳鼻喉科","呼吸内科","儿内科","感染内科","康复科","整形科","计算机中心","烧伤科"];
        var hintWords = initWords.filter(function(row){
            return row.indexOf(name)>-1;
        });
        this.setState({
            searchInfo : hintWords
        });
    }
    genUl(data){
        if(data == "")
          return "";
        var that = this;
        var i=0,j=0;
        var rows = data.map(function(row){
          i++;
          return <li key={i}  onClick={that.liClickSelected.bind(that)}>{row}</li>
        })
        return (
          <ul className="selected" style={listStyle}> 
              {rows}
          </ul> 
        );
    } 

    render() {
        var type = this.props.type;
        var propsExt = {
            placeholder : this.props.placeholder,
            value : this.state.data.value,
            name : this.props.name,
            type : type,
            style: {marginTop:"5px"}
        };
        var options;
        var style = {"marginBottom":"0px"}
        var hidden = "";
        propsExt["type"] = "text";
        var notNullTag = "";
        if(this.props.validator){
            if(this.props.validator.notNull)
                notNullTag = "* "
        }
        var ul = this.genUl(this.state.searchInfo);
        return (
        <div id="hintInput" style={{"position":"relative"}}>
            <FormGroup  bgSize="lg" controlId={this.props.id} style={style} validationState={this.state.data.validateState}>        
              <Col>
                <FormControl  {...propsExt} onChange={this.changeValue.bind(this)} onKeyDown={this.handleKeyPress.bind(this)}  >
                </FormControl>
                <HelpBlock>{this.state.data.errorMessage}</HelpBlock>
                <FormControl.Feedback style={{right:"15px",top:"4px"}}/>
              </Col>
            </FormGroup>
              {ul} 
           
        </div>    
        );
    }
}


export {SimpleRow, SelectAddableRow, TypeValuePairRow, SelectGroup, CityValuePairRow, ComplexRow, HintInput, HintGroupRow, SelectAddHintRow};
