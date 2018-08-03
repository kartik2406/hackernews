import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Button from "./button";

Enzyme.configure({ adapter: new Adapter() });

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
