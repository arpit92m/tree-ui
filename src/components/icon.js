import React, {Component} from 'react';

export class Icon extends Component{

constructor(props) {
        super(props);
        this.showModal = this.showModal.bind(this);

    }

    showModal(e){
    	this.props.onClick(e);
    }

    render() {
    	return (
    		<i className="fa fa-"+this.props.classType+" fa-2x" onClick = {this.showModal} data-id={data-needed[0]} data-value = {data-needed[1]}></i>
    		<span className="tooltiptext">Tooltip text</span>
    		)
    }