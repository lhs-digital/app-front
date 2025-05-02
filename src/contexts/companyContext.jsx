import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";
import { useUserState } from "../hooks/useUserState";
import api from "../services/api";

export const CompanyContext = createContext();

export const CompanyContextProvider = ({ children }) => {
  const { isLighthouse, company: userCompany } = useUserState().state;

  const [company, setCompany] = useState(
    isLighthouse
      ? JSON.parse(localStorage.getItem("company")) || null
      : userCompany,
  );

  const changeCompany = (company) => {
    console.log("Company changed to: ", company);
    setCompany(company);
    localStorage.setItem("company", JSON.stringify(company));
  };

  const { data: availableCompanies = [], refetch: refetchAvailableCompanies } =
    useQuery({
      queryKey: ["available_companies"],
      queryFn: async () => {
        const response = await api.get("/companies");
        return response.data.data.filter((company) => company.id !== 1);
      },
      enabled: isLighthouse,
      refetchInterval: 60000,
      refetchOnWindowFocus: false,
    });

  return (
    <CompanyContext.Provider
      value={{
        company,
        setCompany: changeCompany,
        availableCompanies,
        refetchAvailableCompanies,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
