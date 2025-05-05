import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useUserState } from "../hooks/useUserState";
import api from "../services/api";

export const CompanyContext = createContext();

export const CompanyContextProvider = ({ children }) => {
  const { state: user } = useUserState();

  const [company, setCompany] = useState(
    user?.isLighthouse
      ? JSON.parse(localStorage.getItem("company")) || null
      : user?.company || null,
  );

  useEffect(() => {
    if (user?.isLighthouse) {
      const storedCompany = JSON.parse(localStorage.getItem("company"));
      if (storedCompany) setCompany(storedCompany);
    } else {
      setCompany(user?.company);
    }
  }, [user]);

  const changeCompany = (company) => {
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
      enabled: user?.isLighthouse,
      refetchInterval: 60000,
      refetchOnWindowFocus: false,
    });

  if (!user) {
    return children;
  }

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
