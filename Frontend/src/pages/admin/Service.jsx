import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";

const SERVICE_TYPES = [
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

const RECURRENCE_TYPES = ["MONTHLY", "QUARTERLY", "YEARLY"];

function Service() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const getServiceTypeBadgeClasses = (type) => {
    const raw = String(type ?? "").trim();
    const normalized = raw.toUpperCase();

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

  const getRecurrenceTypeBadgeClasses = (recurrenceType) => {
    const raw = String(recurrenceType ?? "").trim();
    const normalized = raw.toUpperCase();

    const known = {
      MONTHLY: "bg-primary-subtle text-primary",
      QUARTERLY: "bg-warning-subtle text-warning",
      YEARLY: "bg-success-subtle text-success",
      ANNUALLY: "bg-success-subtle text-success",
      WEEKLY: "bg-info-subtle text-info",
      DAILY: "bg-danger-subtle text-danger",
      "HALF YEARLY": "bg-secondary-subtle text-secondary",
      "HALF-YEARLY": "bg-secondary-subtle text-secondary",
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

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createType, setCreateType] = useState("");
  const [createIsRecurring, setCreateIsRecurring] = useState(false);
  const [createRecurrenceType, setCreateRecurrenceType] = useState("");
  const [createBasePrice, setCreateBasePrice] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSaving, setCreateSaving] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editIsRecurring, setEditIsRecurring] = useState(false);
  const [editRecurrenceType, setEditRecurrenceType] = useState("");
  const [editBasePrice, setEditBasePrice] = useState("");
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteService, setDeleteService] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSaving, setDeleteSaving] = useState(false);

  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "name", label: "Service Name" },
      { key: "type", label: "Type" },
      { key: "recurring", label: "Recurring" },
      { key: "recurrence_type", label: "Recurrence Type" },
      { key: "base_price", label: "Base Price" },
      { key: "actions", label: "Actions" },
    ],
    [],
  );

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/get-service", {});
      const list = res?.data?.data;

      if (!Array.isArray(list)) {
        throw new Error("Unexpected response from server");
      }

      setServices(list);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load services.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
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
    setCreateName("");
    setCreateType("");
    setCreateIsRecurring(false);
    setCreateRecurrenceType("");
    setCreateBasePrice("");
    setCreateError("");
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    if (createSaving) return;
    setIsCreateOpen(false);
  };

  const openEdit = (service) => {
    const id = Number(service?.id ?? 0);
    if (!id) return;

    setEditId(id);
    setEditName(String(service?.name ?? ""));
    setEditType(String(service?.type ?? ""));
    setEditIsRecurring(Number(service?.is_recurring ?? 0) === 1);
    setEditRecurrenceType(String(service?.recurrence_type ?? ""));
    setEditBasePrice(String(service?.base_price ?? ""));
    setEditError("");
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    if (editSaving) return;
    setIsEditOpen(false);
  };

  const openDelete = (service) => {
    const id = Number(service?.id ?? 0);
    if (!id) return;

    setDeleteService({ id, name: String(service?.name ?? "") });
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

    const name = createName.trim();
    const type = createType.trim();
    const basePrice = Number(String(createBasePrice).trim());

    const errors = [];
    if (!name) errors.push("Service name is required.");
    if (!type) errors.push("Service type is required.");
    if (Number.isNaN(basePrice)) errors.push("Base price must be a number.");

    if (errors.length) {
      setCreateError(errors.join(" "));
      return;
    }

    setCreateSaving(true);
    try {
      const payload = {
        id: 0,
        name,
        type,
        is_recurring: createIsRecurring ? 1 : 0,
        recurrence_type: createIsRecurring ? createRecurrenceType.trim() : "",
        base_price: basePrice,
      };

      await api.post("/create-service", payload);
      setIsCreateOpen(false);
      await fetchServices();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create service.";
      setCreateError(message);
    } finally {
      setCreateSaving(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditError("");

    const id = Number(editId || 0);
    const name = editName.trim();
    const type = editType.trim();
    const basePrice = Number(String(editBasePrice).trim());

    const errors = [];
    if (!id) errors.push("Service not found.");
    if (!name) errors.push("Service name is required.");
    if (!type) errors.push("Service type is required.");
    if (Number.isNaN(basePrice)) errors.push("Base price must be a number.");

    if (errors.length) {
      setEditError(errors.join(" "));
      return;
    }

    setEditSaving(true);
    try {
      const payload = {
        id,
        name,
        type,
        is_recurring: editIsRecurring ? 1 : 0,
        recurrence_type: editIsRecurring ? editRecurrenceType.trim() : "",
        base_price: basePrice,
      };

      await api.post("/create-service", payload);
      setIsEditOpen(false);
      await fetchServices();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update service.";
      setEditError(message);
    } finally {
      setEditSaving(false);
    }
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");

    const id = Number(deleteService?.id ?? 0);
    if (!id) {
      setDeleteError("Service not found.");
      return;
    }

    setDeleteSaving(true);
    try {
      await api.post("/delete-service", { id });
      setServices((prev) => prev.filter((x) => Number(x?.id) !== id));
      setIsDeleteOpen(false);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete service.";
      setDeleteError(message);
    } finally {
      setDeleteSaving(false);
    }
  };

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;

    return services.filter((s) => {
      const name = String(s?.name ?? "").toLowerCase();
      const type = String(s?.type ?? "").toLowerCase();
      const recurrence = String(s?.recurrence_type ?? "").toLowerCase();
      const price = String(s?.base_price ?? "").toLowerCase();
      return (
        name.includes(q) ||
        type.includes(q) ||
        recurrence.includes(q) ||
        price.includes(q)
      );
    });
  }, [query, services]);

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h3 className="mb-0">Services</h3>
              <span className="badge bg-primary-subtle text-primary">
                {filteredServices.length}
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
                placeholder="Search by name, type, price"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={fetchServices}
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
              Add Service
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
                  onClick={fetchServices}
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
                <div className="text-muted mt-2">Loading services...</div>
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
                            : c.key === "name"
                              ? { width: 260 }
                              : c.key === "type"
                                ? { width: 220 }
                                : c.key === "recurring"
                                  ? { width: 130 }
                                  : c.key === "recurrence_type"
                                    ? { width: 170 }
                                    : c.key === "base_price"
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
                    {filteredServices.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-4"
                        >
                          <div className="text-muted">No services found.</div>
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
                      filteredServices.map((s, index) => (
                        <tr key={s?.id ?? `${s?.name}-${index}`}>
                          <td className="fw-semibold" style={{ width: 90 }}>
                            {index + 1}
                          </td>
                          <td style={{ width: 260 }}>
                            <div
                              className="text-truncate"
                              style={{ maxWidth: 260 }}
                              title={s?.name}
                            >
                              {s?.name}
                            </div>
                          </td>
                          <td style={{ width: 220 }}>
                            <span
                              className={`badge ${getServiceTypeBadgeClasses(s?.type)}`}
                              title={s?.type}
                            >
                              {s?.type}
                            </span>
                          </td>
                          <td style={{ width: 160 }}>
                            {Number(s?.is_recurring ?? 0) === 1 ? (
                              <span className="badge bg-success-subtle text-success">
                                Yes
                              </span>
                            ) : (
                              <span className="badge bg-secondary-subtle text-secondary">
                                No
                              </span>
                            )}
                          </td>
                          <td style={{ width: 170 }}>
                            {Number(s?.is_recurring ?? 0) === 1 ? (
                              s?.recurrence_type ? (
                                <span
                                  className={`badge ${getRecurrenceTypeBadgeClasses(s?.recurrence_type)}`}
                                  title={s?.recurrence_type}
                                >
                                  {s.recurrence_type}
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td style={{ width: 140 }}>
                            <span className="fw-semibold">
                              {Number(s?.base_price ?? 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="text-center" style={{ width: 170 }}>
                            <div className="d-inline-flex gap-2 justify-content-center flex-wrap">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openEdit(s)}
                              >
                                Update
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => openDelete(s)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
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
          aria-label="Add service"
          style={{
            visibility: isCreateOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Add Service</h5>
              <div className="text-muted fs-13">Create service record.</div>
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
                <label className="form-label">Service Name</label>
                <input
                  className="form-control"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Service name"
                  autoFocus
                  disabled={createSaving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={createType}
                  onChange={(e) => setCreateType(e.target.value)}
                  disabled={createSaving}
                >
                  <option value="">Select type</option>
                  {SERVICE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="createRecurring"
                    checked={createIsRecurring}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCreateIsRecurring(checked);
                      if (!checked) setCreateRecurrenceType("");
                    }}
                    disabled={createSaving}
                  />
                  <label className="form-check-label" htmlFor="createRecurring">
                    Is recurring
                  </label>
                </div>
              </div>

              {createIsRecurring ? (
                <div className="mb-3">
                  <label className="form-label">Recurrence Type</label>
                  <select
                    className="form-select"
                    value={createRecurrenceType}
                    onChange={(e) => setCreateRecurrenceType(e.target.value)}
                    disabled={createSaving}
                    required
                  >
                    <option value="">Select recurrence type</option>
                    {RECURRENCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="mb-0">
                <label className="form-label">Base Price</label>
                <input
                  inputMode="decimal"
                  className="form-control"
                  value={createBasePrice}
                  onChange={(e) => setCreateBasePrice(e.target.value)}
                  placeholder="0"
                  disabled={createSaving}
                />
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
          aria-label="Update service"
          style={{
            visibility: isEditOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Update Service</h5>
              <div className="text-muted fs-13">Update service record.</div>
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
                <label className="form-label">Service Name</label>
                <input
                  className="form-control"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Service name"
                  autoFocus
                  disabled={editSaving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  disabled={editSaving}
                >
                  <option value="">Select type</option>
                  {SERVICE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="editRecurring"
                    checked={editIsRecurring}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEditIsRecurring(checked);
                      if (!checked) setEditRecurrenceType("");
                    }}
                    disabled={editSaving}
                  />
                  <label className="form-check-label" htmlFor="editRecurring">
                    Is recurring
                  </label>
                </div>
              </div>

              {editIsRecurring ? (
                <div className="mb-3">
                  <label className="form-label">Recurrence Type</label>
                  <select
                    className="form-select"
                    value={editRecurrenceType}
                    onChange={(e) => setEditRecurrenceType(e.target.value)}
                    disabled={editSaving}
                    required
                  >
                    <option value="">Select recurrence type</option>
                    {RECURRENCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="mb-0">
                <label className="form-label">Base Price</label>
                <input
                  inputMode="decimal"
                  className="form-control"
                  value={editBasePrice}
                  onChange={(e) => setEditBasePrice(e.target.value)}
                  placeholder="0"
                  disabled={editSaving}
                />
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
          aria-label="Delete service"
          style={{
            visibility: isDeleteOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Delete Service</h5>
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
                This will permanently delete
                {deleteService?.name
                  ? ` \"${deleteService.name}\"`
                  : " this service"}
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

export default Service;
