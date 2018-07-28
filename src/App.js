import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const TECH_LIST = [
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

const isSearched = searchText => item => item.title.toLowerCase().includes(searchText.toLowerCase())

class App extends Component {
  constructor(props){
    super(props);
    console.log(this.props)
    this.state = {
      list: TECH_LIST,
      searchText: ''
    }

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }
  onDismiss(id){
    let isNotId = item => item.objectID != id;
    let updatedList = this.state.list.filter(isNotId);
    this.setState({
      list: updatedList
    })

  }
  onSearchChange(event){
    this.setState({
      searchText: event.target.value
    })
  }
  render() {
    console.log("hello app");
    const {list, searchText} = this.state;
    return (
      <div className="App">
      <form>
        <input type="text" onChange={this.onSearchChange} />
      </form>
        {list.filter(isSearched(searchText)).map(item => {
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
