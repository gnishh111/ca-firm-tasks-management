import { useEffect, useMemo, useRef, useState } from "react";
import api from "@/api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker-theme.css";
import { AppDateInput, APP_DATE_FORMAT } from "@/components/AppDateInput";

const PRIORITIES = ["Urgent", "High", "Medium", "Low"];
const TASK_STATUSES = ["Pending", "Running", "Hold", "Completed"];

function normalizeTaskStatus(status) {
  const raw = String(status ?? "").trim();
  const s = raw.toLowerCase();

  if (s === "pending") return "Pending";
  if (s === "running") return "Running";
  if (s === "hold") return "Hold";
  if (s === "completed") return "Completed";

  // Backwards compatibility with older labels
  if (s === "in-progress" || s === "in progress") return "Running";
  if (s === "on-hold" || s === "on hold") return "Hold";
  if (s === "cancelled" || s === "canceled") return "Pending";

  return "Pending";
}
const TASK_PERIODS = [
  "One-Time",
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
];

const MIN_DATE = new Date(2000, 0, 1);
const MAX_DATE = new Date(2100, 11, 31);

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

function TaskAssigneeAvatar({ name, profilePic }) {
  const [imgOk, setImgOk] = useState(true);
  const src = resolveUserImageSrc(profilePic);
  const hasImage = Boolean(src) && imgOk;

  if (!hasImage) {
    const initial = String(name ?? "?")
      .trim()
      .charAt(0)
      .toUpperCase();
    return (
      <span
        className="avatar avatar-xs bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0 me-2"
        style={{ width: 32, height: 32 }}
        aria-label="Assignee"
        title={String(name ?? "").trim() || "Unassigned"}
      >
        {initial || "?"}
      </span>
    );
  }

  return (
    <span
      className="avatar avatar-xs avatar-rounded flex-shrink-0 me-2"
      aria-label="Assignee"
      title={String(name ?? "").trim() || "Assignee"}
      style={{ width: 32, height: 32 }}
    >
      <img
        src={src}
        alt="Assignee"
        width={32}
        height={32}
        style={{
          width: 32,
          height: 32,
          objectFit: "cover",
          objectPosition: "center",
          borderRadius: "50%",
        }}
        onError={() => setImgOk(false)}
      />
    </span>
  );
}

function Task() {
  const [rows, setRows] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [firms, setFirms] = useState([]);
  const [services, setServices] = useState([]);
  const [firmServices, setFirmServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // UI state for the Tasks page layout
  const [taskView, setTaskView] = useState("all"); // all | important | completed
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [starredIds, setStarredIds] = useState(() => new Set());
  const [sectionOpen, setSectionOpen] = useState({
    pending: true,
    running: true,
    hold: true,
    completed: true,
  });

  const [openMenuTaskId, setOpenMenuTaskId] = useState(null);

  const dateRangeElRef = useRef(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createCustomerId, setCreateCustomerId] = useState("");
  const [createFirmId, setCreateFirmId] = useState("");
  const [createServiceId, setCreateServiceId] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createPriority, setCreatePriority] = useState("Medium");
  const [createStatus, setCreateStatus] = useState("Pending");
  const [createPeriod, setCreatePeriod] = useState("One-Time");
  const [createManagerId, setCreateManagerId] = useState("");
  const [createNextRunDate, setCreateNextRunDate] = useState(null);
  const [createLastRunDate, setCreateLastRunDate] = useState(null);
  const [createDueDate, setCreateDueDate] = useState(null);
  const [createError, setCreateError] = useState("");
  const [createSaving, setCreateSaving] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(0);
  const [editCustomerId, setEditCustomerId] = useState("");
  const [editFirmId, setEditFirmId] = useState("");
  const [editServiceId, setEditServiceId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editStatus, setEditStatus] = useState("Pending");
  const [editPeriod, setEditPeriod] = useState("One-Time");
  const [editCreatedBy, setEditCreatedBy] = useState("");
  const [editManagerId, setEditManagerId] = useState("");
  const [editNextRunDate, setEditNextRunDate] = useState(null);
  const [editLastRunDate, setEditLastRunDate] = useState(null);
  const [editDueDate, setEditDueDate] = useState(null);
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSaving, setDeleteSaving] = useState(false);

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statusRow, setStatusRow] = useState(null);
  const [statusValue, setStatusValue] = useState("Pending");
  const [statusError, setStatusError] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);

  const toDateInputValue = (value) => {
    if (!value) return "";

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10);
    }

    const raw = String(value).trim();
    if (!raw || raw === "null" || raw === "undefined") return "";
    if (raw.includes("T")) return raw.split("T")[0];
    if (raw.length >= 10 && raw[4] === "-" && raw[7] === "-") {
      return raw.slice(0, 10);
    }
    return "";
  };

  const pad2 = (v) => String(v).padStart(2, "0");

  const parseYmdToDate = (value) => {
    const ymd = toDateInputValue(value);
    if (!ymd) return null;
    const [y, m, d] = ymd.split("-").map((x) => Number(x));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const formatDateToYmd = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${pad2(m)}-${pad2(d)}`;
  };

  const currentUserMeta = useMemo(() => {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!raw) return { id: 0, role: "", isManager: false };

    try {
      const parsed = JSON.parse(raw);
      const id = Number(parsed?.id ?? 0);
      const role = String(parsed?.role ?? "")
        .trim()
        .toLowerCase();
      const isManager = Number(parsed?.is_manager ?? 0) === 1;
      return { id, role, isManager };
    } catch {
      return { id: 0, role: "", isManager: false };
    }
  }, []);

  const currentUserId = currentUserMeta.id;

  const canCreateOrEditTasks =
    currentUserMeta.role === "admin" ||
    (currentUserMeta.role === "employee" && currentUserMeta.isManager);

  const canUpdateTaskStatus = currentUserMeta.role === "employee";

  const customerById = useMemo(() => {
    const map = new Map();
    for (const u of customers) {
      const id = Number(u?.id);
      if (!id) continue;
      map.set(id, String(u?.full_name ?? u?.name ?? "").trim());
    }
    return map;
  }, [customers]);

  const customerOptions = useMemo(() => {
    const toLabel = (u) => {
      const id = Number(u?.id ?? 0);
      const label = String(
        u?.name ?? u?.full_name ?? u?.email ?? u?.phone ?? "",
      ).trim();
      return label || (id ? `Customer #${id}` : "");
    };

    return (Array.isArray(customers) ? customers : [])
      .map((u) => {
        const value = String(u?.id ?? "");
        return { value, label: toLabel(u) };
      })
      .filter((o) => o.value && o.label)
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [customers]);

  const employeeById = useMemo(() => {
    const map = new Map();
    for (const u of employees) {
      const id = Number(u?.id);
      if (!id) continue;
      map.set(id, String(u?.full_name ?? u?.name ?? "").trim());
    }
    return map;
  }, [employees]);

  const employeeMetaById = useMemo(() => {
    const map = new Map();
    for (const u of employees) {
      const id = Number(u?.id);
      if (!id) continue;
      map.set(id, {
        id,
        name: String(u?.full_name ?? u?.name ?? "").trim(),
        profilePic: u?.profile_pic,
      });
    }
    return map;
  }, [employees]);

  const employeeOptions = useMemo(() => {
    const toLabel = (u) => {
      const id = Number(u?.id ?? 0);
      const label = String(
        u?.name ?? u?.full_name ?? u?.email ?? u?.phone ?? "",
      ).trim();
      return label || (id ? `User #${id}` : "");
    };

    return (Array.isArray(employees) ? employees : [])
      .map((u) => {
        const value = String(u?.id ?? "");
        return { value, label: toLabel(u), isManager: Number(u?.is_manager) };
      })
      .filter((o) => o.value && o.label)
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [employees]);

  const managerOptions = useMemo(() => {
    // In Task assignment (manager_id), only show non-manager employees.
    // If someone is already a manager (is_manager === 1), hide them from this dropdown.
    return employeeOptions.filter((o) => o.isManager !== 1);
  }, [employeeOptions]);

  const firmById = useMemo(() => {
    const map = new Map();
    for (const f of firms) {
      const id = Number(f?.id);
      if (!id) continue;
      map.set(id, {
        id,
        name: String(f?.firm_name ?? "").trim(),
        customerId: Number(f?.customer_id ?? 0),
      });
    }
    return map;
  }, [firms]);

  const serviceById = useMemo(() => {
    const map = new Map();
    for (const s of services) {
      const id = Number(s?.id);
      if (!id) continue;
      map.set(id, { id, name: String(s?.name ?? "").trim() });
    }
    return map;
  }, [services]);

  const firmServiceIdsByFirmId = useMemo(() => {
    const map = new Map();
    for (const fs of Array.isArray(firmServices) ? firmServices : []) {
      const firmId = Number(fs?.firm_id ?? 0);
      const serviceId = Number(fs?.service_id ?? 0);
      if (!firmId || !serviceId) continue;
      let set = map.get(firmId);
      if (!set) {
        set = new Set();
        map.set(firmId, set);
      }
      set.add(serviceId);
    }
    return map;
  }, [firmServices]);

  const getCustomerName = (customerId) => {
    const id = Number(customerId);
    if (!id) return "-";
    return customerById.get(id) || `Customer #${id}`;
  };

  const getEmployeeName = (employeeId) => {
    const id = Number(employeeId);
    if (!id) return "-";
    return employeeById.get(id) || `User #${id}`;
  };

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

  const filteredCreateFirms = useMemo(() => {
    const cid = Number(createCustomerId);
    if (!cid) return firms;
    return firms.filter((f) => Number(f?.customer_id) === cid);
  }, [createCustomerId, firms]);

  const filteredEditFirms = useMemo(() => {
    const cid = Number(editCustomerId);
    if (!cid) return firms;
    return firms.filter((f) => Number(f?.customer_id) === cid);
  }, [editCustomerId, firms]);

  const filteredCreateServices = useMemo(() => {
    const fid = Number(createFirmId);
    if (!fid) return services;
    const allowed = firmServiceIdsByFirmId.get(fid);
    if (!allowed) return [];
    return services.filter((s) => allowed.has(Number(s?.id ?? 0)));
  }, [createFirmId, firmServiceIdsByFirmId, services]);

  const filteredEditServices = useMemo(() => {
    const fid = Number(editFirmId);
    if (!fid) return services;
    const allowed = firmServiceIdsByFirmId.get(fid);
    if (!allowed) return [];
    return services.filter((s) => allowed.has(Number(s?.id ?? 0)));
  }, [editFirmId, firmServiceIdsByFirmId, services]);

  useEffect(() => {
    if (!createFirmId) return;
    const cid = Number(createCustomerId);
    if (!cid) return;
    const firm = firmById.get(Number(createFirmId));
    if (firm && firm.customerId !== cid) setCreateFirmId("");
  }, [createCustomerId, createFirmId, firmById]);

  useEffect(() => {
    const fid = Number(createFirmId);
    if (!fid) return;
    const sid = Number(createServiceId);
    if (!sid) return;
    const allowed = firmServiceIdsByFirmId.get(fid);
    if (allowed && !allowed.has(sid)) setCreateServiceId("");
  }, [createFirmId, createServiceId, firmServiceIdsByFirmId]);

  useEffect(() => {
    if (!editFirmId) return;
    const cid = Number(editCustomerId);
    if (!cid) return;
    const firm = firmById.get(Number(editFirmId));
    if (firm && firm.customerId !== cid) setEditFirmId("");
  }, [editCustomerId, editFirmId, firmById]);

  useEffect(() => {
    const fid = Number(editFirmId);
    if (!fid) return;
    const sid = Number(editServiceId);
    if (!sid) return;
    const allowed = firmServiceIdsByFirmId.get(fid);
    if (allowed && !allowed.has(sid)) setEditServiceId("");
  }, [editFirmId, editServiceId, firmServiceIdsByFirmId]);

  const formatPrettyDate = (value) => {
    const dt = parseYmdToDate(value);
    if (!dt) return "-";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(dt);
  };

  const formatPrettyRange = (start, end) => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });
    if (start && end) return `${fmt.format(start)} - ${fmt.format(end)}`;
    if (start) return `${fmt.format(start)} - ...`;
    return "Select Date Range";
  };

  // Theme-style date range picker (presets + Apply/Cancel)
  useEffect(() => {
    let alive = true;

    const init = async () => {
      try {
        if (!dateRangeElRef.current) return;

        const jqueryModule = await import("jquery");
        const $ = jqueryModule.default ?? jqueryModule;
        if (typeof $ !== "function") {
          throw new Error("jQuery import did not return a function");
        }
        window.$ = window.jQuery = $;

        const momentModule = await import("moment");
        const moment = momentModule.default ?? momentModule;
        if (typeof moment !== "function") {
          throw new Error("moment import did not return a function");
        }
        window.moment = moment;

        await import("daterangepicker");

        if (!alive || !dateRangeElRef.current) return;

        const $el = $(dateRangeElRef.current);

        // Clean existing instance (React StrictMode/dev remount safety)
        const existing = $el.data("daterangepicker");
        if (existing) {
          existing.remove();
          $el.off("apply.daterangepicker cancel.daterangepicker");
        }

        const m = window.moment;
        const [start, end] = dateRange;
        const startDate = start ? m(start) : m().startOf("day");
        const endDate = end ? m(end) : m().endOf("day");

        $el.daterangepicker({
          startDate,
          endDate,
          opens: "right",
          drops: "down",
          parentEl: "body",
          linkedCalendars: false,
          showDropdowns: true,
          alwaysShowCalendars: false,
          showCustomRangeLabel: true,
          autoUpdateInput: false,
          autoApply: false,
          locale: {
            format: "DD MMM YY",
            applyLabel: "Apply",
            cancelLabel: "Cancel",
          },
          ranges: {
            Today: [m(), m()],
            Yesterday: [m().subtract(1, "days"), m().subtract(1, "days")],
            "Last 7 Days": [m().subtract(6, "days"), m()],
            "Last 30 Days": [m().subtract(29, "days"), m()],
            "This Month": [m().startOf("month"), m().endOf("month")],
            "Last Month": [
              m().subtract(1, "month").startOf("month"),
              m().subtract(1, "month").endOf("month"),
            ],
          },
        });

        // Only commit selection when user presses Apply
        $el.on("apply.daterangepicker", (_ev, picker) => {
          setDateRange([picker.startDate.toDate(), picker.endDate.toDate()]);
        });
      } catch (e) {
        // If daterangepicker/jquery fails to load, keep the page usable.
        console.error("Date range picker init failed:", e);
      }
    };

    init();

    return () => {
      alive = false;
      try {
        if (window.$ && dateRangeElRef.current) {
          const $el = window.$(dateRangeElRef.current);
          const inst = $el.data("daterangepicker");
          if (inst) inst.remove();
          $el.off("apply.daterangepicker cancel.daterangepicker");
        }
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep daterangepicker in sync if we reset dateRange from UI
  useEffect(() => {
    try {
      if (!window.$ || !window.moment || !dateRangeElRef.current) return;
      const $el = window.$(dateRangeElRef.current);
      const inst = $el.data("daterangepicker");
      if (!inst) return;

      const m = window.moment;
      const [start, end] = dateRange;
      const startDate = start ? m(start) : m().startOf("day");
      const endDate = end ? m(end) : m().endOf("day");
      inst.setStartDate(startDate);
      inst.setEndDate(endDate);
    } catch {
      // ignore
    }
  }, [dateRange]);

  const closeDateRangePopover = () => {
    try {
      if (!window.$ || !dateRangeElRef.current) return;
      const $el = window.$(dateRangeElRef.current);
      const inst = $el.data("daterangepicker");
      if (inst && typeof inst.hide === "function") inst.hide();
    } catch {
      // ignore
    }
  };

  const getServiceBadgeClasses = (serviceName) => {
    const raw = String(serviceName ?? "").trim();
    const normalized = raw.toUpperCase();

    const known = {
      ACCOUNTING: "bg-primary-subtle text-primary",
      AUDIT: "bg-warning-subtle text-warning",
      "GST RETURN FILING": "bg-success-subtle text-success",
      "INCOME TAX RETURN FILING": "bg-info-subtle text-info",
      REGISTRATION: "bg-secondary-subtle text-secondary",
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

  const getSoftStatusBadge = (status) => {
    const s = String(status ?? "")
      .trim()
      .toLowerCase();
    if (s === "completed") return "bg-success-subtle text-success";
    if (s === "running" || s === "in-progress")
      return "bg-info-subtle text-info";
    if (s === "hold" || s === "on-hold") return "bg-danger-subtle text-danger";
    if (s === "pending") return "bg-warning-subtle text-warning";
    return "bg-secondary-subtle text-secondary";
  };

  const getBorderForPriority = (priority) => {
    const p = String(priority ?? "")
      .trim()
      .toLowerCase();
    if (p === "urgent") return "border-danger";
    if (p === "high") return "border-warning";
    if (p === "medium") return "border-info";
    if (p === "low") return "border-success";
    return "border-secondary";
  };

  const getSoftPriorityBadge = (priority) => {
    const p = String(priority ?? "")
      .trim()
      .toLowerCase();
    if (p === "urgent") return "bg-danger-subtle text-danger";
    if (p === "high") return "bg-warning-subtle text-warning";
    if (p === "medium") return "bg-info-subtle text-info";
    if (p === "low") return "bg-success-subtle text-success";
    return "bg-secondary-subtle text-secondary";
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpenMenuTaskId(null);
    };
    const onWindowClick = () => setOpenMenuTaskId(null);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onWindowClick);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onWindowClick);
    };
  }, []);

  const toggleSelected = (id) => {
    const tid = Number(id);
    if (!tid) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(tid)) next.delete(tid);
      else next.add(tid);
      return next;
    });
  };

  const toggleStarred = (id) => {
    const tid = Number(id);
    if (!tid) return;
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(tid)) next.delete(tid);
      else next.add(tid);
      return next;
    });
  };

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [
        tasksRes,
        firmsRes,
        servicesRes,
        firmServicesRes,
        customersRes,
        employeesRes,
      ] = await Promise.all([
        api.post("/get-task", {}),
        api.post("/get-customer-firm", {}),
        api.post("/get-service", {}),
        api.post("/get-firm-service", {}),
        api.post("/get-user", { role: "customer" }),
        api.post("/get-user", { role: "employee" }),
      ]);

      const taskList = tasksRes?.data?.data;
      const firmList = firmsRes?.data?.data;
      const serviceList = servicesRes?.data?.data;
      const firmServiceList = firmServicesRes?.data?.data;
      const customerList =
        customersRes?.data?.user_list ?? customersRes?.data?.data;
      const employeeList =
        employeesRes?.data?.user_list ?? employeesRes?.data?.data;

      if (!Array.isArray(taskList)) throw new Error("Unexpected tasks list");
      if (!Array.isArray(firmList)) throw new Error("Unexpected firms list");
      if (!Array.isArray(serviceList))
        throw new Error("Unexpected services list");
      if (!Array.isArray(firmServiceList))
        throw new Error("Unexpected firm services list");

      // Dashboard requirement: show current user's tasks without changing the UI.
      // Admin: sees all tasks. Others: tasks created by them OR assigned to them.
      const filteredTasks =
        currentUserMeta.role === "admin" || !currentUserId
          ? taskList
          : taskList.filter((t) => {
              const createdBy = Number(t?.created_by ?? 0);
              const assigneeId = Number(t?.manager_id ?? 0);
              return (
                createdBy === currentUserId || assigneeId === currentUserId
              );
            });

      setRows(filteredTasks);
      setFirms(firmList);
      setServices(serviceList);
      setFirmServices(firmServiceList);
      setCustomers(Array.isArray(customerList) ? customerList : []);
      setEmployees(Array.isArray(employeeList) ? employeeList : []);
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to load tasks.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setCreateCustomerId("");
    setCreateFirmId("");
    setCreateServiceId("");
    setCreateTitle("");
    setCreateDescription("");
    setCreatePriority("Medium");
    setCreateStatus("Pending");
    setCreatePeriod("One-Time");
    setCreateManagerId("");
    setCreateNextRunDate(null);
    setCreateLastRunDate(null);
    setCreateDueDate(null);
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
    setEditCustomerId(String(row?.customer_id ?? ""));
    setEditFirmId(String(row?.firm_id ?? ""));
    setEditServiceId(String(row?.service_id ?? ""));
    setEditTitle(String(row?.title ?? ""));
    setEditDescription(String(row?.description ?? ""));
    setEditPriority(String(row?.priority ?? "Medium"));
    setEditStatus(normalizeTaskStatus(row?.task_status));
    setEditPeriod(String(row?.task_period ?? "One-Time"));
    setEditCreatedBy(String(row?.created_by ?? currentUserId ?? ""));
    setEditManagerId(String(row?.manager_id ?? ""));
    setEditNextRunDate(parseYmdToDate(row?.next_run_date));
    setEditLastRunDate(parseYmdToDate(row?.last_run_date));
    setEditDueDate(parseYmdToDate(row?.due_date));
    setEditError("");
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    if (editSaving) return;
    setIsEditOpen(false);
  };

  const openDelete = (row) => {
    const id = Number(row?.id ?? 0);
    if (!id) return;

    setDeleteRow({
      id,
      title: String(row?.title ?? "").trim() || `Task #${id}`,
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

    const customerId = Number(String(createCustomerId).trim());
    const firmId = Number(String(createFirmId).trim());
    const serviceId = Number(String(createServiceId).trim());
    const createdBy = Number(currentUserId || 0);
    const managerId = Number(String(createManagerId).trim());

    const title = String(createTitle).trim();
    const description = String(createDescription).trim();
    const priority = String(createPriority).trim();
    const taskStatus = String(createStatus).trim();
    const taskPeriod = String(createPeriod).trim();
    const nextRunDate = formatDateToYmd(createNextRunDate);
    const lastRunDate = formatDateToYmd(createLastRunDate);
    const dueDate = formatDateToYmd(createDueDate);

    const errors = [];
    if (!customerId) errors.push("Customer is required.");
    if (!firmId) errors.push("Firm is required.");
    if (!serviceId) errors.push("Service is required.");
    if (!title) errors.push("Title is required.");
    if (!createdBy) errors.push("User session not found. Please login again.");
    if (!managerId) errors.push("Manager is required.");
    if (!priority) errors.push("Priority is required.");
    if (!taskPeriod) errors.push("Task Period is required.");

    if (errors.length) {
      setCreateError(errors.join(" "));
      return;
    }

    setCreateSaving(true);
    try {
      const payload = {
        id: 0,
        customer_id: customerId,
        firm_id: firmId,
        service_id: serviceId,
        title,
        description,
        priority,
        task_status: taskStatus,
        created_by: createdBy,
        manager_id: managerId,
        next_run_date: nextRunDate || "",
        last_run_date: lastRunDate || "",
        due_date: dueDate || "",
        task_period: taskPeriod,
      };

      await api.post("/create-task", payload);
      setIsCreateOpen(false);
      await fetchAll();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create task.";
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
    const firmId = Number(String(editFirmId).trim());
    const serviceId = Number(String(editServiceId).trim());
    const createdBy =
      Number(String(editCreatedBy).trim()) || Number(currentUserId || 0);
    const managerId = Number(String(editManagerId).trim());

    const title = String(editTitle).trim();
    const description = String(editDescription).trim();
    const priority = String(editPriority).trim();
    const taskStatus = String(editStatus).trim();
    const taskPeriod = String(editPeriod).trim();
    const nextRunDate = formatDateToYmd(editNextRunDate);
    const lastRunDate = formatDateToYmd(editLastRunDate);
    const dueDate = formatDateToYmd(editDueDate);

    const errors = [];
    if (!id) errors.push("Record not found.");
    if (!customerId) errors.push("Customer is required.");
    if (!firmId) errors.push("Firm is required.");
    if (!serviceId) errors.push("Service is required.");
    if (!title) errors.push("Title is required.");
    if (!createdBy) errors.push("User session not found. Please login again.");
    if (!managerId) errors.push("Manager is required.");
    if (!priority) errors.push("Priority is required.");
    if (!taskPeriod) errors.push("Task Period is required.");

    if (errors.length) {
      setEditError(errors.join(" "));
      return;
    }

    setEditSaving(true);
    try {
      const payload = {
        id,
        customer_id: customerId,
        firm_id: firmId,
        service_id: serviceId,
        title,
        description,
        priority,
        task_status: taskStatus,
        created_by: createdBy,
        manager_id: managerId,
        next_run_date: nextRunDate || "",
        last_run_date: lastRunDate || "",
        due_date: dueDate || "",
        task_period: taskPeriod,
      };

      await api.post("/create-task", payload);
      setIsEditOpen(false);
      await fetchAll();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update task.";
      setEditError(message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteRow?.id) return;
    setDeleteError("");
    setDeleteSaving(true);
    try {
      await api.post("/delete-task", { id: deleteRow.id });
      setIsDeleteOpen(false);
      await fetchAll();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete task.";
      setDeleteError(message);
    } finally {
      setDeleteSaving(false);
    }
  };

  const buildTaskPayloadFromRow = (row, overrides = {}) => {
    const id = Number(row?.id ?? 0);
    const customerId = Number(row?.customer_id ?? 0);
    const firmId = Number(row?.firm_id ?? 0);
    const serviceId = Number(row?.service_id ?? 0);
    const createdBy = Number(row?.created_by ?? currentUserId ?? 0);
    const managerId = Number(row?.manager_id ?? 0);

    const title = String(row?.title ?? "").trim();
    const description = String(row?.description ?? "").trim();
    const priority = String(row?.priority ?? "Medium").trim() || "Medium";
    const taskPeriod =
      String(row?.task_period ?? "One-Time").trim() || "One-Time";

    const nextRunDate = toDateInputValue(row?.next_run_date);
    const lastRunDate = toDateInputValue(row?.last_run_date);
    const dueDate = toDateInputValue(row?.due_date);

    const taskStatus = String(
      overrides?.task_status ?? row?.task_status ?? "Pending",
    ).trim();

    return {
      id,
      customer_id: customerId,
      firm_id: firmId,
      service_id: serviceId,
      title,
      description,
      priority,
      task_status: taskStatus,
      created_by: createdBy,
      manager_id: managerId,
      next_run_date: nextRunDate || "",
      last_run_date: lastRunDate || "",
      due_date: dueDate || "",
      task_period: taskPeriod,
    };
  };

  const openStatus = (row) => {
    const id = Number(row?.id ?? 0);
    if (!id) return;
    setStatusRow(row);
    setStatusValue(normalizeTaskStatus(row?.task_status));
    setStatusError("");
    setIsStatusOpen(true);
  };

  const closeStatus = () => {
    if (statusSaving) return;
    setIsStatusOpen(false);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setStatusError("");

    const id = Number(statusRow?.id ?? 0);
    const nextStatus = String(statusValue ?? "").trim();
    if (!id) {
      setStatusError("Record not found.");
      return;
    }
    if (!TASK_STATUSES.includes(nextStatus)) {
      setStatusError("Please select a valid status.");
      return;
    }

    setStatusSaving(true);
    try {
      const payload = buildTaskPayloadFromRow(statusRow, {
        task_status: nextStatus,
      });

      await api.post("/create-task", payload);
      setIsStatusOpen(false);
      await fetchAll();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update task status.";
      setStatusError(message);
    } finally {
      setStatusSaving(false);
    }
  };

  const roleFilteredRows = useMemo(() => {
    if (!currentUserMeta?.id) return [];
    if (currentUserMeta.role === "admin") return rows;

    if (currentUserMeta.isManager) {
      return rows.filter(
        (r) => Number(r?.created_by ?? 0) === Number(currentUserMeta.id),
      );
    }

    return rows.filter(
      (r) => Number(r?.manager_id ?? 0) === Number(currentUserMeta.id),
    );
  }, [currentUserMeta, rows]);

  const filteredRows = useMemo(() => {
    const q = String(query ?? "")
      .trim()
      .toLowerCase();
    if (!q) return roleFilteredRows;

    return roleFilteredRows.filter((r) => {
      const title = String(r?.title ?? "").toLowerCase();
      const customer = getCustomerName(r?.customer_id).toLowerCase();
      const firm = getFirmName(r?.firm_id).toLowerCase();
      const service = getServiceName(r?.service_id).toLowerCase();
      const manager = getEmployeeName(r?.manager_id).toLowerCase();
      const priority = String(r?.priority ?? "").toLowerCase();
      const status = String(r?.task_status ?? "").toLowerCase();
      const period = String(r?.task_period ?? "").toLowerCase();

      return (
        title.includes(q) ||
        customer.includes(q) ||
        firm.includes(q) ||
        service.includes(q) ||
        manager.includes(q) ||
        priority.includes(q) ||
        status.includes(q) ||
        period.includes(q)
      );
    });
  }, [
    query,
    roleFilteredRows,
    getCustomerName,
    getEmployeeName,
    getFirmName,
    getServiceName,
  ]);

  const visibleRows = useMemo(() => {
    let list = filteredRows;

    if (taskView === "completed") {
      list = list.filter(
        (r) => String(r?.task_status ?? "").toLowerCase() === "completed",
      );
    } else if (taskView === "important") {
      list = list.filter((r) => starredIds.has(Number(r?.id)));
    }

    const sorted = [...list].sort((a, b) => {
      const ad = parseYmdToDate(a?.due_date)?.getTime() ?? 0;
      const bd = parseYmdToDate(b?.due_date)?.getTime() ?? 0;
      return sortBy === "oldest" ? ad - bd : bd - ad;
    });

    const [start, end] = dateRange;
    if (start && end) {
      const startMs = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        0,
        0,
        0,
        0,
      ).getTime();
      const endMs = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
        23,
        59,
        59,
        999,
      ).getTime();
      return sorted.filter((r) => {
        const due = parseYmdToDate(r?.due_date);
        if (!due) return true;
        const ms = due.getTime();
        return ms >= startMs && ms <= endMs;
      });
    }

    return sorted;
  }, [dateRange, filteredRows, parseYmdToDate, sortBy, starredIds, taskView]);

  const groupedRows = useMemo(() => {
    const pending = [];
    const running = [];
    const hold = [];
    const completed = [];

    for (const r of visibleRows) {
      const status = normalizeTaskStatus(r?.task_status).toLowerCase();
      if (status === "pending") pending.push(r);
      else if (status === "running") running.push(r);
      else if (status === "hold") hold.push(r);
      else completed.push(r);
    }

    return { pending, running, hold, completed };
  }, [visibleRows]);

  const allSelected = useMemo(() => {
    if (!visibleRows.length) return false;
    for (const r of visibleRows) {
      const id = Number(r?.id);
      if (!id) continue;
      if (!selectedIds.has(id)) return false;
    }
    return true;
  }, [selectedIds, visibleRows]);

  const setAllSelected = (checked) => {
    setSelectedIds(() => {
      if (!checked) return new Set();
      const next = new Set();
      for (const r of visibleRows) {
        const id = Number(r?.id);
        if (id) next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        {/* Page Header (matches theme tasks.html layout) */}
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div>
            <h3 className="mb-1">
              Tasks
              <span className="badge badge-soft-primary ms-2">
                {visibleRows.length}
              </span>
            </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Tasks
                </li>
              </ol>
            </nav>
          </div>

          <div className="gap-2 d-flex align-items-center flex-wrap">
            <div className="dropdown">
              <a
                href="#"
                className="dropdown-toggle btn btn-outline-light px-2 shadow"
                data-bs-toggle="dropdown"
                onClick={(e) => e.preventDefault()}
              >
                <i className="ti ti-package-export me-2"></i>Export
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <ul className="mb-0">
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="ti ti-file-type-pdf me-1"></i>Export as PDF
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="ti ti-file-type-xls me-1"></i>Export as
                      Excel
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-icon btn-outline-light shadow"
              onClick={fetchAll}
              disabled={loading}
              aria-label="Refresh"
              title="Refresh"
            >
              <i className="ti ti-refresh"></i>
            </button>

            <button
              type="button"
              className="btn btn-icon btn-outline-light shadow"
              aria-label="Collapse"
              title="Collapse"
              onClick={() => {
                setSectionOpen({
                  pending: false,
                  running: false,
                  hold: false,
                  completed: false,
                });
              }}
            >
              <i className="ti ti-transition-top"></i>
            </button>
          </div>
        </div>

        <div className="card border-0 rounded-0">
          <div className="card-header d-flex align-items-center justify-content-between gap-2 flex-wrap">
            <div className="input-icon input-icon-start position-relative">
              <span className="input-icon-addon text-dark">
                <i className="ti ti-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {canCreateOrEditTasks ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={openCreate}
              >
                <i className="ti ti-square-rounded-plus-filled me-1"></i>Add New
                Task
              </button>
            ) : null}
          </div>

          <div className="card-body">
            {error ? (
              <div className="alert alert-danger mb-3">{error}</div>
            ) : null}

            {/* Filter / Sort Bar */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="dropdown">
                  <a
                    className="dropdown-toggle btn btn-outline-light shadow"
                    data-bs-toggle="dropdown"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    {taskView === "important"
                      ? "Important"
                      : taskView === "completed"
                        ? "Completed"
                        : "All Tasks"}
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <button
                      type="button"
                      className={`dropdown-item ${taskView === "all" ? "active" : ""}`}
                      onClick={() => setTaskView("all")}
                    >
                      All Tasks
                    </button>
                    <button
                      type="button"
                      className={`dropdown-item ${taskView === "important" ? "active" : ""}`}
                      onClick={() => setTaskView("important")}
                    >
                      Important
                    </button>
                    <button
                      type="button"
                      className={`dropdown-item ${taskView === "completed" ? "active" : ""}`}
                      onClick={() => setTaskView("completed")}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                <div className="dropdown">
                  <a
                    href="#"
                    className="btn btn-outline-light shadow px-2"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="ti ti-filter me-2"></i>Filter
                    <i className="ti ti-chevron-down ms-2"></i>
                  </a>
                  <div className="filter-dropdown-menu dropdown-menu dropdown-menu-xl p-0">
                    <div className="filter-header d-flex align-items-center justify-content-between border-bottom">
                      <h6 className="mb-0">
                        <i className="ti ti-filter me-1"></i>Filter
                      </h6>
                      <button
                        type="button"
                        className="btn-close close-filter-btn"
                        data-bs-dismiss="dropdown-menu"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="filter-set-view p-3">
                      <div className="text-muted fs-13">
                        (UI-only) Hook up filters when ready.
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-3">
                        <button
                          type="button"
                          className="btn btn-outline-light w-100"
                          onClick={() => {
                            setDateRange([null, null]);
                            setTaskView("all");
                          }}
                        >
                          Reset
                        </button>
                        <button type="button" className="btn btn-primary w-100">
                          Filter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  ref={dateRangeElRef}
                  className="daterangepick task-daterange-btn form-control w-auto d-flex align-items-center"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                >
                  <i className="ti ti-calendar text-dark me-2"></i>
                  <span className="reportrange-picker-field text-dark flex-grow-1">
                    {formatPrettyRange(dateRange[0], dateRange[1])}
                  </span>
                  {dateRange[0] && dateRange[1] ? (
                    <button
                      type="button"
                      className="btn btn-link p-0 ms-2 text-muted task-daterange-clear"
                      aria-label="Clear date range"
                      title="Clear"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        closeDateRangePopover();
                        setDateRange([null, null]);
                      }}
                    >
                      <i className="ti ti-x"></i>
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="form-check form-check-md">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="select-all"
                    checked={allSelected}
                    onChange={(e) => setAllSelected(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="select-all">
                    Mark all as read
                  </label>
                </div>

                <div className="dropdown">
                  <a
                    href="#"
                    className="dropdown-toggle btn btn-outline-light px-2 shadow"
                    data-bs-toggle="dropdown"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="ti ti-sort-ascending-2 me-2"></i>Sort By
                  </a>
                  <div className="dropdown-menu">
                    <ul className="mb-0">
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setSortBy("newest")}
                        >
                          Newest
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => setSortBy("oldest")}
                        >
                          Oldest
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-muted">Loading...</div>
            ) : !visibleRows.length ? (
              <div className="text-center text-muted py-4">No tasks found.</div>
            ) : (
              <>
                {[
                  {
                    key: "pending",
                    title: "Pending",
                    items: groupedRows.pending,
                  },
                  {
                    key: "running",
                    title: "Running",
                    items: groupedRows.running,
                  },
                  { key: "hold", title: "Hold", items: groupedRows.hold },
                  {
                    key: "completed",
                    title: "Completed",
                    items: groupedRows.completed,
                  },
                ].map((section) => (
                  <div
                    key={section.key}
                    className="task-wrap border-bottom mb-3"
                  >
                    <a
                      href="#"
                      className={`d-flex align-items-center justify-content-between mb-3 ${
                        sectionOpen[section.key] ? "" : "collapsed"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSectionOpen((p) => ({
                          ...p,
                          [section.key]: !p[section.key],
                        }));
                      }}
                      aria-expanded={sectionOpen[section.key]}
                    >
                      <h6 className="fs-16 mb-0">
                        {section.title}
                        <span className="badge badge-avatar text-dark bg-soft-dark rounded-circle ms-2 fw-medium">
                          {section.items.length}
                        </span>
                      </h6>
                      <i className="ti ti-chevron-up arrow-rotate"></i>
                    </a>

                    <div
                      className={`collapse ${
                        sectionOpen[section.key] ? "show" : ""
                      }`}
                    >
                      {section.items.length ? (
                        section.items.map((r) => {
                          const id = Number(r?.id);
                          const isStarred = id ? starredIds.has(id) : false;
                          const isChecked = id ? selectedIds.has(id) : false;
                          const statusLabel = normalizeTaskStatus(
                            r?.task_status,
                          );

                          return (
                            <div
                              key={id || Math.random()}
                              className="card rounded-start-0 mb-3"
                            >
                              <div
                                className={`card-body border-start border-3 ${getBorderForPriority(
                                  r?.priority,
                                )}`}
                              >
                                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                                    <span className="me-3">
                                      <i className="ti ti-grip-vertical"></i>
                                    </span>
                                    <div className="form-check form-check-md me-3">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleSelected(id)}
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      className={`btn p-0 border-0 bg-transparent set-star rating-select task-star-btn me-3 ${
                                        isStarred ? "is-starred" : ""
                                      }`}
                                      onClick={() => toggleStarred(id)}
                                      aria-label={isStarred ? "Unstar" : "Star"}
                                      aria-pressed={isStarred}
                                      title={isStarred ? "Unstar" : "Star"}
                                    >
                                      <i
                                        className={`ti ${
                                          isStarred
                                            ? "ti-star-filled"
                                            : "ti-star"
                                        } fs-16`}
                                      ></i>
                                    </button>
                                    <div
                                      className="me-3"
                                      style={{ minWidth: 0 }}
                                    >
                                      <h6 className="fw-semibold mb-0 fs-14">
                                        {r?.title || "(Untitled Task)"}
                                      </h6>
                                      {String(r?.description ?? "").trim()
                                        .length ? (
                                        <div
                                          className="text-muted fs-12 mt-1"
                                          style={{
                                            maxWidth: "500px",
                                            whiteSpace: "normal",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            wordBreak: "break-word",
                                          }}
                                          title={String(
                                            r?.description ?? "",
                                          ).trim()}
                                        >
                                          {String(r?.description ?? "").trim()}
                                        </div>
                                      ) : null}
                                      <div className="text-muted fs-12 mt-1">
                                        <span>
                                          <i className="ti ti-user me-1"></i>
                                          {getCustomerName(r?.customer_id)}
                                        </span>
                                        <span className="ms-3">
                                          <i className="ti ti-building-store me-1"></i>
                                          {getFirmName(r?.firm_id)}
                                        </span>
                                      </div>
                                    </div>
                                    <span
                                      className={`badge ${getServiceBadgeClasses(
                                        getServiceName(r?.service_id),
                                      )} me-2`}
                                      title="Service"
                                    >
                                      <i className="ti ti-briefcase me-1"></i>
                                      {getServiceName(r?.service_id)}
                                    </span>
                                    <span
                                      className={`badge ${getSoftPriorityBadge(
                                        r?.priority,
                                      )}`}
                                      title="Priority"
                                    >
                                      {r?.priority || "Medium"}
                                    </span>
                                  </div>

                                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                                    <div className="me-2">
                                      <span
                                        className={`badge ${getSoftStatusBadge(
                                          r?.task_status,
                                        )}`}
                                      >
                                        {statusLabel}
                                      </span>
                                    </div>
                                    <div className="me-2">
                                      <i className="ti ti-calendar-exclamation me-1"></i>
                                      {formatPrettyDate(r?.due_date)}
                                    </div>
                                    {(() => {
                                      const managerId = Number(
                                        r?.manager_id ?? 0,
                                      );
                                      const meta = managerId
                                        ? employeeMetaById.get(managerId)
                                        : null;
                                      const assigneeName =
                                        meta?.name ||
                                        (managerId
                                          ? getEmployeeName(managerId)
                                          : "Unassigned");

                                      return (
                                        <TaskAssigneeAvatar
                                          name={assigneeName}
                                          profilePic={meta?.profilePic}
                                        />
                                      );
                                    })()}
                                    {currentUserMeta?.role === "admin" ||
                                    currentUserMeta?.role === "employee" ? (
                                      <div
                                        className="dropdown table-action position-relative"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <button
                                          type="button"
                                          className="action-icon btn btn-xs shadow btn-icon btn-outline-light"
                                          aria-expanded={openMenuTaskId === id}
                                          aria-haspopup="menu"
                                          onClick={() =>
                                            setOpenMenuTaskId((prev) =>
                                              prev === id ? null : id,
                                            )
                                          }
                                        >
                                          <i className="ti ti-dots-vertical"></i>
                                        </button>
                                        <div
                                          className={`dropdown-menu dropdown-menu-end ${
                                            openMenuTaskId === id ? "show" : ""
                                          }`}
                                          style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0,
                                            zIndex: 1050,
                                          }}
                                        >
                                          {canCreateOrEditTasks ? (
                                            <button
                                              type="button"
                                              className="dropdown-item"
                                              onClick={() => {
                                                setOpenMenuTaskId(null);
                                                openEdit(r);
                                              }}
                                            >
                                              <i className="ti ti-edit text-blue"></i>{" "}
                                              Edit
                                            </button>
                                          ) : null}

                                          {canUpdateTaskStatus ? (
                                            <button
                                              type="button"
                                              className="dropdown-item"
                                              onClick={() => {
                                                setOpenMenuTaskId(null);
                                                openStatus(r);
                                              }}
                                            >
                                              <i className="ti ti-checkup-list"></i>{" "}
                                              Update Status
                                            </button>
                                          ) : null}

                                          {currentUserMeta?.role === "admin" ? (
                                            <button
                                              type="button"
                                              className="dropdown-item"
                                              onClick={() => {
                                                setOpenMenuTaskId(null);
                                                openDelete(r);
                                              }}
                                            >
                                              <i className="ti ti-trash"></i>{" "}
                                              Delete
                                            </button>
                                          ) : null}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-muted pb-3">
                          No {section.title.toLowerCase()} tasks.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create Offcanvas */}
      <div
        className={`offcanvas offcanvas-end ${isCreateOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{
          visibility: isCreateOpen ? "visible" : "hidden",
          height: "100vh",
          width: "min(560px, 96vw)",
          boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
        }}
      >
        <div className="offcanvas-header border-bottom">
          <div>
            <h5 className="offcanvas-title mb-0">Create Task</h5>
            <div className="text-muted fs-13">Add a new task.</div>
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
              <label className="form-label">Customer</label>
              <select
                className="form-select"
                value={createCustomerId}
                onChange={(e) => setCreateCustomerId(e.target.value)}
                disabled={createSaving}
                autoFocus
              >
                <option value="">Select customer</option>
                {customerOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Firm</label>
                <select
                  className="form-select"
                  value={createFirmId}
                  onChange={(e) => setCreateFirmId(e.target.value)}
                  disabled={createSaving}
                >
                  <option value="">Select firm</option>
                  {filteredCreateFirms.map((f) => (
                    <option key={f?.id} value={String(f?.id ?? "")}>
                      {f?.firm_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Service</label>
                <select
                  className="form-select"
                  value={createServiceId}
                  onChange={(e) => setCreateServiceId(e.target.value)}
                  disabled={createSaving}
                >
                  <option value="">Select service</option>
                  {(createFirmId ? filteredCreateServices : services).map(
                    (s) => (
                      <option key={s?.id} value={String(s?.id ?? "")}>
                        {s?.name}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label">Employee</label>
              <select
                className="form-select"
                value={createManagerId}
                onChange={(e) => setCreateManagerId(e.target.value)}
                disabled={createSaving}
              >
                <option value="">Select employee</option>
                {createManagerId &&
                !managerOptions.some((u) => u.value === createManagerId) ? (
                  <option
                    value={createManagerId}
                  >{`User #${createManagerId}`}</option>
                ) : null}
                {managerOptions.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                placeholder="Task title"
                disabled={createSaving}
              />
            </div>

            <div className="mt-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="Optional"
                disabled={createSaving}
              />
            </div>

            <div className="row g-3 mt-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={createPriority}
                  onChange={(e) => setCreatePriority(e.target.value)}
                  disabled={createSaving}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={createStatus}
                  onChange={(e) => setCreateStatus(e.target.value)}
                  disabled={createSaving}
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Task Period</label>
                <select
                  className="form-select"
                  value={createPeriod}
                  onChange={(e) => setCreatePeriod(e.target.value)}
                  disabled={createSaving}
                >
                  {TASK_PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Due Date</label>
                <DatePicker
                  wrapperClassName="w-100"
                  selected={createDueDate}
                  onChange={(date) => setCreateDueDate(date)}
                  customInput={<AppDateInput placeholder="Select due date" />}
                  placeholderText="Select due date"
                  dateFormat={APP_DATE_FORMAT}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="scroll"
                  scrollableYearDropdown
                  yearDropdownItemNumber={101}
                  minDate={MIN_DATE}
                  maxDate={MAX_DATE}
                  disabled={createSaving}
                  popperPlacement="bottom-start"
                  popperClassName="app-datepicker-popper"
                  calendarClassName="app-datepicker"
                  showPopperArrow={false}
                />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Next Run Date</label>
                <DatePicker
                  wrapperClassName="w-100"
                  selected={createNextRunDate}
                  onChange={(date) => setCreateNextRunDate(date)}
                  customInput={<AppDateInput placeholder="Optional" />}
                  placeholderText="Optional"
                  dateFormat={APP_DATE_FORMAT}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="scroll"
                  scrollableYearDropdown
                  yearDropdownItemNumber={101}
                  minDate={MIN_DATE}
                  maxDate={MAX_DATE}
                  disabled={createSaving}
                  popperPlacement="bottom-start"
                  popperClassName="app-datepicker-popper"
                  calendarClassName="app-datepicker"
                  showPopperArrow={false}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Last Run Date</label>
                <DatePicker
                  wrapperClassName="w-100"
                  selected={createLastRunDate}
                  onChange={(date) => setCreateLastRunDate(date)}
                  customInput={<AppDateInput placeholder="Optional" />}
                  placeholderText="Optional"
                  dateFormat={APP_DATE_FORMAT}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="scroll"
                  scrollableYearDropdown
                  yearDropdownItemNumber={101}
                  minDate={MIN_DATE}
                  maxDate={MAX_DATE}
                  disabled={createSaving}
                  popperPlacement="bottom-start"
                  popperClassName="app-datepicker-popper"
                  calendarClassName="app-datepicker"
                  showPopperArrow={false}
                />
              </div>
            </div>
          </div>

          <div className="offcanvas-footer border-top p-3 d-flex gap-2 justify-content-end">
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

      {isCreateOpen ? (
        <div className="offcanvas-backdrop fade show" onClick={closeCreate} />
      ) : null}

      {/* Edit Offcanvas */}
      <div
        className={`offcanvas offcanvas-end ${isEditOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{
          visibility: isEditOpen ? "visible" : "hidden",
          height: "100vh",
          width: "min(560px, 96vw)",
          boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
        }}
      >
        <div className="offcanvas-header border-bottom">
          <div>
            <h5 className="offcanvas-title mb-0">Update Task</h5>
            <div className="text-muted fs-13">Update task record.</div>
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
              <label className="form-label">Customer</label>
              <select
                className="form-select"
                value={editCustomerId}
                onChange={(e) => setEditCustomerId(e.target.value)}
                disabled={editSaving}
                autoFocus
              >
                <option value="">Select customer</option>
                {customerOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Firm</label>
                <select
                  className="form-select"
                  value={editFirmId}
                  onChange={(e) => setEditFirmId(e.target.value)}
                  disabled={editSaving}
                >
                  <option value="">Select firm</option>
                  {filteredEditFirms.map((f) => (
                    <option key={f?.id} value={String(f?.id ?? "")}>
                      {f?.firm_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Service</label>
                <select
                  className="form-select"
                  value={editServiceId}
                  onChange={(e) => setEditServiceId(e.target.value)}
                  disabled={editSaving}
                >
                  <option value="">Select service</option>
                  {(editFirmId ? filteredEditServices : services).map((s) => (
                    <option key={s?.id} value={String(s?.id ?? "")}>
                      {s?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3 mt-3">
              <label className="form-label">Employee</label>
              <select
                className="form-select"
                value={editManagerId}
                onChange={(e) => setEditManagerId(e.target.value)}
                disabled={editSaving}
              >
                <option value="">Select employee</option>
                {editManagerId &&
                !managerOptions.some((u) => u.value === editManagerId) ? (
                  <option
                    value={editManagerId}
                  >{`User #${editManagerId}`}</option>
                ) : null}
                {managerOptions.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3 mt-3">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
                disabled={editSaving}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional"
                disabled={editSaving}
              />
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  disabled={editSaving}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  disabled={editSaving}
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Task Period</label>
                <select
                  className="form-select"
                  value={editPeriod}
                  onChange={(e) => setEditPeriod(e.target.value)}
                  disabled={editSaving}
                >
                  {TASK_PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Due Date</label>
                <DatePicker
                  wrapperClassName="w-100"
                  selected={editDueDate}
                  onChange={(date) => setEditDueDate(date)}
                  customInput={<AppDateInput placeholder="Select due date" />}
                  placeholderText="Select due date"
                  dateFormat={APP_DATE_FORMAT}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="scroll"
                  scrollableYearDropdown
                  yearDropdownItemNumber={101}
                  minDate={MIN_DATE}
                  maxDate={MAX_DATE}
                  disabled={editSaving}
                  popperPlacement="bottom-start"
                  popperClassName="app-datepicker-popper"
                  calendarClassName="app-datepicker"
                  showPopperArrow={false}
                />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Next Run Date</label>
                <DatePicker
                  wrapperClassName="w-100"
                  selected={editNextRunDate}
                  onChange={(date) => setEditNextRunDate(date)}
                  customInput={<AppDateInput placeholder="Optional" />}
                  placeholderText="Optional"
                  dateFormat={APP_DATE_FORMAT}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="scroll"
                  scrollableYearDropdown
                  yearDropdownItemNumber={101}
                  minDate={MIN_DATE}
                  maxDate={MAX_DATE}
                  disabled={editSaving}
                  popperPlacement="bottom-start"
                  popperClassName="app-datepicker-popper"
                  calendarClassName="app-datepicker"
                  showPopperArrow={false}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Last Run Date</label>
                <DatePicker
                  wrapperClassName="w-100"
                  selected={editLastRunDate}
                  onChange={(date) => setEditLastRunDate(date)}
                  customInput={<AppDateInput placeholder="Optional" />}
                  placeholderText="Optional"
                  dateFormat={APP_DATE_FORMAT}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="scroll"
                  scrollableYearDropdown
                  yearDropdownItemNumber={101}
                  minDate={MIN_DATE}
                  maxDate={MAX_DATE}
                  disabled={editSaving}
                  popperPlacement="bottom-start"
                  popperClassName="app-datepicker-popper"
                  calendarClassName="app-datepicker"
                  showPopperArrow={false}
                />
              </div>
            </div>
          </div>

          <div className="offcanvas-footer border-top p-3 d-flex gap-2 justify-content-end">
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

      {isEditOpen ? (
        <div className="offcanvas-backdrop fade show" onClick={closeEdit} />
      ) : null}

      {/* Status Offcanvas (Employee) */}
      <div
        className={`offcanvas offcanvas-end ${isStatusOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{
          visibility: isStatusOpen ? "visible" : "hidden",
          height: "100vh",
          width: "min(520px, 96vw)",
          boxShadow: "0 0.5rem 1.5rem rgba(0,0,0,.2)",
        }}
      >
        <div className="offcanvas-header border-bottom">
          <div>
            <h5 className="offcanvas-title mb-0">Update Status</h5>
            <div className="text-muted fs-13">
              {statusRow?.title
                ? `Task: ${String(statusRow.title).trim()}`
                : "Update task status."}
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={closeStatus}
            disabled={statusSaving}
          ></button>
        </div>

        <form
          onSubmit={handleStatusUpdate}
          className="d-flex flex-column flex-grow-1"
          style={{ minHeight: 0 }}
        >
          <div
            className="offcanvas-body flex-grow-1"
            style={{ overflowY: "auto", minHeight: 0 }}
          >
            {statusError ? (
              <div className="alert alert-danger mb-3">{statusError}</div>
            ) : null}

            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                disabled={statusSaving}
                autoFocus
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="offcanvas-footer border-top p-3 d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-light"
              onClick={closeStatus}
              disabled={statusSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={statusSaving}
            >
              {statusSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {isStatusOpen ? (
        <div className="offcanvas-backdrop fade show" onClick={closeStatus} />
      ) : null}

      {/* Delete Modal */}
      {isDeleteOpen ? (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Task</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeDelete}
                    disabled={deleteSaving}
                  ></button>
                </div>
                <div className="modal-body">
                  {deleteError ? (
                    <div className="alert alert-danger">{deleteError}</div>
                  ) : null}
                  <div>
                    Are you sure you want to delete <b>{deleteRow?.title}</b>?
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-light"
                    onClick={closeDelete}
                    disabled={deleteSaving}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={deleteSaving}
                  >
                    {deleteSaving ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeDelete} />
        </>
      ) : null}
    </div>
  );
}

export default Task;
