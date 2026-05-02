import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker-theme.css";
import { AppDateInput, APP_DATE_FORMAT } from "@/components/AppDateInput";

const MIN_DATE = new Date(2000, 0, 1);
const MAX_DATE = new Date(2100, 11, 31);

const DEFAULT_SERVICE_TYPES = [
  "ACCOUNTING",
  "AUDIT",
  "INCOME TAX RETURN FILING",
  "TDS/TCS RETURN FILING",
  "GST RETURN FILING",
  "GST SCRUTINY",
  "INCOME TAX SCRUTINY",
  "REGISTRATION",
  "APPLICATIONS",
  "CERTIFICATES",
  "CMA DATA",
  "INCOME TAX VERIFICATION",
  "INCORPORATION",
  "OTHERS",
  "CONSULTANCY CHARGES",
];

function FirmService() {
  const [rows, setRows] = useState([]);
  const [firms, setFirms] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createFirmId, setCreateFirmId] = useState("");
  const [createServiceType, setCreateServiceType] = useState("");
  const [createServiceId, setCreateServiceId] = useState("");
  const [createServicePrice, setCreateServicePrice] = useState("");
  const [createStartDate, setCreateStartDate] = useState(null);
  const [createEndDate, setCreateEndDate] = useState(null);
  const [createError, setCreateError] = useState("");
  const [createSaving, setCreateSaving] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [editFirmId, setEditFirmId] = useState("");
  const [editServiceType, setEditServiceType] = useState("");
  const [editServiceId, setEditServiceId] = useState("");
  const [editServicePrice, setEditServicePrice] = useState("");
  const [editStartDate, setEditStartDate] = useState(null);
  const [editEndDate, setEditEndDate] = useState(null);
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSaving, setDeleteSaving] = useState(false);

  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "firm_id", label: "Firm" },
      { key: "service_id", label: "Service" },
      { key: "type", label: "Type" },
      { key: "service_price", label: "Price" },
      { key: "start_date", label: "Start Date" },
      { key: "end_date", label: "End Date" },
      { key: "actions", label: "Actions" },
    ],
    [],
  );

  const toDateInputValue = (value) => {
    if (!value) return "";

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10);
    }

    const raw = String(value).trim();
    if (!raw || raw === "null" || raw === "undefined") return "";

    // Accept ISO strings like 2026-01-24T00:00:00.000Z
    if (raw.includes("T")) return raw.split("T")[0];

    // Accept strings like 2026-01-24 00:00:00
    if (raw.length >= 10 && raw[4] === "-" && raw[7] === "-") {
      return raw.slice(0, 10);
    }

    return "";
  };

  const pad2 = (value) => String(value).padStart(2, "0");

  const parseYmdToDate = (value) => {
    const ymd = toDateInputValue(value);
    if (!ymd) return null;
    const [y, m, d] = ymd.split("-").map((x) => Number(x));
    if (!y || !m || !d) return null;
    // Use local date to avoid timezone shifting.
    return new Date(y, m - 1, d);
  };

  const formatDateToYmd = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${pad2(m)}-${pad2(d)}`;
  };

  const firmById = useMemo(() => {
    const map = new Map();
    for (const f of firms) {
      const id = Number(f?.id);
      if (!id) continue;
      map.set(id, {
        id,
        name: String(f?.firm_name ?? "").trim(),
      });
    }
    return map;
  }, [firms]);

  const serviceById = useMemo(() => {
    const map = new Map();
    for (const s of services) {
      const id = Number(s?.id);
      if (!id) continue;
      map.set(id, {
        id,
        name: String(s?.name ?? "").trim(),
        type: String(s?.type ?? "").trim(),
      });
    }
    return map;
  }, [services]);

  const getFirmName = (firmId) => {
    const id = Number(firmId);
    if (!id) return "-";
    return firmById.get(id)?.name || `Firm #${id}`;
  };

  const getServiceName = (serviceId) => {
    const id = Number(serviceId);
    if (!id) return "-";
    return serviceById.get(id)?.name || `Service #${id}`;
  };

  const getServiceType = (serviceId) => {
    const id = Number(serviceId);
    if (!id) return "";
    return serviceById.get(id)?.type || "";
  };

  const getNormalizedType = (type) =>
    String(type ?? "")
      .trim()
      .toUpperCase();

  const doesServiceMatchType = (serviceId, selectedType) => {
    const wanted = getNormalizedType(selectedType);
    if (!wanted) return true;
    const actual = getNormalizedType(getServiceType(serviceId));
    return actual === wanted;
  };

  const serviceTypes = useMemo(() => {
    const seen = new Set(DEFAULT_SERVICE_TYPES);
    for (const s of services) {
      const t = getNormalizedType(s?.type);
      if (t) seen.add(t);
    }
    // Keep default types in the same order, then append any extra types from API.
    const extras = Array.from(seen)
      .filter((t) => !DEFAULT_SERVICE_TYPES.includes(t))
      .sort((a, b) => a.localeCompare(b));
    return [...DEFAULT_SERVICE_TYPES, ...extras];
  }, [services]);

  const filteredCreateServices = useMemo(() => {
    const wanted = getNormalizedType(createServiceType);
    if (!wanted) return services;
    return services.filter((s) => getNormalizedType(s?.type) === wanted);
  }, [createServiceType, services]);

  const filteredEditServices = useMemo(() => {
    const wanted = getNormalizedType(editServiceType);
    if (!wanted) return services;
    return services.filter((s) => getNormalizedType(s?.type) === wanted);
  }, [editServiceType, services]);

  const getTypeBadgeClasses = (type) => {
    const normalized = String(type ?? "")
      .trim()
      .toUpperCase();

    const known = {
      ACCOUNTING: "bg-primary-subtle text-primary",
      AUDIT: "bg-warning-subtle text-warning",
      "GST RETURN FILING": "bg-success-subtle text-success",
      "INCOME TAX RETURN FILING": "bg-info-subtle text-info",
      REGISTRATION: "bg-secondary-subtle text-secondary",
      INCORPORATION: "bg-danger-subtle text-danger",
    };

    if (known[normalized]) return known[normalized];

    const palette = [
      "bg-primary-subtle text-primary",
      "bg-success-subtle text-success",
      "bg-warning-subtle text-warning",
      "bg-danger-subtle text-danger",
      "bg-info-subtle text-info",
      "bg-secondary-subtle text-secondary",
    ];

    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
    }

    return palette[hash % palette.length];
  };

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [firmServiceRes, firmsRes, servicesRes] = await Promise.all([
        api.post("/get-firm-service", {}),
        api.post("/get-customer-firm", {}),
        api.post("/get-service", {}),
      ]);

      const list = firmServiceRes?.data?.data;
      const firmList = firmsRes?.data?.data;
      const serviceList = servicesRes?.data?.data;

      if (!Array.isArray(list)) throw new Error("Unexpected firm-service list");
      if (!Array.isArray(firmList)) throw new Error("Unexpected firms list");
      if (!Array.isArray(serviceList))
        throw new Error("Unexpected services list");

      setRows(list);
      setFirms(firmList);
      setServices(serviceList);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load firm services.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isCreateOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !createSaving) {
        setIsCreateOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [createSaving, isCreateOpen]);

  useEffect(() => {
    if (!isEditOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !editSaving) {
        setIsEditOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [editSaving, isEditOpen]);

  useEffect(() => {
    if (!isDeleteOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !deleteSaving) {
        setIsDeleteOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [deleteSaving, isDeleteOpen]);

  const openCreate = () => {
    setCreateFirmId("");
    setCreateServiceType("");
    setCreateServiceId("");
    setCreateServicePrice("");
    setCreateStartDate(null);
    setCreateEndDate(null);
    setCreateError("");
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    if (createSaving) return;
    setIsCreateOpen(false);
  };

  const openEdit = (row) => {
    const id = Number(row?.id ?? 0);
    if (!id) return;

    setEditId(id);
    setEditFirmId(String(row?.firm_id ?? ""));
    setEditServiceId(String(row?.service_id ?? ""));
    setEditServiceType(getServiceType(row?.service_id));
    setEditServicePrice(String(row?.service_price ?? ""));
    setEditStartDate(parseYmdToDate(row?.start_date));
    setEditEndDate(parseYmdToDate(row?.end_date));
    setEditError("");
    setIsEditOpen(true);
  };

  useEffect(() => {
    if (!createServiceId) return;
    if (!doesServiceMatchType(createServiceId, createServiceType)) {
      setCreateServiceId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createServiceType, createServiceId, services]);

  useEffect(() => {
    if (!editServiceId) return;
    if (!doesServiceMatchType(editServiceId, editServiceType)) {
      setEditServiceId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editServiceType, editServiceId, services]);

  const closeEdit = () => {
    if (editSaving) return;
    setIsEditOpen(false);
  };

  const openDelete = (row) => {
    const id = Number(row?.id ?? 0);
    if (!id) return;

    setDeleteRow({
      id,
      firmName: getFirmName(row?.firm_id),
      serviceName: getServiceName(row?.service_id),
    });
    setDeleteError("");
    setIsDeleteOpen(true);
  };

  const closeDelete = () => {
    if (deleteSaving) return;
    setIsDeleteOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError("");

    const firmId = Number(String(createFirmId).trim());
    const serviceId = Number(String(createServiceId).trim());
    const price = Number(String(createServicePrice).trim());
    const startDate = formatDateToYmd(createStartDate);
    const endDate = formatDateToYmd(createEndDate);

    const errors = [];
    if (!firmId) errors.push("Firm is required.");
    if (!serviceId) errors.push("Service is required.");
    if (Number.isNaN(price)) errors.push("Price must be a number.");
    if (!startDate) errors.push("Start date is required.");
    if (!endDate) errors.push("End date is required.");
    if (startDate && endDate && startDate > endDate)
      errors.push("Start date must be before end date.");

    if (errors.length) {
      setCreateError(errors.join(" "));
      return;
    }

    setCreateSaving(true);
    try {
      const payload = {
        id: 0,
        firm_id: firmId,
        service_id: serviceId,
        service_price: price,
        start_date: startDate,
        end_date: endDate,
      };

      await api.post("/create-firm-service", payload);
      setIsCreateOpen(false);
      await fetchAll();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create firm service.";
      setCreateError(message);
    } finally {
      setCreateSaving(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditError("");

    const id = Number(editId || 0);
    const firmId = Number(String(editFirmId).trim());
    const serviceId = Number(String(editServiceId).trim());
    const price = Number(String(editServicePrice).trim());
    const startDate = formatDateToYmd(editStartDate);
    const endDate = formatDateToYmd(editEndDate);

    const errors = [];
    if (!id) errors.push("Record not found.");
    if (!firmId) errors.push("Firm is required.");
    if (!serviceId) errors.push("Service is required.");
    if (Number.isNaN(price)) errors.push("Price must be a number.");
    if (!startDate) errors.push("Start date is required.");
    if (!endDate) errors.push("End date is required.");
    if (startDate && endDate && startDate > endDate)
      errors.push("Start date must be before end date.");

    if (errors.length) {
      setEditError(errors.join(" "));
      return;
    }

    setEditSaving(true);
    try {
      const payload = {
        id,
        firm_id: firmId,
        service_id: serviceId,
        service_price: price,
        start_date: startDate,
        end_date: endDate,
      };

      await api.post("/create-firm-service", payload);
      setIsEditOpen(false);
      await fetchAll();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update firm service.";
      setEditError(message);
    } finally {
      setEditSaving(false);
    }
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");

    const id = Number(deleteRow?.id ?? 0);
    if (!id) {
      setDeleteError("Record not found.");
      return;
    }

    setDeleteSaving(true);
    try {
      await api.post("/delete-firm-service", { id });
      setRows((prev) => prev.filter((x) => Number(x?.id) !== id));
      setIsDeleteOpen(false);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete firm service.";
      setDeleteError(message);
    } finally {
      setDeleteSaving(false);
    }
  };

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const firmName = String(getFirmName(r?.firm_id) ?? "").toLowerCase();
      const serviceName = String(
        getServiceName(r?.service_id) ?? "",
      ).toLowerCase();
      const type = String(getServiceType(r?.service_id) ?? "").toLowerCase();
      const price = String(r?.service_price ?? "").toLowerCase();
      const start = String(r?.start_date ?? "").toLowerCase();
      const end = String(r?.end_date ?? "").toLowerCase();

      return (
        firmName.includes(q) ||
        serviceName.includes(q) ||
        type.includes(q) ||
        price.includes(q) ||
        start.includes(q) ||
        end.includes(q)
      );
    });
  }, [getFirmName, getServiceName, getServiceType, query, rows]);

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h3 className="mb-0">Firm Services</h3>
              <span className="badge bg-primary-subtle text-primary">
                {filteredRows.length}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap flex-grow-1 justify-content-end">
            <div
              className="input-group flex-grow-1 me-auto"
              style={{ maxWidth: 520 }}
            >
              <span className="input-group-text bg-white">
                <i className="ti ti-search"></i>
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="Search firm, service, type"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={fetchAll}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              className="btn btn-primary text-nowrap"
              onClick={openCreate}
            >
              <i className="ti ti-plus me-1"></i>
              Add Mapping
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {error ? (
              <div className="alert alert-danger d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div>{error}</div>
                <button
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={fetchAll}
                  disabled={loading}
                >
                  Try again
                </button>
              </div>
            ) : null}

            {loading ? (
              <div className="py-4 text-center">
                <div
                  className="spinner-border"
                  role="status"
                  aria-label="Loading"
                ></div>
                <div className="text-muted mt-2">Loading firm services...</div>
              </div>
            ) : (
              <div className="table-responsive custom-table">
                <table
                  className="table table-hover table-nowrap align-middle mb-0"
                  style={{ tableLayout: "fixed" }}
                >
                  <thead className="table-light">
                    <tr>
                      {columns.map((c) => {
                        const headerClassName =
                          c.key === "actions" ? "text-center" : "";

                        const headerStyle =
                          c.key === "id"
                            ? { width: 90 }
                            : c.key === "firm_id"
                              ? { width: 240 }
                              : c.key === "service_id"
                                ? { width: 240 }
                                : c.key === "type"
                                  ? { width: 180 }
                                  : c.key === "service_price"
                                    ? { width: 120 }
                                    : c.key === "start_date"
                                      ? { width: 140 }
                                      : c.key === "end_date"
                                        ? { width: 140 }
                                        : c.key === "actions"
                                          ? { width: 170 }
                                          : undefined;

                        return (
                          <th
                            key={c.key}
                            className={headerClassName}
                            style={headerStyle}
                          >
                            {c.label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-4"
                        >
                          <div className="text-muted">No records found.</div>
                          {query ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary mt-2"
                              onClick={() => setQuery("")}
                            >
                              Clear search
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((r, index) => {
                        const type = getServiceType(r?.service_id);
                        return (
                          <tr
                            key={
                              r?.id ?? `${r?.firm_id}-${r?.service_id}-${index}`
                            }
                          >
                            <td className="fw-semibold" style={{ width: 90 }}>
                              {index + 1}
                            </td>
                            <td style={{ width: 240 }}>
                              <div
                                className="text-truncate"
                                title={getFirmName(r?.firm_id)}
                              >
                                {getFirmName(r?.firm_id)}
                              </div>
                            </td>
                            <td style={{ width: 240 }}>
                              <div
                                className="text-truncate"
                                title={getServiceName(r?.service_id)}
                              >
                                {getServiceName(r?.service_id)}
                              </div>
                            </td>
                            <td style={{ width: 180 }}>
                              {type ? (
                                <span
                                  className={`badge ${getTypeBadgeClasses(type)}`}
                                  title={type}
                                >
                                  {type}
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td style={{ width: 120 }}>
                              <span className="fw-semibold">
                                {Number(r?.service_price ?? 0).toLocaleString()}
                              </span>
                            </td>
                            <td style={{ width: 140 }}>
                              <span
                                className="text-truncate d-inline-block"
                                style={{ maxWidth: 140 }}
                              >
                                {toDateInputValue(r?.start_date) || "-"}
                              </span>
                            </td>
                            <td style={{ width: 140 }}>
                              <span
                                className="text-truncate d-inline-block"
                                style={{ maxWidth: 140 }}
                              >
                                {toDateInputValue(r?.end_date) || "-"}
                              </span>
                            </td>
                            <td className="text-center" style={{ width: 170 }}>
                              <div className="d-inline-flex gap-2 justify-content-center flex-wrap">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => openEdit(r)}
                                >
                                  Update
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => openDelete(r)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <>
        <div
          className={`offcanvas-backdrop fade ${isCreateOpen ? "show" : ""}`}
          style={{ display: isCreateOpen ? "block" : "none" }}
          onClick={closeCreate}
        ></div>
        <div
          className={`offcanvas offcanvas-end d-flex flex-column ${isCreateOpen ? "show" : ""}`}
          tabIndex={-1}
          role="dialog"
          aria-modal={isCreateOpen ? "true" : undefined}
          aria-label="Add firm service"
          style={{
            visibility: isCreateOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Add Firm Service</h5>
              <div className="text-muted fs-13">Create mapping record.</div>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeCreate}
              disabled={createSaving}
            ></button>
          </div>

          <form
            onSubmit={handleCreate}
            className="d-flex flex-column flex-grow-1"
            style={{ minHeight: 0 }}
          >
            <div
              className="offcanvas-body flex-grow-1"
              style={{ overflowY: "auto", minHeight: 0 }}
            >
              {createError ? (
                <div className="alert alert-danger mb-3">{createError}</div>
              ) : null}

              <div className="mb-3">
                <label className="form-label">Firm</label>
                <select
                  className="form-select"
                  value={createFirmId}
                  onChange={(e) => setCreateFirmId(e.target.value)}
                  autoFocus
                  disabled={createSaving}
                >
                  <option value="">Select firm</option>
                  {firms.map((f) => (
                    <option key={f?.id} value={String(f?.id ?? "")}>
                      {f?.firm_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Service Type</label>
                <select
                  className="form-select"
                  value={createServiceType}
                  onChange={(e) => setCreateServiceType(e.target.value)}
                  disabled={createSaving}
                >
                  <option value="">All types</option>
                  {serviceTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="form-text">
                  Select a type to filter services.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Service</label>
                <select
                  className="form-select"
                  value={createServiceId}
                  onChange={(e) => setCreateServiceId(e.target.value)}
                  disabled={createSaving}
                >
                  <option value="">Select service</option>
                  {filteredCreateServices.map((s) => (
                    <option key={s?.id} value={String(s?.id ?? "")}>
                      {s?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Service Price</label>
                <input
                  inputMode="decimal"
                  className="form-control"
                  value={createServicePrice}
                  onChange={(e) => setCreateServicePrice(e.target.value)}
                  placeholder="0"
                  disabled={createSaving}
                />
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label d-block mb-1">Start Date</label>
                  <DatePicker
                    selected={createStartDate}
                    onChange={(date) => setCreateStartDate(date)}
                    wrapperClassName="app-date-field"
                    customInput={
                      <AppDateInput placeholder="Select start date" />
                    }
                    placeholderText="Select start date"
                    dateFormat={APP_DATE_FORMAT}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                    scrollableYearDropdown
                    yearDropdownItemNumber={101}
                    disabled={createSaving}
                    popperPlacement="bottom-start"
                    popperClassName="app-datepicker-popper"
                    calendarClassName="app-datepicker"
                    showPopperArrow={false}
                    formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                    showDisabledMonthNavigation
                    peekNextMonth
                    fixedHeight
                    minDate={MIN_DATE}
                    maxDate={createEndDate ?? MAX_DATE}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label d-block mb-1">End Date</label>
                  <DatePicker
                    selected={createEndDate}
                    onChange={(date) => setCreateEndDate(date)}
                    wrapperClassName="app-date-field"
                    customInput={<AppDateInput placeholder="Select end date" />}
                    placeholderText="Select end date"
                    dateFormat={APP_DATE_FORMAT}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                    scrollableYearDropdown
                    yearDropdownItemNumber={101}
                    disabled={createSaving}
                    popperPlacement="bottom-start"
                    popperClassName="app-datepicker-popper"
                    calendarClassName="app-datepicker"
                    showPopperArrow={false}
                    formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                    showDisabledMonthNavigation
                    peekNextMonth
                    fixedHeight
                    minDate={createStartDate ?? MIN_DATE}
                    maxDate={MAX_DATE}
                  />
                </div>
              </div>
            </div>

            <div
              className="border-top p-3 d-flex align-items-center justify-content-end gap-2 flex-shrink-0"
              style={{ background: "#fff" }}
            >
              <button
                type="button"
                className="btn btn-light"
                onClick={closeCreate}
                disabled={createSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createSaving}
              >
                {createSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </>

      <>
        <div
          className={`offcanvas-backdrop fade ${isEditOpen ? "show" : ""}`}
          style={{ display: isEditOpen ? "block" : "none" }}
          onClick={closeEdit}
        ></div>
        <div
          className={`offcanvas offcanvas-end d-flex flex-column ${isEditOpen ? "show" : ""}`}
          tabIndex={-1}
          role="dialog"
          aria-modal={isEditOpen ? "true" : undefined}
          aria-label="Update firm service"
          style={{
            visibility: isEditOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Update Firm Service</h5>
              <div className="text-muted fs-13">Update mapping record.</div>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeEdit}
              disabled={editSaving}
            ></button>
          </div>

          <form
            onSubmit={handleEdit}
            className="d-flex flex-column flex-grow-1"
            style={{ minHeight: 0 }}
          >
            <div
              className="offcanvas-body flex-grow-1"
              style={{ overflowY: "auto", minHeight: 0 }}
            >
              {editError ? (
                <div className="alert alert-danger mb-3">{editError}</div>
              ) : null}

              <div className="mb-3">
                <label className="form-label">Firm</label>
                <select
                  className="form-select"
                  value={editFirmId}
                  onChange={(e) => setEditFirmId(e.target.value)}
                  autoFocus
                  disabled={editSaving}
                >
                  <option value="">Select firm</option>
                  {firms.map((f) => (
                    <option key={f?.id} value={String(f?.id ?? "")}>
                      {f?.firm_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Service Type</label>
                <select
                  className="form-select"
                  value={editServiceType}
                  onChange={(e) => setEditServiceType(e.target.value)}
                  disabled={editSaving}
                >
                  <option value="">All types</option>
                  {serviceTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="form-text">
                  Select a type to filter services.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Service</label>
                <select
                  className="form-select"
                  value={editServiceId}
                  onChange={(e) => setEditServiceId(e.target.value)}
                  disabled={editSaving}
                >
                  <option value="">Select service</option>
                  {filteredEditServices.map((s) => (
                    <option key={s?.id} value={String(s?.id ?? "")}>
                      {s?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Service Price</label>
                <input
                  inputMode="decimal"
                  className="form-control"
                  value={editServicePrice}
                  onChange={(e) => setEditServicePrice(e.target.value)}
                  placeholder="0"
                  disabled={editSaving}
                />
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label d-block mb-1">Start Date</label>
                  <DatePicker
                    selected={editStartDate}
                    onChange={(date) => setEditStartDate(date)}
                    wrapperClassName="app-date-field"
                    customInput={
                      <AppDateInput placeholder="Select start date" />
                    }
                    placeholderText="Select start date"
                    dateFormat={APP_DATE_FORMAT}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                    scrollableYearDropdown
                    yearDropdownItemNumber={101}
                    disabled={editSaving}
                    popperPlacement="bottom-start"
                    popperClassName="app-datepicker-popper"
                    calendarClassName="app-datepicker"
                    showPopperArrow={false}
                    formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                    showDisabledMonthNavigation
                    peekNextMonth
                    fixedHeight
                    minDate={MIN_DATE}
                    maxDate={editEndDate ?? MAX_DATE}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label d-block mb-1">End Date</label>
                  <DatePicker
                    selected={editEndDate}
                    onChange={(date) => setEditEndDate(date)}
                    wrapperClassName="app-date-field"
                    customInput={<AppDateInput placeholder="Select end date" />}
                    placeholderText="Select end date"
                    dateFormat={APP_DATE_FORMAT}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                    scrollableYearDropdown
                    yearDropdownItemNumber={101}
                    disabled={editSaving}
                    popperPlacement="bottom-start"
                    popperClassName="app-datepicker-popper"
                    calendarClassName="app-datepicker"
                    showPopperArrow={false}
                    formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
                    showDisabledMonthNavigation
                    peekNextMonth
                    fixedHeight
                    minDate={editStartDate ?? MIN_DATE}
                    maxDate={MAX_DATE}
                  />
                </div>
              </div>
            </div>

            <div
              className="border-top p-3 d-flex align-items-center justify-content-end gap-2 flex-shrink-0"
              style={{ background: "#fff" }}
            >
              <button
                type="button"
                className="btn btn-light"
                onClick={closeEdit}
                disabled={editSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={editSaving}
              >
                {editSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </>

      <>
        <div
          className={`offcanvas-backdrop fade ${isDeleteOpen ? "show" : ""}`}
          style={{ display: isDeleteOpen ? "block" : "none" }}
          onClick={closeDelete}
        ></div>
        <div
          className={`offcanvas offcanvas-end d-flex flex-column ${isDeleteOpen ? "show" : ""}`}
          tabIndex={-1}
          role="dialog"
          aria-modal={isDeleteOpen ? "true" : undefined}
          aria-label="Delete firm service"
          style={{
            visibility: isDeleteOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Delete Firm Service</h5>
              <div className="text-muted fs-13">
                This action cannot be undone.
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeDelete}
              disabled={deleteSaving}
            ></button>
          </div>

          <form
            onSubmit={confirmDelete}
            className="d-flex flex-column flex-grow-1"
            style={{ minHeight: 0 }}
          >
            <div
              className="offcanvas-body flex-grow-1"
              style={{ overflowY: "auto", minHeight: 0 }}
            >
              {deleteError ? (
                <div className="alert alert-danger mb-3">{deleteError}</div>
              ) : null}

              <div className="alert alert-warning mb-0">
                This will permanently delete this mapping
                {deleteRow?.firmName || deleteRow?.serviceName ? (
                  <>
                    {" "}
                    for <b>{deleteRow?.firmName || "-"}</b> /{" "}
                    <b>{deleteRow?.serviceName || "-"}</b>
                  </>
                ) : null}
                .
              </div>
            </div>

            <div
              className="border-top p-3 d-flex align-items-center justify-content-end gap-2 flex-shrink-0"
              style={{ background: "#fff" }}
            >
              <button
                type="button"
                className="btn btn-light"
                onClick={closeDelete}
                disabled={deleteSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={deleteSaving}
              >
                {deleteSaving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </form>
        </div>
      </>
    </div>
  );
}

export default FirmService;
