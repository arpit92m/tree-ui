import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {TreeNode} from './components/treeNode';
import axios from 'axios'
import './main.scss';

class App extends Component {
   constructor(props) {
        super(props);
        this.state={data:[],collapse:false};
    
        }


componentDidMount() {
  var self = this;
   axios.get('http://localhost:3001/findAllNodes?parent=null')
  .then(function (response) {
    let nodes=response.data;
    self.setState({data:nodes})
  })
  .catch(function (error) {
    console.log(error);
  });

}

  render () {
    const {data,collapse} = this.state;

    return (<div>
       <h1> Tree View Component</h1>
      {data.length>0 ?
  <TreeNode data = {data} level={1} parentChain="null"/> 
  :<div className="loader-wrapper"><div className="loader"></div></div>
}
            </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))