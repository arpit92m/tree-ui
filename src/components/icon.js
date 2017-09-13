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
    	<div title={this.props.tooltip} className="tooltip-default">
    		<i className={`fa fa-${this.props.classType} fa-2x`} onClick = {this.showModal} data-id={this.props.dataNeeded[0]} data-value = {this.props.dataNeeded[1]}>
    		
    		</i>
    		</div>
    		)
    }
}