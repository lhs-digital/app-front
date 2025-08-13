import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const filterDefaults = {
  search: "",
  priority_order: "desc",
  created_at_from: null,
  created_at_to: null,
  status: "0",
  priority: "-1",
  module_id: null,
  page: "1",
  per_page: "20",
};

export const useAuditFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    return {
      search: params.get("search") || filterDefaults.search,
      priorityOrder:
        params.get("priority_order") || filterDefaults.priority_order,
      createdAt: [
        params.get("created_at_from") || filterDefaults.created_at_from,
        params.get("created_at_to") || filterDefaults.created_at_to,
      ],
      status: parseInt(params.get("status") ?? filterDefaults.status),
      priority: parseInt(params.get("priority") ?? filterDefaults.priority),
      moduleId: params.get("module_id") || filterDefaults.module_id,
      page: parseInt(params.get("page") || filterDefaults.page),
      perPage: parseInt(params.get("per_page") || filterDefaults.per_page),
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(newFilters).forEach(([key, value]) => {
        let paramKey = key;
        if (key === "priorityOrder") paramKey = "priority_order";
        if (key === "moduleId") paramKey = "module_id";

        if (key === "createdAt") {
          if (value[0]) {
            params.set("created_at_from", value[0]);
          } else {
            params.delete("created_at_from");
          }
          if (value[1]) {
            params.set("created_at_to", value[1]);
          } else {
            params.delete("created_at_to");
          }
          return;
        }

        if (
          value === null ||
          value === "" ||
          value === -1 ||
          String(value) === filterDefaults[paramKey]
        ) {
          params.delete(paramKey);
        } else {
          params.set(paramKey, value);
        }
      });

      if (newFilters.page) {
        params.set("page", newFilters.page);
      } else if (!("page" in newFilters)) {
        const hasFilterChanges = Object.keys(newFilters).some(
          (k) => k !== "page" && k !== "perPage",
        );
        if (hasFilterChanges) {
          params.set("page", "1");
        }
      }

      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const resetFilters = useCallback(() => {
    const moduleId = searchParams.get("module_id");
    const newParams = new URLSearchParams();
    if (moduleId) {
      newParams.set("module_id", moduleId);
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  return {
    filters,
    updateFilters,
    resetFilters,
    searchParams,
  };
};
