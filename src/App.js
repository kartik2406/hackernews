import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const list = [
  {
    title: "React",
    url: "https://facebook.github.io/react/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://github.com/reactjs/redux",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

class App extends Component {
  constructor(props){
    super(props);
    console.log(this.props)
    this.state = {
      list
    }
  }
  onDismiss(id){
    let isNotId = item => item.objectID != id;
    let updatedList = this.state.list.filter(isNotId);
    this.setState({
      list: updatedList
    })

    this.onDismiss = this.onDismiss.bind(this);
  }
  render() {
    console.log("hello app");
    return (
      <div className="App">
        {this.state.list.map(item => {
          return (
            <div key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span> {item.num_comments} </span>
              <span> {item.points}</span>
              <button type="button" onClick={ () => this.onDismiss(item.objectID)}>Dismiss</button>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
