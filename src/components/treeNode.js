import React, {Component} from 'react';
import axios from 'axios';
import {AddModal} from './addModal';
import {SwapModal} from './swapModal';
import {EditModal} from './editModal';

export class TreeNode extends Component {
    constructor(props) {
        super(props);
        this.state={toggleValues:[],parentData:[],childData:[],showAddModal:false,showSwapModal:false,addedToNode:{},swappedNode:{},editedNode:{},showEditModal:false}

        this.showChildData = this.showChildData.bind(this);
        this.sortAccordingToLastIndex = this.sortAccordingToLastIndex.bind(this);
        this.initializeToggleValue = this.initializeToggleValue.bind(this);
        this.initializeChildData = this.initializeChildData.bind(this);
        this.showAddModal = this.showAddModal.bind(this);
        this.showSwapModal = this.showSwapModal.bind(this);
        this.setToggleValuesTrue = this.setToggleValuesTrue.bind(this);
        this.removeNode = this.removeNode = this.removeNode.bind(this);
        this.hideAddModal = this.hideAddModal.bind(this);
        this.removeFromTree = this.removeFromTree.bind(this);
        this.addNewData = this.addNewData.bind(this);
        this.swapNodes = this.swapNodes.bind(this);
        this.hideSwapModal = this.hideSwapModal.bind(this);
        this.editText = this.editText.bind(this);
        this.hideEditModal = this.hideEditModal.bind(this);
        this.nodeEdited = this.nodeEdited.bind(this);
      
        }

        componentWillMount() {
          const {data,level} = this.props;
          this.sortAccordingToLastIndex(data);
          this.initializeToggleValue(data.length);
          this.initializeChildData(data.length);
          

        }


        hideEditModal(){
         this.setState({showEditModal:false})
        }

        swapNodes(swapId){
          const{swappedNode,parentData} = this.state;
          var parentDataCopy = parentData,selectedSwappedNodeIndex=swappedNode.id.split("_")[1]*1,changedSwappedNodeIndex=swapId.split("_")[1]*1;

          parentDataCopy[selectedSwappedNodeIndex].id = swapId;
           parentDataCopy[changedSwappedNodeIndex].id = swappedNode.id;
          var updatedChildData=this.state.childData
          updatedChildData[changedSwappedNodeIndex] = this.state.childData[selectedSwappedNodeIndex]
          updatedChildData[selectedSwappedNodeIndex] = this.state.childData[changedSwappedNodeIndex]
         
          this.setState({parentData:parentDataCopy,showSwapModal:false,childData:updatedChildData},()=>{
            this.sortAccordingToLastIndex(parentData);
            this.initializeToggleValue(parentData);
          })
        }

        addNewData(newNode){
          const {parentData,toggleValues} = this.state;
           var length = parentData.length,parentIndex;
           for(var i=0;i<length;i++){
            if(parentData[i].text===newNode.parent){
              parentIndex=i;
            }
           }
           var updatedChildData=this.state.childData,toggleData = toggleValues;
           toggleData[parentIndex]=true;

           updatedChildData[parentIndex].push(newNode);
           this.setState({childData:updatedChildData,showAddModal:false,toggleValues:toggleData})
        }

        nodeEdited(textAfterEdit){
          const {editedNode,parentData,childData} = this.state;
          var parentDataCopy = parentData,editedNodeIndex=editedNode.id.split("_")[1]*1,childDataCopy=this.state.childData;
          parentDataCopy[editedNodeIndex].text = textAfterEdit;
          this.setState({parentData:parentDataCopy, showEditModal:false},()=>{
            this.initializeToggleValue(parentData)
          })
        }

        editText(e){
           this.setState({showEditModal:true,editedNode:{text:e.target.getAttribute('data-value'),id:e.target.getAttribute('data-id')}})
        }

        removeFromTree(idx){
          var toggleCopy=this.state.toggleValues,parentDataCopy=this.state.parentData,childDataCopy=this.state.childData
          toggleCopy.splice(idx,1);
          parentDataCopy.splice(idx,1);
          childDataCopy.splice(idx,1)
          this.setState({toggleValues:toggleCopy,parentData:parentDataCopy,childData:childDataCopy})
        }

        hideAddModal() {
          this.setState({showAddModal:false})
        }

        hideSwapModal() {
          this.setState({showSwapModal:false})
        }

        removeNode(e) {
         
        var self =this,removedIndex=e.target.getAttribute('data-id').split("_")[1]*1;
         axios.post('http://localhost:3001/removeAllNodes',{
          id:e.target.getAttribute('data-id'),
          parentChain:this.props.parentChain,
          parentText:this.state.parentData[0].parent,
          text:this.state.parentData[0].text
         })
  .then(function (response) {
    self.removeFromTree(removedIndex)
  })
  .catch(function (error) {
    console.log(error);
  });
        }

        setToggleValuesTrue() {
             var i=0,toggleData=this.state.toggleValues;
            while(i<toggleData.length){
               toggleData[i]=true;
               i++;
            }
            this.setState({toggleValues:toggleData})
        }

        showAddModal(e) {
          this.setState({showAddModal:true,addedToNode:{text:e.target.getAttribute('data-value'),id:e.target.getAttribute('data-id'),parentChain:this.props.parentChain+"_"+e.target.getAttribute('data-value')}});
        }


        showSwapModal(e) {
          this.setState({showSwapModal:true,swappedNode:{text:e.target.getAttribute('data-value'),id:e.target.getAttribute('data-id'),parent:this.state.parentData[0].parent}});
        }

        initializeToggleValue(length){
          var i=0,toggleData=[];
            while(i<length){
               toggleData.push(false)
               i++;
            }
            this.setState({toggleValues:toggleData})
        }  

        initializeChildData(length){
          var i=0,childValues=[];
            while(i<length){
               childValues.push([])
               i++;
            }
            this.setState({childData:childValues})
        }


     sortAccordingToLastIndex(data){
      this.setState({parentData:data.sort(function(a,b){
        return a.id.split("_")[1] - b.id.split("_")[1]
      })
    })
     }


     showChildData(e) {
      var parentIndex=e.target.id.split("_")[1]
      if(!this.state.toggleValues[parentIndex]){
      var toggleCopy = this.state.toggleValues,self=this;
      toggleCopy[parentIndex]=true
     axios.get('http://localhost:3001/findAllNodes?parent='+e.target.innerText)
  .then(function (response) {

    let nodes=response.data,childValues=self.state.childData;
    childValues[parentIndex]=nodes;
    self.setState({childData:childValues,toggleValues:toggleCopy})
    })
  .catch(function (error) {
    console.log(error);
  });
}
else{
  var toggleCopy = this.state.toggleValues;
      toggleCopy[parentIndex]=false;
      this.setState({toggleValues:toggleCopy})
}
}
       
        
        render() {
        const {parentData,toggleValues,childData,showSwapModal,showAddModal,addedToNode,collapse,swappedNode,editedNode,showEditModal} = this.state;
		return (
		      <div id='app-container' className='container'>
                {/* Header content , common for entire application */}   
          <div>
            <ul>
          {parentData.map((value,index)=>{
            return ( <div>
              <li ><span><a href="#" onClick={this.showChildData} id={value.parent+"_"+index}>{value.text}</a><span onClick = {this.showAddModal}><i className="fa fa-plus-circle fa-2x"  data-id={value.parent+"_"+index} data-value = {value.text}></i></span><i onClick = {this.removeNode} className="fa fa-minus-circle fa-2x"  data-id={value.parent+"_"+index} data-value = {value.text}></i><i className="fa fa-refresh fa-2x" data-id={value.parent+"_"+index} data-value = {value.text} onClick ={this.showSwapModal} aria-hidden="true"></i><i className="fa fa-pencil-square-o fa-2x" data-value = {value.text} onClick={this.editText} data-id={value.parent+"_"+index} aria-hidden="true"></i></span></li>
             {toggleValues[index] && 
              <TreeNode data={childData[index]} level={this.props.level+1} parentChain={this.props.parentChain+"_"+value.text}/>}
              </div> )
          })}
           </ul>
           {showAddModal &&
             <AddModal node={addedToNode} hideModal={this.hideAddModal} addNewData={this.addNewData}/>
           }
           {showSwapModal &&
             <SwapModal node={swappedNode} hideModal={this.hideSwapModal} siblings={parentData} swapNodes={this.swapNodes}/>
           }

           {showEditModal  &&
             <EditModal node={editedNode} hideModal={this.hideEditModal} nodeEdited={this.nodeEdited}/>
           }
        </div>
        </div>


                
		);
	}
}  




