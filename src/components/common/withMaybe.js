import React from "react";

export const withMaybe = conditionalRenderngFn => Component => props =>
  conditionalRenderngFn(props) ? null : <Component {...props} />;
