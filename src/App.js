import React, { Component } from "react";
import axios from "axios";
import { sortBy } from "lodash";
import classNames from 'classnames'
import "./App.css";
import PropTypes from "prop-types";
import { compose } from "recompose";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, "title"),
  AUTHOR: list => sortBy(list, "author"),
  COMMENTS: list => sortBy(list, "num_comments").reverse(),
  POINTS: list => sortBy(list, "points").reverse()
};
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
      error: null,
      isLoading: false,
      sortKey: "NONE",
      isSortReverse: false
    };

    this.setStories = this.setStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchStories = this.fetchSearchStories.bind(this);
    this.needsToSearchStories = this.needsToSearchStories.bind(this);
    this.onSort = this.onSort.bind(this);
  }
  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey == sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
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
    const { searchKey, results } = this.state;

    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
      isLoading: false
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
    const {
      results,
      searchTerm,
      searchKey,
      error,
      isLoading,
      sortKey,
      isSortReverse
    } = this.state;
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
        <TableWithError
          sortKey={sortKey}
          onSort={this.onSort}
          isSortReverse={isSortReverse}
          error={error}
          list={list}
          onDismiss={this.onDismiss}
        />
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

class Search extends Component {
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={onChange}
          value={value}
          ref={node => (this.input = node)}
        />
        <button type="submit">{children}</button>
      </form>
    );
  }
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }
}
Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

const Table = ({ list, onDismiss, sortKey, onSort, isSortReverse }) => {
  let sortedList = SORTS[sortKey](list);
  sortedList = isSortReverse ? sortedList.reverse() : sortedList;

  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: "40%" }}>
          <Sort sortKey={"TITLE"} activeSortKey={sortKey} onSort={onSort}>
            Title
          </Sort>
        </span>
        <span style={{ width: "30%" }}>
          <Sort sortKey={"AUTHOR"} activeSortKey={sortKey} onSort={onSort}>
            Author
          </Sort>
        </span>
        <span style={{ width: "10%" }}>
          <Sort sortKey={"COMMENTS"} activeSortKey={sortKey} onSort={onSort}>
            Comments
          </Sort>
        </span>
        <span style={{ width: "10%" }}>
          <Sort sortKey={"POINTS"} activeSortKey={sortKey} onSort={onSort}>
            Points
          </Sort>
        </span>
        <span style={{ width: "10%" }}>Archive</span>
      </div>
      {sortedList.map(item => {
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
};
Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
};

const Button = ({ onClick, className = "btn", children }) => (
  <button type="button" onClick={onClick} className={className}>
    {children}
  </button>
);
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

const Loading = () => (
  <div className="loader">
    <i className="fas fa-spinner" />
  </div>
);

const Sort = ({ sortKey, onSort, children, activeSortKey }) => {
  const sortClass = classNames(
    'button-inline',
    {'button-active': sortKey == activeSortKey}
  )
  return (
    <Button
      onClick={() => onSort(sortKey)}
      className="button-inline"
      className={sortClass}
    >
      {children}
    </Button>
  );
};

const ErrorComponent = () => (
  <div className="interactions">
    <p> Something went wrong</p>
  </div>
);
const withMaybe = conditionalRenderngFn => Component => props =>
  conditionalRenderngFn(props) ? null : <Component {...props} />;

const withEither = (
  conditionalRenderngFn,
  EitherComponent
) => Component => props =>
  conditionalRenderngFn(props) ? <EitherComponent /> : <Component {...props} />;

const isLoadingFn = props => props.isLoading;
const errorExistsFn = props => props.error;

const withConditionalRendering = compose(withEither(isLoadingFn, Loading));

const withError = compose(withEither(errorExistsFn, ErrorComponent));
const TableWithError = withError(Table);

const ButtonWithLoading = withConditionalRendering(Button);
export default App;
export { Button, Table, Search };
