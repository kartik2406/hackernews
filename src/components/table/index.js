import Table from "./table";
import { withError } from "../error";

const TableWithError = withError(Table);

export { Table, TableWithError };
