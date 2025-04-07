import { Chip } from "@mui/material";
import { validationLabels } from "../../services/utils";

const Validation = ({ rule, params }) => {
  console.log("rule", rule);
  console.log("params", params);
  return (
    <Chip
      label={`${validationLabels[rule.name]} ${rule.has_params === 1 ? params : ""}`}
    />
  );
};

export default Validation;
