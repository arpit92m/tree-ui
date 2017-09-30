import React, {Component} from 'react';
import axios from 'axios';


export class AddModal extends Component{
constructor(props) {
        super(props);
        this.state={text:'',desc:'',isFetching:false}
        this.addData = this.addData.bind(this);
        this.saveText = this.saveText.bind(this);
        this.initialCheck = this.initialCheck.bind(this);

    }


    initialCheck(){
       if(this.state.text === ""){
        alert("Child name can't be empty");
       }
       else{
        this.addData();
       }
    }

    addData() {
    	var self = this;
    	this.setState({isFetching:true})
     axios.post('https://thawing-spire-80596.herokuapp.com/addNode', {
    parent:this.props.node,
    child:{parent:this.props.node.text,text:this.state.text,parentChain:this.props.node.parentChain,level:this.props.level}
  })
  .then(function (response) {
  	if(response.data==="same name"){
  		alert("please give a different name")
      self.props.hideModal();
  	}
  	else{
  		self.setState({isFetching:false})
  	self.props.addNewData(response.data.ops[0]);
  }
  })
  .catch(function (error) {
    console.log(error);
  });
    }

    saveText(e) {
    	if(e.target.name==='text') {
    		this.setState({text:e.target.value})
    	}

    }
    render() {
   
    	return (
    	<div className="container-modal">
    	<div className="modal-wrapper">
    	<div className="input-wrapper">
    <input type="text" className="inputContainer" onChange={this.saveText} placeholder="Enter text" name="text" required/>
    </div>
    <button type="submit" onClick={this.initialCheck}>submit</button>
   <button type="button" onClick={this.props.hideModal.bind(null)}className="cancelbtn">Cancel</button>
   </div>
   {
    this.state.isFetching && 
    <div className="loader-wrapper"><div className="loader"></div></div>
   }
  </div>
)
    }

}