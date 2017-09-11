import React, {Component} from 'react';
import axios from 'axios';


export class AddModal extends Component{
constructor(props) {
        super(props);
        this.state={text:'',desc:''}
        this.addData = this.addData.bind(this);
        this.saveText = this.saveText.bind(this);
        this.removeModal = this.removeModal.bind(this);

    }

    removeModal(){
    	this.props.hideModal();
    }

    addData() {
    	var self = this;
     axios.post('http://localhost:3001/addNode', {
    parent:this.props.node,
    child:{parent:this.props.node.text,text:this.state.text,parentChain:this.props.node.parentChain}
  })
  .then(function (response) {
  	if(response==="same name"){
  		alert("plase give a different name")
  	}
  	else{
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
    	else{
    		this.setState({desc:e.target.value})
    	}

    }
    render() {
   
    	return (
    	<div className="container-modal">
    	<div className="modal-wrapper">
    	<div className="input-wrapper">
    <input type="text" className="inputContainer" onChange={this.saveText} placeholder="Enter text" name="text" required/>
    </div>
    <button type="submit" onClick={this.addData}>submit</button>
   <button type="button" onClick={this.removeModal}className="cancelbtn">Cancel</button>
   </div>
  </div>
)
    }

}