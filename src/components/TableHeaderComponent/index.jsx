import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortAlphaDown, faSortAlphaUp, faSortNumericDown, faSortNumericUp } from "@fortawesome/free-solid-svg-icons";
import { Text, Th } from "@chakra-ui/react";

const TableHeaderComponent = ({ onSort, label, isNumeric }) => {
    const [sortOrder, setSortOrder] = useState(null);
  
    const toggleSortOrder = () => {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
      onSort(newOrder);
    };
  
    return (
      <Th onClick={toggleSortOrder} style={{ cursor: "pointer", fontSize: "16px", minWidth: "240px"}}>
        {label}{" "}
        {sortOrder === "asc" ? (
          <FontAwesomeIcon icon={isNumeric ? faSortNumericDown : faSortAlphaDown} />
        ) : (
          <FontAwesomeIcon icon={isNumeric ? faSortNumericUp : faSortAlphaUp} />
        )}
      </Th>
    );
  }

export default TableHeaderComponent;