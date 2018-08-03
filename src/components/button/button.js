import React from "react";
import PropTypes from "prop-types";

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

export default Button;
