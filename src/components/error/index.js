import { compose } from "recompose";
import { withEither } from "./../common/withEither";
import { ErrorComponent } from "./error";

const errorExistsFn = props => props.error;
export const withError = compose(withEither(errorExistsFn, ErrorComponent));
