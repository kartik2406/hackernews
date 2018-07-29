import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";

const largeColumn = {
  width: "40%"
};

const midColumn = {
  width: "30%"
};

const smallColumn = {
  width: "10%"
};

class App extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    this.setStories = this.setStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchStories = this.fetchSearchStories.bind(this);
  }
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchStories(searchTerm);
    event.preventDefault();
  }
  fetchSearchStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setStories(result))
      .catch(error => console.log(error));
  }
  setStories(result) {
    this.setState({ result });
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchStories(searchTerm);
  }
  onDismiss(id) {
    let isNotId = item => item.objectID != id;
    let updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }
  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }
  render() {
    console.log("hello app");
    const { result, searchTerm } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        {result ? (
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        ) : null}
      </div>
    );
  }
}

const Search = ({ value, onChange,onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" onChange={onChange} value={value} />
    <button type="submit">{children}</button>
  </form>
);

const Table = ({ list, pattern, onDismiss }) => (
  <div className="table">
    {list.map(item => {
      return (
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}> {item.num_comments} </span>
          <span style={smallColumn}> {item.points}</span>
          <span style={smallColumn}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div>
      );
    })}
  </div>
);

const Button = ({ onClick, className = "btn", children }) => (
  <button type="button" onClick={onClick} className={className}>
    {children}
  </button>
);

export default App;
