import { Loading } from "./loading";
import { compose } from "recompose";
import { withEither } from "./../common/withEither";


const isLoadingFn = props => props.isLoading;

export const withConditionalRendering = compose(
  withEither(isLoadingFn, Loading)
);
