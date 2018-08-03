import React from "react";
import classNames from "classnames";
import { Button } from "../button";


export const Sort = ({
  sortKey,
  onSort,
  children,
  activeSortKey,
  isSortReverse
}) => {
  const sortClass = classNames("button-inline", {
    "button-active": sortKey == activeSortKey
  });
  const iconClass = classNames(
    "fas",
    { "fa-sort": sortKey != activeSortKey },
    { active: sortKey == activeSortKey },
    { "fa-sort-up": sortKey == activeSortKey && !isSortReverse },
    { "fa-sort-down": sortKey == activeSortKey && isSortReverse }
  );
  return (
    <Button
      onClick={() => onSort(sortKey)}
      className="button-inline"
      className={sortClass}
    >
      {children}
      <i className={iconClass} />
    </Button>
  );
};
