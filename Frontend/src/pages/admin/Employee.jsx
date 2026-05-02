import { useEffect, useMemo, useRef, useState } from "react";
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

function EmployeeAvatar({ name, profilePic }) {
  const [imgOk, setImgOk] = useState(true);
  const src = resolveUserImageSrc(profilePic);
  const hasImage = Boolean(src) && imgOk;

  if (!hasImage) {
    return (
      <span
        className="avatar avatar-sm bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: 32, height: 32 }}
        aria-label="Employee"
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
      aria-label="Employee"
    >
      <img
        src={src}
        alt="Employee"
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

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createProfileFile, setCreateProfileFile] = useState(null);
  const [createProfilePreview, setCreateProfilePreview] = useState("");
  const createProfileInputRef = useRef(null);
  const [createError, setCreateError] = useState("");
  const [createSaving, setCreateSaving] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editExistingProfilePic, setEditExistingProfilePic] = useState("");
  const [editProfileFile, setEditProfileFile] = useState(null);
  const [editProfilePreview, setEditProfilePreview] = useState("");
  const [editRemoveProfilePic, setEditRemoveProfilePic] = useState(false);
  const editProfileInputRef = useRef(null);
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSaving, setDeleteSaving] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [userDepartments, setUserDepartments] = useState([]);
  const [assignUser, setAssignUser] = useState(null);
  const [assignDeptId, setAssignDeptId] = useState("");
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignSaving, setAssignSaving] = useState(false);
  const [assignError, setAssignError] = useState("");

  const currentUserMeta = useMemo(() => {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!raw) return { id: 0, role: "", isManager: false };
    try {
      const parsed = JSON.parse(raw);
      const role = String(parsed?.role ?? "")
        .trim()
        .toLowerCase();
      const isManager = Number(parsed?.is_manager ?? 0) === 1;
      const id = Number(parsed?.id ?? 0);
      return { id, role, isManager };
    } catch {
      return { id: 0, role: "", isManager: false };
    }
  }, []);

  const isAdmin = currentUserMeta.role === "admin";
  const isManager =
    currentUserMeta.role === "employee" && currentUserMeta.isManager;
  const appRole = isAdmin ? "admin" : isManager ? "manager" : "employee";
  const canManageEmployees = isAdmin;
  const canAssignDepartment = isAdmin;

  useEffect(() => {
    return () => {
      if (createProfilePreview) URL.revokeObjectURL(createProfilePreview);
      if (editProfilePreview) URL.revokeObjectURL(editProfilePreview);
    };
  }, [createProfilePreview, editProfilePreview]);

  const columns = useMemo(
    () => [
      { key: "index", label: "ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "department", label: "Department" },
      { key: "role", label: "Role" },
      { key: "actions", label: "Actions" },
    ],
    [],
  );

  const visibleColumns = useMemo(() => {
    // Manager should not have an Actions column.
    if (isAdmin) return columns;
    return columns.filter((c) => c.key !== "actions");
  }, [columns, isAdmin]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/get-user", { role: "employee" });
      const list = res?.data?.user_list;

      if (!Array.isArray(list)) {
        throw new Error("Unexpected response from server");
      }

      setEmployees(list);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load employees.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.post("/get-department");
      const list = res?.data?.data;
      setDepartments(Array.isArray(list) ? list : []);
    } catch (err) {
      setDepartments([]);
    }
  };

  const fetchUserDepartments = async () => {
    try {
      const res = await api.post("/get-user-department");
      const list = res?.data?.data;
      setUserDepartments(Array.isArray(list) ? list : []);
    } catch (err) {
      setUserDepartments([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchUserDepartments();
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
    setCreateEmail("");
    setCreatePhone("");
    setCreatePassword("");
    setCreateProfileFile(null);
    setCreateProfilePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    if (createProfileInputRef.current) createProfileInputRef.current.value = "";
    setCreateError("");
    setIsCreateOpen(true);
  };

  const closeCreate = () => {
    if (createSaving) return;
    setIsCreateOpen(false);
  };

  const openEdit = (u) => {
    const id = Number(u?.id ?? 0);
    if (!id) return;
    setEditId(id);
    setEditName(String(u?.name ?? ""));
    setEditEmail(String(u?.email ?? ""));
    setEditPhone(String(u?.phone ?? ""));
    setEditExistingProfilePic(String(u?.profile_pic ?? ""));
    setEditRemoveProfilePic(false);
    setEditProfileFile(null);
    setEditProfilePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    if (editProfileInputRef.current) editProfileInputRef.current.value = "";
    setEditError("");
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    if (editSaving) return;
    setIsEditOpen(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditError("");

    const id = Number(editId || 0);
    const name = editName.trim();
    const email = editEmail.trim();
    const phone = editPhone.trim();

    const errors = [];
    if (!id) errors.push("User not found.");
    if (!name) errors.push("Name is required.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email))
      errors.push("Valid email is required.");

    const phoneDigits = phone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length !== 10)
      errors.push("Phone must be exactly 10 digits.");

    if (errors.length) {
      setEditError(errors.join(" "));
      return;
    }

    setEditSaving(true);
    try {
      const form = new FormData();
      form.append("id", String(id));
      form.append("name", name);
      form.append("email", email);
      form.append("phone", phoneDigits);
      form.append("role", "employee");
      if (editProfileFile) {
        form.append("profile_pic", editProfileFile);
      } else if (editRemoveProfilePic) {
        form.append("profile_pic", "");
      }

      await api.post("/create-user", form);

      setIsEditOpen(false);
      await fetchEmployees();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update employee.";
      setEditError(message);
    } finally {
      setEditSaving(false);
    }
  };

  const openDelete = (u) => {
    const id = Number(u?.id ?? 0);
    if (!id) return;
    setDeleteUser({ id, name: String(u?.name ?? "") });
    setDeleteError("");
    setIsDeleteOpen(true);
  };

  const closeDelete = () => {
    if (deleteSaving) return;
    setIsDeleteOpen(false);
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");

    const id = Number(deleteUser?.id ?? 0);
    if (!id) {
      setDeleteError("User not found.");
      return;
    }

    setDeleteSaving(true);
    try {
      await api.post("/delete-user", { id });
      setEmployees((prev) => prev.filter((x) => Number(x?.id) !== id));
      setIsDeleteOpen(false);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete employee.";
      setDeleteError(message);
    } finally {
      setDeleteSaving(false);
    }
  };

  const openAssignModal = (user) => {
    if (!canAssignDepartment) return;
    const id = Number(user?.id ?? 0);
    if (!id) return;
    const deptId = userDeptByUserId.get(id);
    setAssignUser(user);
    setAssignDeptId(deptId ? String(deptId) : "");
    setAssignError("");
    setIsAssignOpen(true);
  };

  const closeAssignModal = () => {
    if (assignSaving) return;
    setIsAssignOpen(false);
    setAssignUser(null);
    setAssignDeptId("");
    setAssignError("");
  };

  const handleAssignDepartment = async (e) => {
    e.preventDefault();
    if (!canAssignDepartment) {
      setAssignError("Only admin can assign departments.");
      return;
    }
    setAssignError("");
    const userId = Number(assignUser?.id ?? 0);
    const departmentId = Number(assignDeptId);
    if (!userId) {
      setAssignError("Select an employee.");
      return;
    }
    if (!departmentId) {
      setAssignError("Department is required.");
      return;
    }

    setAssignSaving(true);
    try {
      const payload = {
        id: userDeptIdByUserId.get(userId) ?? 0,
        user_id: userId,
        department_id: departmentId,
      };
      await api.post("/create-user-department", payload);
      await fetchUserDepartments();
      closeAssignModal();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to assign department.";
      setAssignError(message);
    } finally {
      setAssignSaving(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError("");

    const name = createName.trim();
    const email = createEmail.trim();
    const phone = createPhone.trim();
    const password = createPassword;

    const errors = [];
    if (!name) errors.push("Name is required.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email))
      errors.push("Valid email is required.");

    const phoneDigits = phone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length !== 10)
      errors.push("Phone must be exactly 10 digits.");

    if (!password) errors.push("Password is required.");

    if (errors.length) {
      setCreateError(errors.join(" "));
      return;
    }

    setCreateSaving(true);
    try {
      const form = new FormData();
      form.append("id", "0");
      form.append("name", name);
      form.append("email", email);
      form.append("phone", phoneDigits);
      form.append("password", password);
      form.append("role", "employee");
      if (createProfileFile) form.append("profile_pic", createProfileFile);

      await api.post("/create-user", form);

      setIsCreateOpen(false);
      await fetchEmployees();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create employee.";
      setCreateError(message);
    } finally {
      setCreateSaving(false);
    }
  };

  const userDeptByUserId = useMemo(() => {
    const map = new Map();
    for (const row of userDepartments) {
      const userId = Number(row?.user_id ?? 0);
      const departmentId = Number(row?.department_id ?? 0);
      if (userId) {
        map.set(userId, departmentId);
      }
    }
    return map;
  }, [userDepartments]);

  const userDeptIdByUserId = useMemo(() => {
    const map = new Map();
    for (const row of userDepartments) {
      const userId = Number(row?.user_id ?? 0);
      const mappingId = Number(row?.id ?? 0);
      if (userId && mappingId) {
        map.set(userId, mappingId);
      }
    }
    return map;
  }, [userDepartments]);

  const departmentNameById = useMemo(() => {
    const map = new Map();
    for (const dept of departments) {
      const id = Number(dept?.id ?? 0);
      if (!id) continue;
      map.set(id, String(dept?.name ?? "").trim());
    }
    return map;
  }, [departments]);

  const managerDepartmentId = useMemo(
    () => userDeptByUserId.get(currentUserMeta.id) ?? 0,
    [userDeptByUserId, currentUserMeta.id],
  );

  const filteredEmployees = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = employees;

    if (appRole === "manager" && managerDepartmentId) {
      list = list.filter((u) => {
        const uid = Number(u?.id ?? 0);
        return uid && userDeptByUserId.get(uid) === managerDepartmentId;
      });
    }

    if (!q) return list;

    return list.filter((u) => {
      const name = String(u?.name ?? "").toLowerCase();
      const email = String(u?.email ?? "").toLowerCase();
      const phone = String(u?.phone ?? "").toLowerCase();
      const deptId = userDeptByUserId.get(Number(u?.id ?? 0)) ?? 0;
      const deptLabel = String(
        departmentNameById.get(deptId) ?? "",
      ).toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        deptLabel.includes(q)
      );
    });
  }, [
    appRole,
    departmentNameById,
    employees,
    managerDepartmentId,
    query,
    userDeptByUserId,
  ]);

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h3 className="mb-0">Employees</h3>
              <span className="badge bg-primary-subtle text-primary">
                {filteredEmployees.length}
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
                placeholder="Search name, email, phone"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={fetchEmployees}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            {canManageEmployees ? (
              <button
                type="button"
                className="btn btn-primary text-nowrap"
                onClick={openCreate}
              >
                <i className="ti ti-plus me-1"></i>
                Add Employee
              </button>
            ) : null}
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
                  onClick={fetchEmployees}
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
                <div className="text-muted mt-2">Loading employees...</div>
              </div>
            ) : (
              <div className="table-responsive custom-table">
                <table
                  className="table table-hover table-nowrap align-middle mb-0"
                  style={{ tableLayout: "fixed" }}
                >
                  <thead className="table-light">
                    <tr>
                      {visibleColumns.map((c) => {
                        const headerClassName = [
                          c.key === "email" ? "d-none d-lg-table-cell" : "",
                          c.key === "actions" ? "text-center" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");

                        const headerStyle =
                          c.key === "index"
                            ? { width: 80 }
                            : c.key === "name"
                              ? { width: 220 }
                              : c.key === "email"
                                ? { width: 260 }
                                : c.key === "phone"
                                  ? { width: 140 }
                                  : c.key === "department"
                                    ? { width: 160 }
                                    : c.key === "role"
                                      ? { width: 120 }
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
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td
                          colSpan={visibleColumns.length}
                          className="text-center py-4"
                        >
                          <div className="text-muted">No employees found.</div>
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
                      filteredEmployees.map((u, index) => {
                        const userId = Number(u?.id ?? 0);
                        const deptId = userDeptByUserId.get(userId) ?? 0;
                        const deptLabel = deptId
                          ? departmentNameById.get(deptId) || `Dept #${deptId}`
                          : "Unassigned";

                        return (
                          <tr key={u?.id ?? `${u?.email}-${u?.phone}`}>
                            <td className="fw-semibold" style={{ width: 70 }}>
                              {index + 1}
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <EmployeeAvatar
                                  name={u?.name}
                                  profilePic={u?.profile_pic}
                                />
                                <div
                                  className="text-truncate"
                                  style={{ maxWidth: 220 }}
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
                            <td
                              className="d-none d-lg-table-cell"
                              style={{ width: 260 }}
                            >
                              <span
                                className="text-truncate d-inline-block"
                                style={{ maxWidth: 260 }}
                              >
                                {u?.email}
                              </span>
                            </td>
                            <td style={{ width: 140 }}>{u?.phone}</td>
                            <td style={{ width: 160 }}>
                              <span
                                className="text-truncate d-inline-block"
                                style={{ maxWidth: 160 }}
                                title={deptLabel}
                              >
                                {deptLabel}
                              </span>
                            </td>
                            <td style={{ width: 120 }}>
                              <span className="badge bg-success-subtle text-success">
                                {u?.role}
                              </span>
                            </td>

                            {isAdmin ? (
                              <td
                                className="text-center"
                                style={{ width: 170 }}
                              >
                                <div className="d-inline-flex gap-2 justify-content-center flex-wrap">
                                  {canManageEmployees ? (
                                    <>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => openEdit(u)}
                                      >
                                        Update
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => openDelete(u)}
                                      >
                                        Delete
                                      </button>
                                    </>
                                  ) : null}

                                  {canAssignDepartment ? (
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-secondary"
                                      onClick={() => openAssignModal(u)}
                                    >
                                      Assign Department
                                    </button>
                                  ) : null}
                                </div>
                              </td>
                            ) : null}
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
          aria-label="Add employee"
          style={{
            visibility: isCreateOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Add Employee</h5>
              <div className="text-muted fs-13">
                Role will be saved as employee.
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
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Employee name"
                  autoFocus
                  disabled={createSaving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={createSaving}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  inputMode="numeric"
                  className="form-control"
                  value={createPhone}
                  onChange={(e) => setCreatePhone(e.target.value)}
                  placeholder="10 digit phone"
                  disabled={createSaving}
                />
              </div>

              <div className="mb-0">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="Set a password"
                  disabled={createSaving}
                />
              </div>

              <div className="mt-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label
                    className="form-label mb-0"
                    htmlFor="employee-create-profile"
                  >
                    Profile photo
                  </label>
                  <div className="text-muted fs-13">Optional</div>
                </div>

                <div className="border rounded-3 p-3 bg-light">
                  <div className="d-flex align-items-center gap-3">
                    <div className="flex-shrink-0">
                      {createProfilePreview ? (
                        <img
                          src={createProfilePreview}
                          alt="Preview"
                          width={56}
                          height={56}
                          className="rounded-circle"
                          style={{
                            width: 56,
                            height: 56,
                            objectFit: "cover",
                            objectPosition: "center",
                            border: "1px solid rgba(0,0,0,.12)",
                            background: "#fff",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-white border d-flex align-items-center justify-content-center text-muted"
                          style={{ width: 56, height: 56, fontSize: 12 }}
                        >
                          No photo
                        </div>
                      )}
                    </div>

                    <div className="flex-grow-1">
                      <input
                        id="employee-create-profile"
                        ref={createProfileInputRef}
                        type="file"
                        className="form-control"
                        accept="image/*"
                        disabled={createSaving}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setCreateProfileFile(file);
                          setCreateProfilePreview((prev) => {
                            if (prev) URL.revokeObjectURL(prev);
                            return file ? URL.createObjectURL(file) : "";
                          });
                        }}
                      />
                      <div className="form-text">
                        PNG/JPG recommended. Square images look best.
                      </div>
                    </div>

                    {createProfilePreview ? (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        disabled={createSaving}
                        onClick={() => {
                          setCreateProfileFile(null);
                          setCreateProfilePreview((prev) => {
                            if (prev) URL.revokeObjectURL(prev);
                            return "";
                          });
                          if (createProfileInputRef.current)
                            createProfileInputRef.current.value = "";
                        }}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
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
          aria-label="Update employee"
          style={{
            visibility: isEditOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Update Employee</h5>
              <div className="text-muted fs-13">Role stays as employee.</div>
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
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={editSaving}
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={editSaving}
                />
              </div>

              <div className="mb-0">
                <label className="form-label">Phone</label>
                <input
                  inputMode="numeric"
                  className="form-control"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  disabled={editSaving}
                />
              </div>

              <div className="mt-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label
                    className="form-label mb-0"
                    htmlFor="employee-edit-profile"
                  >
                    Profile photo
                  </label>
                  <div className="form-check form-switch m-0">
                    <input
                      id="employee-remove-profile"
                      className="form-check-input"
                      type="checkbox"
                      checked={editRemoveProfilePic}
                      disabled={editSaving}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditRemoveProfilePic(checked);
                        if (checked) {
                          setEditProfileFile(null);
                          setEditProfilePreview((prev) => {
                            if (prev) URL.revokeObjectURL(prev);
                            return "";
                          });
                        }
                      }}
                    />
                    <label
                      className="form-check-label fs-13 text-muted"
                      htmlFor="employee-remove-profile"
                    >
                      Remove
                    </label>
                  </div>
                </div>

                <div className="border rounded-3 p-3 bg-light">
                  <div className="d-flex align-items-center gap-3">
                    <div className="flex-shrink-0">
                      {editProfilePreview ? (
                        <img
                          src={editProfilePreview}
                          alt="Preview"
                          width={56}
                          height={56}
                          className="rounded-circle"
                          style={{
                            width: 56,
                            height: 56,
                            objectFit: "cover",
                            objectPosition: "center",
                            border: "1px solid rgba(0,0,0,.12)",
                            background: "#fff",
                          }}
                        />
                      ) : editExistingProfilePic && !editRemoveProfilePic ? (
                        <img
                          src={resolveUserImageSrc(editExistingProfilePic)}
                          alt="Current"
                          width={56}
                          height={56}
                          className="rounded-circle"
                          style={{
                            width: 56,
                            height: 56,
                            objectFit: "cover",
                            objectPosition: "center",
                            border: "1px solid rgba(0,0,0,.12)",
                            background: "#fff",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-white border d-flex align-items-center justify-content-center text-muted"
                          style={{ width: 56, height: 56, fontSize: 12 }}
                        >
                          No photo
                        </div>
                      )}
                    </div>

                    <div className="flex-grow-1">
                      <input
                        id="employee-edit-profile"
                        ref={editProfileInputRef}
                        type="file"
                        className="form-control"
                        accept="image/*"
                        disabled={editSaving || editRemoveProfilePic}
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setEditProfileFile(file);
                          setEditRemoveProfilePic(false);
                          setEditProfilePreview((prev) => {
                            if (prev) URL.revokeObjectURL(prev);
                            return file ? URL.createObjectURL(file) : "";
                          });
                        }}
                      />
                      <div className="form-text">
                        {editRemoveProfilePic
                          ? "Current photo will be removed."
                          : editProfilePreview
                            ? "New photo selected."
                            : editExistingProfilePic
                              ? "This is the current photo."
                              : "No photo on file."}
                      </div>
                    </div>

                    {editProfilePreview ? (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        disabled={editSaving}
                        onClick={() => {
                          setEditProfileFile(null);
                          setEditProfilePreview((prev) => {
                            if (prev) URL.revokeObjectURL(prev);
                            return "";
                          });
                          if (editProfileInputRef.current)
                            editProfileInputRef.current.value = "";
                        }}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
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
          aria-label="Delete employee"
          style={{
            visibility: isDeleteOpen ? "visible" : "hidden",
            height: "100vh",
            width: "min(560px, 96vw)",
            boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div>
              <h5 className="offcanvas-title mb-0">Delete Employee</h5>
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
                {deleteUser?.name ? ` "${deleteUser.name}"` : " this user"}.
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

      {canAssignDepartment ? (
        <>
          <div
            className={`offcanvas offcanvas-end ${isAssignOpen ? "show" : ""}`}
            tabIndex={-1}
            role="dialog"
            aria-modal={isAssignOpen ? "true" : undefined}
            aria-label="Assign department"
            style={{
              visibility: isAssignOpen ? "visible" : "hidden",
              height: "100vh",
              width: "min(560px, 96vw)",
              boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
            }}
          >
            <div className="offcanvas-header border-bottom">
              <div>
                <h5 className="offcanvas-title mb-0">Assign Department</h5>
                <div className="text-muted fs-13">
                  {assignUser?.name || "Select an employee"}
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeAssignModal}
                disabled={assignSaving}
              ></button>
            </div>

            <form
              onSubmit={handleAssignDepartment}
              className="d-flex flex-column flex-grow-1"
              style={{ minHeight: 0 }}
            >
              <div
                className="offcanvas-body flex-grow-1"
                style={{ overflowY: "auto", minHeight: 0 }}
              >
                {assignError ? (
                  <div className="alert alert-danger mb-3">{assignError}</div>
                ) : null}

                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={assignDeptId}
                    onChange={(e) => setAssignDeptId(e.target.value)}
                    disabled={assignSaving}
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d?.id} value={String(d?.id ?? "")}>
                        {d?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                className="offcanvas-footer border-top p-3 d-flex gap-2 justify-content-end"
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
                  {assignSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>

          {isAssignOpen ? (
            <div
              className="offcanvas-backdrop fade show"
              onClick={closeAssignModal}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default Employee;

