import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useUserState } from "../hooks/useUserState";
import api from "../services/api";

export const CompanyContext = createContext();

export const CompanyContextProvider = ({ children }) => {
  const { state: user } = useUserState();

  const [company, setCompany] = useState(
    JSON.parse(localStorage.getItem("company")) || null,
  );

  const resetCompany = () => {
    setCompany(null);
    localStorage.removeItem("company");
  };

  const changeCompany = (company) => {
    if (!company) {
      return resetCompany();
    }
    setCompany(company);
    localStorage.setItem("company", JSON.stringify(company));
  };

  useEffect(() => {
    if (localStorage.getItem("company") && !user) {
      console.log("resetting company");
      resetCompany();
    }
  }, [user]);

  const { data: availableCompanies = [], refetch: refetchAvailableCompanies } =
    useQuery({
      queryKey: ["available_companies"],
      queryFn: async () => {
        const response = await api.get("/companies");
        return response.data.data.filter((company) => company.id !== 1);
      },
      enabled: !!user,
      refetchInterval: 60000,
      refetchOnWindowFocus: false,
    });

  if (!user) {
    return (
      <CompanyContext.Provider
        value={{
          company: null,
          setCompany: () => {},
          availableCompanies: [],
          refetchAvailableCompanies: () => {},
          resetCompany: () => {},
        }}
      >
        {children}
      </CompanyContext.Provider>
    );
  }

  return (
    <CompanyContext.Provider
      value={{
        company,
        setCompany: changeCompany,
        availableCompanies,
        refetchAvailableCompanies,
        resetCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
