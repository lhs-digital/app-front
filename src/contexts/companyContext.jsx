import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useUserState } from "../hooks/useUserState";
import api from "../services/api";
import { qc } from "../services/queryClient";

export const CompanyContext = createContext();

export const CompanyContextProvider = ({ children }) => {
  const { state: user } = useUserState();

  const [company, setCompany] = useState(
    user?.isLighthouse
      ? JSON.parse(localStorage.getItem("company")) || null
      : user?.company || null,
  );

  const changeCompany = (company) => {
    if (!company) {
      setCompany(null);
      localStorage.removeItem("company");
      return;
    }
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
      enabled: !!user,
      refetchInterval: 60000,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    qc.invalidateQueries(["available_companies"]);
    if (user?.isLighthouse) {
      const storedCompany = JSON.parse(localStorage.getItem("company"));
      if (storedCompany) setCompany(storedCompany);
    } else {
      setCompany(user?.company);
    }
  }, [user]);

  if (!user) {
    return (
      <CompanyContext.Provider
        value={{
          company: null,
          setCompany: () => {},
          availableCompanies: [],
          refetchAvailableCompanies: () => {},
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
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
