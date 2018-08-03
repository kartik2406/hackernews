import Button from "./button";
import { withConditionalRendering } from "../loading";

const ButtonWithLoading = withConditionalRendering(Button);

export { Button, ButtonWithLoading };
