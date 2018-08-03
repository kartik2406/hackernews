import React from "react";

export const withEither = (
  conditionalRenderngFn,
  EitherComponent
) => Component => props =>
  conditionalRenderngFn(props) ? <EitherComponent /> : <Component {...props} />;
