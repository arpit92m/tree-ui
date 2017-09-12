import React, {Component} from 'react';
import axios from 'axios';


export class SwapModal extends Component{
constructor(props) {
        super(props);
        this.state={text:'',isFetching:false}
        this.saveText = this.saveText.bind(this);
        this.addData = this.addData.bind(this);
        this.searchText = this.searchText.bind(this);
    this.removeModal = this.removeModal.bind(this);

    }

    removeModal(){
      this.props.hideModal();
    }
     searchText(text){
      const {siblings} =this.props;
      var siblingIsPresent={}
      for(var i=0;i<siblings.length;i++) {
        if(siblings[i].text === text){
          return siblings[i];
        }
      }
      return false;
    }

    addData() {
    this.setState({isFetching:true})
     var siblingIsPresent = this.searchText(this.state.text)
     if(siblingIsPresent && siblingIsPresent.text!==this.props.node.text){
      var self=this;
     axios.post('https://thawing-spire-80596.herokuapp.com/updateNodes', {
    text:[this.props.node.text,siblingIsPresent.text],
    swapId:[this.props.node.id,siblingIsPresent.id]
  })
  .then(function (response) {
    self.setState({isFetching:false})
    self.props.swapNodes(siblingIsPresent.id);
  })
  .catch(function (error) {
    console.log(error);
  });
}
else {
  alert('no sibling found');
}
    }

    saveText(e) {
    	
    		this.setState({text:e.target.value})
    
    	

    }
    render() {
   
    	return (
    	<div className="container-modal">
    	<div className="modal-wrapper">
    	<div className="input-wrapper">
    <input type="text" className="inputContainer" onChange={this.saveText} placeholder="Enter node that needs to be replaced" name="text" required/>
   </div>
    <button type="submit" onClick={this.addData}>submit</button>
   <button type="button" className="cancelbtn" onClick={this.removeModal}>Cancel</button>
   </div>
   {
    this.state.isFetching && 
    <div className="loader-wrapper"><div className="loader"></div></div>
   }
  </div>
)
    }

}