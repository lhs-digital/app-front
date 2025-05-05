import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { qc } from "../services/queryClient";

export const useAssignmentFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    assigned_to: null,
    assigned_by: null,
    entity_id: null,
    entity_type: searchParams.get("entity_type") || null,
    status: searchParams.get("status") || "",
  });

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.assigned_to) params.set("assigned_to", filters.assigned_to.id);
    if (filters.assigned_by) params.set("assigned_by", filters.assigned_by.id);
    if (filters.entity_type) params.set("entity_type", filters.entity_type);
    if (filters.entity_id) params.set("entity_id", filters.entity_id.id);
    if (filters.status) params.set("status", filters.status);

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    qc.invalidateQueries(["workOrders"]);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      assigned_to: null,
      assigned_by: null,
      entity_id: null,
      entity_type: null,
      status: "",
    });
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    searchParams,
  };
};
