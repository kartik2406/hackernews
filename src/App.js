import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import { Search } from "./components/search";
import { TableWithError } from "./components/table";
import { ButtonWithLoading } from "./components/button";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const updateSearchStories = (hits, page) => prevState => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

  const updatedHits = [...oldHits, ...hits];
  return {
    results: { ...results, [searchKey]: { hits: updatedHits, page } },
    isLoading: false
  };
};

const filterSearchStories = id => prevState => {
  let isNotId = item => item.objectID != id;
  const { results, searchKey } = prevState;
  const result = results[searchKey];

  let updatedHits = result.hits.filter(isNotId);
  return {
    results: { ...results, [searchKey]: { hits: updatedHits } }
  };
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
      error: null,
      isLoading: false
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
    this.setState({ searchKey: searchTerm, loading: true });
    if (this.needsToSearchStories) {
      this.fetchSearchStories(searchTerm);
    }
    event.preventDefault();
  }
  needsToSearchStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  fetchSearchStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    axios
      .get(
        `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
      )
      .then(result => this._isMounted && this.setStories(result.data))
      .catch(
        error => this._isMounted && this.setState({ error, isLoading: false })
      );
  }
  setStories(result) {
    const { hits, page } = result;

    this.setState(updateSearchStories(hits, page));
  }
  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchStories(searchTerm);
  }
  onDismiss(id) {
    this.setState(filterSearchStories(id));
  }
  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }
  render() {
    const { results, searchTerm, searchKey, error, isLoading } = this.state;
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
        <TableWithError error={error} list={list} onDismiss={this.onDismiss} />
        <div className="interactions">
          <ButtonWithLoading
            onClick={() => this.fetchSearchStories(searchKey, page + 1)}
            isLoading={isLoading}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
}

export default App;
