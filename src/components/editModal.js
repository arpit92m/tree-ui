import React, {Component} from 'react';
import axios from 'axios';


export class EditModal extends Component{
constructor(props) {
        super(props);
        this.state={text:'',isFetching:false}
        this.saveText = this.saveText.bind(this);
        this.addData = this.addData.bind(this);
        this.removeModal = this.removeModal.bind(this);
        this.initialCheck = this.initialCheck.bind(this);

    }

    removeModal(){
      this.props.hideModal();
    }

    initialCheck(){
       if(this.state.text === ""){
        alert("Name can't be empty");
       }
       else{
        this.addData();
       }
    }

    addData() {
      var self=this;
      this.setState({isFetching:true})
      if(this.state.text===this.props.node.text){
        alert("name can't be same")
      }
      else{
     axios.post('https://thawing-spire-80596.herokuapp.com/editNode', {
      id:this.props.node.id,
      text:this.state.text,
      originalText:this.props.node.text
  })
  .then(function (response) {
    self.setState({isFetching:false})
    self.props.nodeEdited(self.state.text);
  })
  .catch(function (error) {
    console.log(error);
  });
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
    <input type="text" className="inputContainer" onChange={this.saveText} placeholder="Edit Name" name="text" required/>
   </div>
    <button type="submit" onClick={this.initialCheck}>submit</button>
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