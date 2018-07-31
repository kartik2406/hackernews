import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { shallow, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App from "./App";
import { Search, Button, Table } from "./App";

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("has a valid snapshot", () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Search", () => {
  const props = {
    value: '',
    onChange: () => {},
    onSubmit: () => {}
  }
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Search {...props}> Search </Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  test("has a valid snapshot", () => {
    const component = renderer.create(<Search {...props}> Search </Search>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Button", () => {
  const props = {
    onClick: () => {}
  };
  it("should render without errors", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Button {...props}> More </Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("should have a valid snapshot", () => {
    const component = renderer.create(<Button {...props}> More </Button>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should have single button tag", () => {
    const element = render(<Button {...props}>More</Button>);
    expect(element.text()).toBe("More");
  });
});

describe("Table", () => {
  const props = {
    list: [
      { title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" },
      { title: "2", author: "2", num_comments: 1, points: 2, objectID: "z" }
    ],
    sortKey: "TITLE",
    isSortReverse: false,
    onDismiss: () => {}
  };

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Table {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test("should have a valid snapshot", () => {
    const component = renderer.create(<Table {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows two item in the list", () => {
    const element = shallow(<Table {...props} />);
    expect(element.find(".table-row").length).toBe(props.list.length);
  });
});
