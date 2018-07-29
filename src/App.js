import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

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
  _isMounted = false;
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null
    };

    this.setStories = this.setStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchStories = this.fetchSearchStories.bind(this);
    this.needsToSearchStories = this.needsToSearchStories.bind(this);
  }
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchStories) {
      this.fetchSearchStories(searchTerm);
    }
    event.preventDefault();
  }
  needsToSearchStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  fetchSearchStories(searchTerm, page = 0) {
    axios
      .get(
        `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
      )
      .then(result => this._isMounted && this.setStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }
  setStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey] : [];

    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  }
  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchStories(searchTerm);
  }
  onDismiss(id) {
    let isNotId = item => item.objectID != id;
    const { results, searchKey } = this.state;
    const result = results[searchKey];

    let updatedHits = result.hits.filter(isNotId);
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits } }
    });
  }
  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }
  render() {
    const { results, searchTerm, searchKey, error } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {error ? (
          <div className="interactions">
            <p> Something went wrong</p>
          </div>
        ) : (
          <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
        )}

        <div className="interactions">
          <Button onClick={() => this.fetchSearchStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}

const Search = ({ value, onChange, onSubmit, children }) => (
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
export { Button, Table, Search };
