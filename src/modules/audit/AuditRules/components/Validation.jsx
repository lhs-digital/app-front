import { Chip } from "@mui/material";
import { validationLabels } from "../../../../services/utils";

const Validation = ({ rule, params, onDelete }) => {
  const formatParams = () => {
    if (!params) return null;
    if (Array.isArray(params)) {
      console.log("params is array");
      return params.map((param) => param.trim()).join(", ");
    }
    if (typeof params === "string") {
      return params
        .split(",")
        .map((param) => param.trim())
        .join(", ");
    }
    return params;
  };

  const handleLabel = () => {
    if (!rule) return null;
    let paramsStr = formatParams();
    if (paramsStr) {
      return `${validationLabels[rule.name]} [${paramsStr}]`;
    }
    return validationLabels[rule.name];
  };

  return <Chip label={handleLabel()} onDelete={onDelete} />;
};

export default Validation;
