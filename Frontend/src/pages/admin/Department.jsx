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

  const base = String(api?.defaults?.baseURL ?? "");
  const origin = base ? base.replace(/\/api\/?$/i, "") : "";
  if (origin && raw.startsWith("/")) return `${origin}${raw}`;
  return raw;
}

function UserAvatar({ name, profilePic, size = 32 }) {
  const [imgOk, setImgOk] = useState(true);
  const src = resolveUserImageSrc(profilePic);
  const hasImage = Boolean(src) && imgOk;
  const label = String(name ?? "").trim() || "User";
  const initial =
    String(name ?? "?")
      .trim()
      .charAt(0)
      .toUpperCase() || "?";

  if (!hasImage) {
    return (
      <span
        className="avatar avatar-sm bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: size, height: size }}
        aria-label={label}
        title={label}
      >
        {initial}
      </span>
    );
  }

  return (
    <span
      className="avatar avatar-sm avatar-rounded flex-shrink-0"
      aria-label={label}
      title={label}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={label}
        width={size}
        height={size}
        className="rounded-circle"
        style={{
          width: size,
          height: size,
          objectFit: "cover",
          objectPosition: "center",
        }}
        onError={() => setImgOk(false)}
      />
    </span>
  );
}

function Department() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteDept, setDeleteDept] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignDept, setAssignDept] = useState(null);
  const [assignQuery, setAssignQuery] = useState("");
  const [assignManagerId, setAssignManagerId] = useState(0);
  const [assignError, setAssignError] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");

  const employeeById = useMemo(() => {
    const map = new Map();
    for (const e of employees) {
      if (e?.id != null) map.set(Number(e.id), e);
    }
    return map;
  }, [employees]);

  const fetchEmployees = async () => {
    try {
      const res = await api.post("/get-user", { role: "employee" });
      const list = res?.data?.user_list;
      if (Array.isArray(list)) setEmployees(list);
      else setEmployees([]);
    } catch {
      // Manager selection is optional; avoid blocking departments UI.
      setEmployees([]);
    }
  };

  const fetchDepartments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/get-department");
      const list = res?.data?.data;
      if (!Array.isArray(list)) {
        throw new Error("Unexpected response from server");
      }
      setDepartments(list);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load departments.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!isAssignModalOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !assignSaving) {
        setIsAssignModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [assignSaving, isAssignModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !saving) {
        setIsModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen, saving]);

  useEffect(() => {
    if (!isDeleteModalOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !deleteSaving) {
        setIsDeleteModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [deleteSaving, isDeleteModalOpen]);

  const filteredDepartments = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((d) => {
      const deptName = String(d?.name ?? "").toLowerCase();
      const manager = employeeById.get(Number(d?.manager_id ?? 0));
      const managerName = String(manager?.name ?? "").toLowerCase();
      const managerPhone = String(manager?.phone ?? "").toLowerCase();
      return (
        deptName.includes(q) ||
        managerName.includes(q) ||
        managerPhone.includes(q)
      );
    });
  }, [departments, employeeById, query]);

  const openCreate = () => {
    setEditId(0);
    setName("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (dept) => {
    setEditId(Number(dept?.id ?? 0));
    setName(String(dept?.name ?? ""));
    setFormError("");
    setIsModalOpen(true);
  };

  const openAssignManager = (dept) => {
    const deptId = Number(dept?.id ?? 0);
    if (!deptId) return;
    setAssignDept({ id: deptId, name: String(dept?.name ?? "") });
    setAssignManagerId(Number(dept?.manager_id ?? 0));
    setAssignQuery("");
    setAssignError("");
    setIsAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    if (assignSaving) return;
    setIsAssignModalOpen(false);
  };

  const filteredEmployees = useMemo(() => {
    const q = assignQuery.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((u) => {
      const name = String(u?.name ?? "").toLowerCase();
      const email = String(u?.email ?? "").toLowerCase();
      const phone = String(u?.phone ?? "").toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [assignQuery, employees]);

  const handleAssignManager = async (e) => {
    e.preventDefault();
    setAssignError("");

    const deptId = Number(assignDept?.id ?? 0);
    const deptName = String(assignDept?.name ?? "").trim();
    if (!deptId || !deptName) {
      setAssignError("Department not found.");
      return;
    }

    setAssignSaving(true);
    try {
      await api.post("/create-department", {
        id: deptId,
        name: deptName,
        manager_id: assignManagerId || 0,
      });

      setIsAssignModalOpen(false);
      await fetchDepartments();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to assign manager.";
      setAssignError(message);
    } finally {
      setAssignSaving(false);
    }
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    const deptName = name.trim();
    if (!deptName) {
      setFormError("Department name is required.");
      return;
    }

    const existingManagerId = editId
      ? Number(
          departments.find((d) => Number(d?.id) === Number(editId))
            ?.manager_id ?? 0,
        )
      : 0;

    setSaving(true);
    try {
      await api.post("/create-department", {
        id: editId || 0,
        name: deptName,
        // Manager assignment is handled via the separate "Assign Manager" drawer.
        // Preserve existing manager on edit; new departments start with no manager.
        manager_id: existingManagerId,
      });

      setIsModalOpen(false);
      await fetchDepartments();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save department.";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dept) => {
    const deptId = Number(dept?.id ?? 0);
    if (!deptId) return;
    setDeleteDept({ id: deptId, name: String(dept?.name ?? "") });
    setDeleteError("");
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleteSaving) return;
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");

    const deptId = Number(deleteDept?.id ?? 0);
    const deptName = String(deleteDept?.name ?? "").trim();
    if (!deptId || !deptName) {
      setDeleteError("Department not found.");
      return;
    }

    setDeleteSaving(true);
    try {
      await api.post("/delete-department", { id: deptId });
      setDepartments((prev) => prev.filter((d) => Number(d?.id) !== deptId));
      setIsDeleteModalOpen(false);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete department.";
      setDeleteError(message);
    } finally {
      setDeleteSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h3 className="mb-0">Departments</h3>
              <span className="badge bg-primary-subtle text-primary">
                {filteredDepartments.length}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap flex-grow-1 justify-content-end">
            <div
              className="input-group flex-grow-1 me-auto"
              style={{ maxWidth: 420 }}
            >
              <span className="input-group-text bg-white">
                <i className="ti ti-search"></i>
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="Search department or manager"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-outline-primary text-nowrap"
              onClick={fetchDepartments}
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
              Add Department
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
                  onClick={fetchDepartments}
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
                <div className="text-muted mt-2">Loading departments...</div>
              </div>
            ) : (
              <div className="table-responsive custom-table">
                <table className="table table-hover table-nowrap align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 250 }}>ID</th>
                      <th>Department</th>
                      <th>Manager</th>
                      <th className="text-end" style={{ width: 220 }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          <div className="text-muted">
                            No departments found.
                          </div>
                          {query ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary mt-2"
                              onClick={() => setQuery("")}
                            >
                              Clear search
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-primary mt-2"
                              onClick={openCreate}
                            >
                              Add your first department
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredDepartments.map((d, index) => {
                        const manager = employeeById.get(
                          Number(d?.manager_id ?? 0),
                        );
                        return (
                          <tr key={d?.id ?? d?.name}>
                            <td className="fw-semibold">{index + 1}</td>
                            <td>
                              <div className="fw-medium text-dark">
                                {d?.name}
                              </div>
                            </td>
                            <td>
                              {d?.manager_id ? (
                                <div className="d-flex align-items-center gap-2">
                                  <UserAvatar
                                    name={manager?.name}
                                    profilePic={manager?.profile_pic}
                                    size={32}
                                  />
                                  <div className="d-flex flex-column">
                                    <span className="fw-medium text-dark">
                                      {manager?.name || "(unknown)"}
                                    </span>
                                    {/* <span className="text-muted fs-13">
                                    {manager?.phone || ""}
                                  </span> */}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                            <td className="text-end">
                              <div
                                className="d-inline-flex gap-1 justify-content-end"
                                style={{
                                  flexWrap: "nowrap",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary text-nowrap"
                                  onClick={() => openAssignManager(d)}
                                >
                                  Assign Manager
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary text-nowrap"
                                  onClick={() => openEdit(d)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger text-nowrap"
                                  onClick={() => handleDelete(d)}
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
          className={`offcanvas-backdrop fade ${isAssignModalOpen ? "show" : ""}`}
          style={{ display: isAssignModalOpen ? "block" : "none" }}
          onClick={closeAssignModal}
        ></div>
        <div
          className={`offcanvas offcanvas-end d-flex flex-column ${isAssignModalOpen ? "show" : ""}`}
          tabIndex={-1}
          role="dialog"
          aria-modal={isAssignModalOpen ? "true" : undefined}
          aria-label="Assign manager"
          style={{
            visibility: isAssignModalOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Assign Manager</h5>
              <div className="text-muted fs-13">
                {assignDept?.name ? `Department: ${assignDept.name}` : ""}
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeAssignModal}
            ></button>
          </div>

          <form
            onSubmit={handleAssignManager}
            className="d-flex flex-column flex-grow-1"
            style={{ minHeight: 0 }}
          >
            <div
              className="offcanvas-body p-0 d-flex flex-column flex-grow-1"
              style={{ overflow: "hidden", minHeight: 0 }}
            >
              <div className="p-3">
                {assignError ? (
                  <div className="alert alert-danger">{assignError}</div>
                ) : null}

                <div className="input-group mb-3">
                  <span className="input-group-text bg-white">
                    <i className="ti ti-search"></i>
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search employee name, email, phone"
                    value={assignQuery}
                    onChange={(e) => setAssignQuery(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="assignManager"
                      id="assignManagerNone"
                      checked={!assignManagerId}
                      onChange={() => setAssignManagerId(0)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="assignManagerNone"
                    >
                      No manager
                    </label>
                  </div>
                </div>
              </div>

              <div
                className="table-responsive flex-grow-1"
                style={{ overflowY: "auto", minHeight: 0 }}
              >
                <table className="table table-sm table-hover align-middle mb-0">
                  <thead className="table-light position-sticky top-0">
                    <tr>
                      <th style={{ width: 44 }}></th>
                      <th>Employee</th>
                      <th className="d-none d-lg-table-cell">Email</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">
                          <div className="text-muted">No employees found.</div>
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((u) => (
                        <tr
                          key={u?.id ?? `${u?.email}-${u?.phone}`}
                          role="button"
                          onClick={() => setAssignManagerId(Number(u?.id) || 0)}
                        >
                          <td>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="assignManager"
                              checked={
                                Number(assignManagerId) === Number(u?.id)
                              }
                              onChange={() =>
                                setAssignManagerId(Number(u?.id) || 0)
                              }
                            />
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <UserAvatar
                                name={u?.name}
                                profilePic={u?.profile_pic}
                                size={32}
                              />
                              <div
                                className="text-truncate"
                                style={{ maxWidth: 260 }}
                              >
                                <div className="fw-medium text-dark text-truncate">
                                  {u?.name}
                                </div>
                                <div className="text-muted fs-13 text-truncate d-lg-none">
                                  {u?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="d-none d-lg-table-cell">
                            <span
                              className="text-truncate d-inline-block"
                              style={{ maxWidth: 260 }}
                            >
                              {u?.email}
                            </span>
                          </td>
                          <td>{u?.phone}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 pt-2">
                <div className="form-text">
                  Only employees can be assigned as manager.
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
                onClick={closeAssignModal}
                disabled={assignSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={assignSaving}
              >
                {assignSaving ? "Assigning..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </>

      <>
        <div
          className={`offcanvas-backdrop fade ${isModalOpen ? "show" : ""}`}
          style={{ display: isModalOpen ? "block" : "none" }}
          onClick={closeModal}
        ></div>
        <div
          className={`offcanvas offcanvas-end d-flex flex-column ${isModalOpen ? "show" : ""}`}
          tabIndex={-1}
          role="dialog"
          aria-modal={isModalOpen ? "true" : undefined}
          aria-label={editId ? "Edit department" : "Add department"}
          style={{
            visibility: isModalOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">
                {editId ? "Edit Department" : "Add Department"}
              </h5>
              <div className="text-muted fs-13">
                Manager is assigned using the "Assign Manager" button.
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
              disabled={saving}
            ></button>
          </div>

          <form
            onSubmit={handleSave}
            className="d-flex flex-column flex-grow-1"
            style={{ minHeight: 0 }}
          >
            <div
              className="offcanvas-body flex-grow-1"
              style={{ overflowY: "auto", minHeight: 0 }}
            >
              {formError ? (
                <div className="alert alert-danger mb-3">{formError}</div>
              ) : null}

              <label className="form-label">Department Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Department name (e.g. Sales)"
                autoFocus
                disabled={saving}
              />
            </div>

            <div
              className="border-top p-3 d-flex align-items-center justify-content-end gap-2 flex-shrink-0"
              style={{ background: "#fff" }}
            >
              <button
                type="button"
                className="btn btn-light"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </>

      <>
        <div
          className={`offcanvas-backdrop fade ${isDeleteModalOpen ? "show" : ""}`}
          style={{ display: isDeleteModalOpen ? "block" : "none" }}
          onClick={closeDeleteModal}
        ></div>
        <div
          className={`offcanvas offcanvas-end d-flex flex-column ${isDeleteModalOpen ? "show" : ""}`}
          tabIndex={-1}
          role="dialog"
          aria-modal={isDeleteModalOpen ? "true" : undefined}
          aria-label="Delete department"
          style={{
            visibility: isDeleteModalOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Delete Department</h5>
              <div className="text-muted fs-13">
                This action cannot be undone.
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeDeleteModal}
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
                {deleteDept?.name
                  ? ` "${deleteDept.name}"`
                  : " this department"}
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
                onClick={closeDeleteModal}
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

export default Department;
