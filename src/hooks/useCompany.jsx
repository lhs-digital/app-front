import { useContext } from "react";
import { CompanyContext } from "../contexts/companyContext";

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyContextProvider");
  }
  return context;
};
