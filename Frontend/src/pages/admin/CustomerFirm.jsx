import { useEffect, useMemo, useState } from "react";
import api from "@/api/axios";

function resolveUserImageSrc(profilePic) {
  const raw = String(profilePic ?? "").trim();
  if (!raw || raw === "null" || raw === "undefined") return "";
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:")
  ) {
    return raw;
  }

  // If backend returns relative paths like /images/User/xxx.jpg, build an absolute URL.
  const base = String(api?.defaults?.baseURL ?? "");
  const origin = base ? base.replace(/\/api\/?$/i, "") : "";
  if (origin && raw.startsWith("/")) return `${origin}${raw}`;
  return raw;
}

function CustomerFirmAvatar({ name, profilePic }) {
  const [imgOk, setImgOk] = useState(true);
  const src = resolveUserImageSrc(profilePic);
  const hasImage = Boolean(src) && imgOk;

  if (!hasImage) {
    return (
      <span
        className="avatar avatar-sm bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: 32, height: 32 }}
        aria-label="Customer"
      >
        {String(name ?? "?")
          .trim()
          .charAt(0)
          .toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className="avatar avatar-sm avatar-rounded flex-shrink-0"
      aria-label="Customer"
    >
      <img
        src={src}
        alt="Customer"
        className="rounded-circle"
        width={32}
        height={32}
        style={{
          width: 32,
          height: 32,
          objectFit: "cover",
          objectPosition: "center",
        }}
        onError={() => setImgOk(false)}
      />
    </span>
  );
}

function CustomerFirm() {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [customers, setCustomers] = useState([]);
  const [customersError, setCustomersError] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createCustomerId, setCreateCustomerId] = useState("");
  const [createFirmName, setCreateFirmName] = useState("");
  const [createFirmType, setCreateFirmType] = useState("");
  const [createGst, setCreateGst] = useState("");
  const [createPan, setCreatePan] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSaving, setCreateSaving] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [editCustomerId, setEditCustomerId] = useState("");
  const [editFirmName, setEditFirmName] = useState("");
  const [editFirmType, setEditFirmType] = useState("");
  const [editGst, setEditGst] = useState("");
  const [editPan, setEditPan] = useState("");
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteFirm, setDeleteFirm] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSaving, setDeleteSaving] = useState(false);

  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "customer_id", label: "Customer" },
      { key: "firm_name", label: "Firm Name" },
      { key: "firm_type", label: "Firm Type" },
      { key: "gst_number", label: "GST" },
      { key: "pan_number", label: "PAN" },
      { key: "actions", label: "Actions" },
    ],
    [],
  );

  const fetchFirms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/get-customer-firm", {});
      const list = res?.data?.data;

      if (!Array.isArray(list)) {
        throw new Error("Unexpected response from server");
      }

      setFirms(list);
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to load firms.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setCustomersError("");
    try {
      const res = await api.post("/get-user", { role: "customer" });
      const list = res?.data?.user_list;

      if (!Array.isArray(list)) {
        throw new Error("Unexpected response from server");
      }

      setCustomers(list);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load customers.";
      setCustomersError(message);
      setCustomers([]);
    }
  };

  const customerById = useMemo(() => {
    const map = new Map();
    for (const c of customers) {
      const id = Number(c?.id);
      if (!id) continue;
      map.set(id, {
        name: String(c?.name ?? "").trim(),
        profilePic: c?.profile_pic,
      });
    }
    return map;
  }, [customers]);

  const getCustomerMeta = (customerId) => {
    const id = Number(customerId);
    if (!id) return null;
    return customerById.get(id) || null;
  };

  const getCustomerName = (customerId) => {
    const id = Number(customerId);
    if (!id) return "-";
    const meta = customerById.get(id);
    return meta?.name || `Customer #${id}`;
  };

  const getFirmTypeBadgeClasses = (firmType) => {
    const raw = String(firmType ?? "").trim();
    const normalized = raw.toLowerCase();

    const known = {
      proprietorship: "bg-info-subtle text-info",
      partnership: "bg-warning-subtle text-warning",
      "pvt ltd": "bg-primary-subtle text-primary",
      "private limited": "bg-primary-subtle text-primary",
      llp: "bg-success-subtle text-success",
      limited: "bg-secondary-subtle text-secondary",
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

  useEffect(() => {
    fetchFirms();
    fetchCustomers();
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
    setCreateCustomerId("");
    setCreateFirmName("");
    setCreateFirmType("");
    setCreateGst("");
    setCreatePan("");
    setCreateError("");
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    if (createSaving) return;
    setIsCreateOpen(false);
  };

  const openEdit = (firm) => {
    const id = Number(firm?.id ?? 0);
    if (!id) return;

    setEditId(id);
    setEditCustomerId(String(firm?.customer_id ?? ""));
    setEditFirmName(String(firm?.firm_name ?? ""));
    setEditFirmType(String(firm?.firm_type ?? ""));
    setEditGst(String(firm?.gst_number ?? ""));
    setEditPan(String(firm?.pan_number ?? ""));
    setEditError("");
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    if (editSaving) return;
    setIsEditOpen(false);
  };

  const openDelete = (firm) => {
    const id = Number(firm?.id ?? 0);
    if (!id) return;
    setDeleteFirm({ id, firm_name: String(firm?.firm_name ?? "") });
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

    const customerId = Number(String(createCustomerId).trim());
    const firmName = createFirmName.trim();
    const firmType = createFirmType.trim();
    const gst = createGst.trim().toUpperCase();
    const pan = createPan.trim().toUpperCase();

    const errors = [];
    if (!customerId) errors.push("Customer ID is required.");
    if (!firmName) errors.push("Firm name is required.");
    if (!firmType) errors.push("Firm type is required.");

    if (errors.length) {
      setCreateError(errors.join(" "));
      return;
    }

    setCreateSaving(true);
    try {
      const payload = {
        id: 0,
        customer_id: customerId,
        firm_name: firmName,
        firm_type: firmType,
        gst_number: gst,
        pan_number: pan,
      };

      await api.post("/create-customer-firm", payload);
      setIsCreateOpen(false);
      await fetchFirms();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create firm.";
      setCreateError(message);
    } finally {
      setCreateSaving(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditError("");

    const id = Number(editId || 0);
    const customerId = Number(String(editCustomerId).trim());
    const firmName = editFirmName.trim();
    const firmType = editFirmType.trim();
    const gst = editGst.trim().toUpperCase();
    const pan = editPan.trim().toUpperCase();

    const errors = [];
    if (!id) errors.push("Firm not found.");
    if (!customerId) errors.push("Customer ID is required.");
    if (!firmName) errors.push("Firm name is required.");
    if (!firmType) errors.push("Firm type is required.");

    if (errors.length) {
      setEditError(errors.join(" "));
      return;
    }

    setEditSaving(true);
    try {
      const payload = {
        id,
        customer_id: customerId,
        firm_name: firmName,
        firm_type: firmType,
        gst_number: gst,
        pan_number: pan,
      };

      await api.post("/create-customer-firm", payload);
      setIsEditOpen(false);
      await fetchFirms();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update firm.";
      setEditError(message);
    } finally {
      setEditSaving(false);
    }
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");

    const id = Number(deleteFirm?.id ?? 0);
    if (!id) {
      setDeleteError("Firm not found.");
      return;
    }

    setDeleteSaving(true);
    try {
      await api.post("/delete-customer-firm", { id });
      setFirms((prev) => prev.filter((x) => Number(x?.id) !== id));
      setIsDeleteOpen(false);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete firm.";
      setDeleteError(message);
    } finally {
      setDeleteSaving(false);
    }
  };

  const filteredFirms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return firms;

    return firms.filter((f) => {
      const id = String(f?.id ?? "").toLowerCase();
      const customerId = String(f?.customer_id ?? "").toLowerCase();
      const customerName = String(
        getCustomerName(f?.customer_id) ?? "",
      ).toLowerCase();
      const firmName = String(f?.firm_name ?? "").toLowerCase();
      const firmType = String(f?.firm_type ?? "").toLowerCase();
      const gst = String(f?.gst_number ?? "").toLowerCase();
      const pan = String(f?.pan_number ?? "").toLowerCase();

      return (
        id.includes(q) ||
        customerId.includes(q) ||
        customerName.includes(q) ||
        firmName.includes(q) ||
        firmType.includes(q) ||
        gst.includes(q) ||
        pan.includes(q)
      );
    });
  }, [firms, getCustomerName, query]);

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h3 className="mb-0">Customer Firms</h3>
              <span className="badge bg-primary-subtle text-primary">
                {filteredFirms.length}
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
                placeholder="Search firm, customer name, GST, PAN"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={fetchFirms}
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
              Add Firm
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
                  onClick={fetchFirms}
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
                <div className="text-muted mt-2">Loading firms...</div>
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
                            : c.key === "customer_id"
                              ? { width: 220 }
                              : c.key === "firm_name"
                                ? { width: 240 }
                                : c.key === "firm_type"
                                  ? { width: 180 }
                                  : c.key === "gst_number"
                                    ? { width: 170 }
                                    : c.key === "pan_number"
                                      ? { width: 170 }
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
                    {filteredFirms.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-4"
                        >
                          <div className="text-muted">No firms found.</div>
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
                      filteredFirms.map((f, index) => (
                        <tr key={f?.id ?? `${f?.customer_id}-${f?.firm_name}`}>
                          <td className="fw-semibold" style={{ width: 90 }}>
                            {index + 1}
                          </td>
                          <td style={{ width: 220 }}>
                            {(() => {
                              const customerName = getCustomerName(
                                f?.customer_id,
                              );
                              const meta = getCustomerMeta(f?.customer_id);
                              return (
                                <div
                                  className="d-flex align-items-center gap-2 text-truncate"
                                  title={customerName}
                                >
                                  <CustomerFirmAvatar
                                    name={meta?.name || customerName}
                                    profilePic={meta?.profilePic}
                                  />
                                  <span className="text-truncate">
                                    {customerName}
                                  </span>
                                </div>
                              );
                            })()}
                          </td>
                          <td>
                            <div
                              className="text-truncate"
                              style={{ maxWidth: 240 }}
                              title={f?.firm_name}
                            >
                              {f?.firm_name}
                            </div>
                          </td>
                          <td style={{ width: 180 }}>
                            <span
                              className={`badge ${getFirmTypeBadgeClasses(f?.firm_type)}`}
                            >
                              {f?.firm_type}
                            </span>
                          </td>
                          <td style={{ width: 170 }}>
                            <span
                              className="text-truncate d-inline-block"
                              style={{ maxWidth: 170 }}
                              title={f?.gst_number}
                            >
                              {f?.gst_number || "-"}
                            </span>
                          </td>
                          <td style={{ width: 170 }}>
                            <span
                              className="text-truncate d-inline-block"
                              style={{ maxWidth: 170 }}
                              title={f?.pan_number}
                            >
                              {f?.pan_number || "-"}
                            </span>
                          </td>

                          <td className="text-center" style={{ width: 170 }}>
                            <div className="d-inline-flex gap-2 justify-content-center flex-wrap">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => openEdit(f)}
                              >
                                Update
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => openDelete(f)}
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
          aria-label="Add firm"
          style={{
            visibility: isCreateOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Add Firm</h5>
              <div className="text-muted fs-13">
                Create customer firm record.
              </div>
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
                <label className="form-label">Customer Name</label>
                {customers.length ? (
                  <select
                    className="form-select"
                    value={createCustomerId}
                    onChange={(e) => setCreateCustomerId(e.target.value)}
                    autoFocus
                    disabled={createSaving}
                  >
                    <option value="">Select customer</option>
                    {customers.map((c) => (
                      <option key={c?.id} value={String(c?.id ?? "")}>
                        {c?.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    inputMode="numeric"
                    className="form-control"
                    value={createCustomerId}
                    onChange={(e) => setCreateCustomerId(e.target.value)}
                    placeholder="Customer ID"
                    autoFocus
                    disabled={createSaving}
                  />
                )}

                {customersError ? (
                  <div className="text-danger fs-13 mt-1">{customersError}</div>
                ) : null}
              </div>

              <div className="mb-3">
                <label className="form-label">Firm Name</label>
                <input
                  className="form-control"
                  value={createFirmName}
                  onChange={(e) => setCreateFirmName(e.target.value)}
                  placeholder="Firm name"
                  disabled={createSaving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Firm Type</label>
                <input
                  className="form-control"
                  value={createFirmType}
                  onChange={(e) => setCreateFirmType(e.target.value)}
                  placeholder="proprietorship / partnership / pvt ltd"
                  disabled={createSaving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">GST Number (optional)</label>
                <input
                  className="form-control"
                  value={createGst}
                  onChange={(e) => setCreateGst(e.target.value)}
                  placeholder="GST"
                  disabled={createSaving}
                />
              </div>

              <div className="mb-0">
                <label className="form-label">PAN Number (optional)</label>
                <input
                  className="form-control"
                  value={createPan}
                  onChange={(e) => setCreatePan(e.target.value)}
                  placeholder="PAN"
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
          aria-label="Update firm"
          style={{
            visibility: isEditOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Update Firm</h5>
              <div className="text-muted fs-13">
                Update customer firm record.
              </div>
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
                <label className="form-label">Customer Name</label>
                {customers.length ? (
                  <select
                    className="form-select"
                    value={editCustomerId}
                    onChange={(e) => setEditCustomerId(e.target.value)}
                    autoFocus
                    disabled={editSaving}
                  >
                    <option value="">Select customer</option>
                    {customers.map((c) => (
                      <option key={c?.id} value={String(c?.id ?? "")}>
                        {c?.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    inputMode="numeric"
                    className="form-control"
                    value={editCustomerId}
                    onChange={(e) => setEditCustomerId(e.target.value)}
                    placeholder="Customer ID"
                    autoFocus
                    disabled={editSaving}
                  />
                )}

                {customersError ? (
                  <div className="text-danger fs-13 mt-1">{customersError}</div>
                ) : null}
              </div>

              <div className="mb-3">
                <label className="form-label">Firm Name</label>
                <input
                  className="form-control"
                  value={editFirmName}
                  onChange={(e) => setEditFirmName(e.target.value)}
                  placeholder="Firm name"
                  disabled={editSaving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Firm Type</label>
                <input
                  className="form-control"
                  value={editFirmType}
                  onChange={(e) => setEditFirmType(e.target.value)}
                  placeholder="proprietorship / partnership / pvt ltd"
                  disabled={editSaving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">GST Number (optional)</label>
                <input
                  className="form-control"
                  value={editGst}
                  onChange={(e) => setEditGst(e.target.value)}
                  placeholder="GST"
                  disabled={editSaving}
                />
              </div>

              <div className="mb-0">
                <label className="form-label">PAN Number (optional)</label>
                <input
                  className="form-control"
                  value={editPan}
                  onChange={(e) => setEditPan(e.target.value)}
                  placeholder="PAN"
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
          aria-label="Delete firm"
          style={{
            visibility: isDeleteOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Delete Firm</h5>
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
                {deleteFirm?.firm_name
                  ? ` "${deleteFirm.firm_name}"`
                  : " this firm"}
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

export default CustomerFirm;
