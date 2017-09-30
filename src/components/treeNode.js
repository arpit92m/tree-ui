import React, { Component } from 'react';
import axios from 'axios';
import { AddModal } from './addModal';
import { SwapModal } from './swapModal';
import { EditModal } from './editModal';
import { Icon } from './icon';

export class TreeNode extends Component {
    constructor(props) {
        super(props);
        this.state = { toggleValues: [], parentData: [], childData: [], showAddModal: false, showSwapModal: false, addedToNode: {}, swappedNode: {}, editedNode: {}, showEditModal: false,expand:false }

        this.showChildData = this.showChildData.bind(this);
        this.sortAccordingToLastIndex = this.sortAccordingToLastIndex.bind(this);
        this.initializeToggleValue = this.initializeToggleValue.bind(this);
        this.initializeChildData = this.initializeChildData.bind(this);
        this.showAddModal = this.showAddModal.bind(this);
        this.showSwapModal = this.showSwapModal.bind(this);
        this.removeNode = this.removeNode = this.removeNode.bind(this);
        this.hideAddModal = this.hideAddModal.bind(this);
        this.removeFromTree = this.removeFromTree.bind(this);
        this.addNewData = this.addNewData.bind(this);
        this.swapNodes = this.swapNodes.bind(this);
        this.hideSwapModal = this.hideSwapModal.bind(this);
        this.editText = this.editText.bind(this);
        this.hideEditModal = this.hideEditModal.bind(this);
        this.nodeEdited = this.nodeEdited.bind(this);
        this.initializeToggleValueToTrue = this.initializeToggleValueToTrue.bind(this);
        this.onExpand = this.onExpand.bind(this);

    }

    componentWillMount() {
        const { data, level } = this.props;
        this.sortAccordingToLastIndex(data);
        this.initializeToggleValue(data.length);
        this.initializeChildData(data.length);


    }


    componentWillReceiveProps(nextProps) {
        const { parentData } = this.state;
        if(!this.props.collapse && nextProps.collapse){
            this.initializeToggleValue(parentData.length)
            this.initializeChildData(parentData.length);
            this.props.collapseDone();
        }
        if(!this.props.expand && nextProps.expand && this.props.level===1){
            this.initializeToggleValueToTrue(parentData.length)
            this.props.expansionDone();
        }


    }

    componentDidMount(){
        const { parentData } = this.state;
        if(this.props.expand){
              this.initializeToggleValueToTrue(parentData.length)
        }
    }


    onExpand(){
          this.setState({expand:!this.state.expand})
        }



    hideEditModal() {
        this.setState({ showEditModal: false })
    }

    swapNodes(swapId) {
        const { swappedNode, parentData } = this.state;
        var parentDataCopy = parentData,
            selectedSwappedNodeIndex = swappedNode.id.split("_")[1] * 1,
            changedSwappedNodeIndex = swapId.split("_")[1] * 1;

        parentDataCopy[selectedSwappedNodeIndex].id = swapId;
        parentDataCopy[changedSwappedNodeIndex].id = swappedNode.id;
        var updatedChildData = this.state.childData
        updatedChildData[changedSwappedNodeIndex] = this.state.childData[selectedSwappedNodeIndex]
        updatedChildData[selectedSwappedNodeIndex] = this.state.childData[changedSwappedNodeIndex]

        this.setState({ parentData: parentDataCopy, showSwapModal: false, childData: updatedChildData }, () => {
            this.sortAccordingToLastIndex(parentData);
            this.initializeToggleValue(parentData);
        })
    }

    addNewData(newNode) {
        const { parentData, toggleValues } = this.state;
        var length = parentData.length,
            parentIndex;
        for (var i = 0; i < length; i++) {
            if (parentData[i].text === newNode.parent) {
                parentIndex = i;
            }
        }
        var updatedChildData = this.state.childData,
            toggleData = toggleValues;
        toggleData[parentIndex] = true;

        updatedChildData[parentIndex].push(newNode);
        this.setState({ childData: updatedChildData, showAddModal: false, toggleValues: toggleData })
    }

    nodeEdited(textAfterEdit) {
        const { editedNode, parentData, childData } = this.state;
        var parentDataCopy = parentData,
            editedNodeIndex = editedNode.id.split("_")[1] * 1,
            childDataCopy = this.state.childData;
        parentDataCopy[editedNodeIndex].text = textAfterEdit;
        this.setState({ parentData: parentDataCopy, showEditModal: false }, () => {
          
        })
    }

    editText(e) {
        this.setState({ showEditModal: true, editedNode: { text: e.target.getAttribute('data-value'), id: e.target.getAttribute('data-id') } })
    }

    removeFromTree(idx) {
        var toggleCopy = this.state.toggleValues,
            parentDataCopy = this.state.parentData,
            childDataCopy = this.state.childData
        toggleCopy.splice(idx, 1);
        parentDataCopy.splice(idx, 1);
        childDataCopy.splice(idx, 1)
        this.setState({ toggleValues: toggleCopy, parentData: parentDataCopy, childData: childDataCopy })
    }

    hideAddModal() {
        this.setState({ showAddModal: false })
    }

    hideSwapModal() {
        this.setState({ showSwapModal: false })
    }

    removeNode(e) {

        var self = this,
            removedIndex = e.target.getAttribute('data-id').split("_")[1] * 1;
        axios.post('https://thawing-spire-80596.herokuapp.com/removeAllNodes', {
                id: e.target.getAttribute('data-id'),
                parentChain: this.props.parentChain,
                parentText: this.state.parentData[0].parent,
                text: this.state.parentData[0].text
            })
            .then(function(response) {
                self.removeFromTree(removedIndex)
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    showAddModal(e) {
        this.setState({ showAddModal: true, addedToNode: { text: e.target.getAttribute('data-value'), id: e.target.getAttribute('data-id'), parentChain: this.props.parentChain + "_" + e.target.getAttribute('data-value') } });
    }


    showSwapModal(e) {
        this.setState({ showSwapModal: true, swappedNode: { text: e.target.getAttribute('data-value'), id: e.target.getAttribute('data-id'), parent: this.state.parentData[0].parent } });
    }

    initializeToggleValue(length) {
        var i = 0,
            toggleData = [];
        while (i < length) {
            toggleData.push(false)
            i++;
        }
        this.setState({ toggleValues: toggleData })
    }

    initializeToggleValueToTrue(length) {
        var i = 0,
            toggleData = [];
        while (i < length) {
            toggleData.push(true)
            i++;
        }
        this.showChildDataWithLevel(toggleData);
    }

    initializeChildData(length) {
        var i = 0,
            childValues = [];
        while (i < length) {
            childValues.push([])
            i++;
        }
        this.setState({ childData: childValues })
    }


    sortAccordingToLastIndex(data) {
        this.setState({
            parentData: data.sort(function(a, b) {
                return a.id.split("_")[1] - b.id.split("_")[1]
            })
        })
    }


    showChildData(e) {
        var parentIndex = e.target.id.split("_")[1]
        if (!this.state.toggleValues[parentIndex]) {
            var toggleCopy = this.state.toggleValues,
                self = this;
            toggleCopy[parentIndex] = true
            axios.get('https://thawing-spire-80596.herokuapp.com/findAllNodes?parent=' + e.target.innerText)
                .then(function(response) {
                  if(response.data.length===0){
                    alert("no children found,click on + icon to add children ");
                  }
                  else{
                    let nodes = response.data,
                        childValues = self.state.childData;
                    childValues[parentIndex] = nodes;
                    self.setState({ childData: childValues, toggleValues: toggleCopy,expand:false })
                }
                })
                .catch(function(error) {
                    console.log(error);
                });
        } else {
            var toggleCopy = this.state.toggleValues,childDataCopy=this.state.childData;
            toggleCopy[parentIndex] = false;
            childDataCopy[parentIndex]=[];
            this.setState({ toggleValues: toggleCopy,childData:childDataCopy })
        }
    }

    showChildDataWithLevel(toggleCopy) {

        const {childData,parentData} = this.state;
         var idx = 0,
            childValues = [];
        while (idx < parentData.length) {
            childValues.push([])
            idx++;
        }
            var self = this,parentDataCopy=parentData;
            axios.get('http://localhost:5000/findAllNodesWithLength?level=' + this.props.level)
                .then(function(response) {
                    response.data.map((value,index)=>{
                        var i=0;
                      while(parentDataCopy.length>i){
                         if(parentData[i].text === value.id.split("_")[0]){
                            childValues[i].push(value);
                         }
                         i++;
                      }
                    })
                    
                    self.setState({ childData: childValues, toggleValues: toggleCopy,expand:true })
                
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    


    render() {
            const { parentData, toggleValues, childData, showSwapModal, showAddModal, addedToNode, collapse, swappedNode, editedNode, showEditModal,expand } = this.state;
            return ( <div id = 'app-container' className = 'container' > { /* Header content , common for entire application */ } 
                <div >
                <ul > {
                    parentData.map((value, index) => {
                            return ( <div>
                                    <li ><span><a href="#" onClick={this.showChildData} id={value.parent+"_"+index}>{value.text}</a>
                                        <Icon onClick = {this.showAddModal} tooltip="add child" classType = "plus-circle" dataNeeded = {[value.parent+"_"+index , value.text]} />
                                        <Icon onClick = {this.removeNode} tooltip="delete node" classType="minus-circle" dataNeeded = {[value.parent+"_"+index , value.text]} />
                                        <Icon onClick = {this.showSwapModal} tooltip="swap node" classType="refresh" dataNeeded = {[value.parent+"_"+index , value.text]} />
                                        <Icon onClick = {this.editText} tooltip="edit node" classType = "pencil-square-o" dataNeeded = {[value.parent+"_"+index , value.text]} />
                                    </span>
                                    </li>                               
                                     {toggleValues[index] &&
                                    <TreeNode data = { childData[index] } level = { this.props.level + 1 } parentChain = { this.props.parentChain + "_" + value.text } expand = {expand} expansionDone={this.onExpand}/>
                                  } 
                                    </div> )
                                })
                        } 
                        </ul> 
                        {
                            showAddModal &&
                                <AddModal node = { addedToNode } hideModal = { this.hideAddModal } addNewData = { this.addNewData } level={this.props.level+1}/>
                        } {
                            showSwapModal &&
                                <SwapModal node = { swappedNode } hideModal = { this.hideSwapModal } siblings = { parentData } swapNodes = { this.swapNodes }/>
                        }

                        {
                            showEditModal &&
                                <EditModal node = { editedNode } hideModal = { this.hideEditModal } nodeEdited = { this.nodeEdited }/>
                        } </div> 
                        </div>



                    );
                }
            }