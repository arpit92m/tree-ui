import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {TreeNode} from './components/treeNode';
import axios from 'axios'
import './main.scss';

class App extends Component {
   constructor(props) {
        super(props);
        this.state={data:[],collapse:false,expand:false};
        this.onCollapse = this.onCollapse.bind(this);
        this.onExpand = this.onExpand.bind(this);
    
        }

        onCollapse(){
          this.setState({collapse:!this.state.collapse})
        }

        onExpand(){
          this.setState({expand:!this.state.expand})
        }


componentDidMount() {
  var self = this;
   axios.get('https://thawing-spire-80596.herokuapp.com/findAllNodes?parent=null')
  .then(function (response) {
    let nodes=response.data;
    self.setState({data:nodes})
  })
  .catch(function (error) {
    console.log(error);
  });

}

  render () {
    const {data,collapse,expand} = this.state;

    return (<div>
       <h1> Tree View Component</h1>
       <button type="submit" className="button-wrap" onClick={this.onCollapse}>collapse</button>
    {data.length>0 ?
  <TreeNode data = {data} level={1} parentChain="null" collapse={collapse} collapseDone={this.onCollapse} expansionDone={this.onExpand}/> 
  :<div className="loader-wrapper"><div className="loader"></div></div>
}
            </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))