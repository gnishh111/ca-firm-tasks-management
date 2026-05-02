import { Link, NavLink, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

function getAppRole() {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    const role = String(parsed?.role ?? "")
      .trim()
      .toLowerCase();
    const isManager = Number(parsed?.is_manager ?? 0) === 1;
    if (role === "admin") return "admin";
    if (role === "employee" && isManager) return "manager";
    if (role === "employee") return "employee";
    return role;
  } catch {
    return "";
  }
}

function Sidebar() {
  const location = useLocation();

  const appRole = useMemo(() => getAppRole(), []);
  const isAdmin = appRole === "admin";
  const isManager = appRole === "manager";
  const isEmployee = appRole === "employee";

  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleMenu = (menuName) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <>
      <div className={`sidebar ${collapsed ? " collapsed" : ""}`} id="sidebar">
        <div className="sidebar-logo">
          <div>
            <a href="index-2.html" className="logo logo-normal">
              <img src="assets/img/logo.svg" alt="Logo" />
            </a>

            <a href="index-2.html" className="logo-small">
              <img src="assets/img/logo-small.svg" alt="Logo" />
            </a>

            <a href="index-2.html" className="dark-logo">
              <img src="assets/img/logo-white.svg" alt="Logo" />
            </a>
          </div>
          <button
            className="sidenav-toggle-btn btn border-0 p-0 active"
            id="toggle_btn"
          >
            <i className="ti ti-arrow-bar-to-left"></i>
          </button>

          <button className="sidebar-close">
            <i className="ti ti-x align-middle"></i>
          </button>
          {/* <NavLink to="/dashboard" className="logo">
                        <img src="/assets/img/logo.svg" alt="Logo" />
                    </NavLink>

                    <button
                        className="sidenav-toggle-btn"
                        onClick={toggleSidebar}
                    >
                        <i className="ti ti-arrow-bar-to-left"></i>
                    </button> */}
        </div>

        <div className="sidebar-inner" data-simplebar>
          <div
            id="sidebar-menu"
            className="sidebar-menu"
            style={{
              overflow: "scroll",
              scrollbarWidth: "none",
            }}
          >
            <ul>
              <li className="menu-title">
                <span>Main Menu</span>
              </li>
              <li>
                <ul>
                  <li>
                    <Link
                      to="/dashboard"
                      className={
                        location.pathname === "/dashboard" ? "active" : ""
                      }
                    >
                      <i className="ti ti-dashboard"></i>
                      <span>Dashboard</span>
                    </Link>
                  </li>

                  {/* {isAdmin ? (
                    <li className="submenu">
                      <a
                        href="javascript:void(0);"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMenu("applications");
                        }}
                        className={
                          openMenu === "applications" ? "subdrop active" : ""
                        }
                      >
                        <i className="ti ti-brand-airtable"></i>
                        <span>Applications</span>
                        <span className="menu-arrow"></span>
                      </a>
                      <ul
                        style={{
                          display:
                            openMenu === "applications" ? "block" : "none",
                        }}
                      >
                        <li>
                          <a href="chat.html">Chat</a>
                        </li>
                        <li className="submenu submenu-two">
                          <a href="javascript:void(0);">
                            Call
                            <span className="menu-arrow inside-submenu"></span>
                          </a>
                          <ul>
                            <li>
                              <a href="#">Video Call</a>
                            </li>
                            <li>
                              <a href="#">Audio Call</a>
                            </li>
                            <li>
                              <a href="#">Call History</a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="#">Calendar</a>
                        </li>
                        <li>
                          <a href="#">Email</a>
                        </li>
                        <li>
                          <a href="#">To Do</a>
                        </li>
                        <li>
                          <a href="#">Notes</a>
                        </li>
                        <li>
                          <a href="#">File Manager</a>
                        </li>
                        <li>
                          <a href="#">Social Feed</a>
                        </li>
                        <li>
                          <a href="#">Kanban</a>
                        </li>
                        <li>
                          <a href="#">Invoices</a>
                        </li>
                      </ul>
                    </li>
                  ) : null} */}
                </ul>
              </li>
              <li className="menu-title">
                <span>CRM</span>
              </li>
              <li>
                <ul>
                  {/* {isAdmin ? (
                    <li className="submenu">
                      <a
                        href="javascript:void(0);"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMenu("forms");
                        }}
                        className={openMenu === "forms" ? "subdrop active" : ""}
                      >
                        <i className="ti ti-forms"></i>
                        <span>Forms</span>
                        <span className="menu-arrow"></span>
                      </a>
                      <ul
                        style={{
                          display: openMenu === "forms" ? "block" : "none",
                        }}
                      >
                        <li>
                          <Link
                            to="/basic-inputs"
                            className={
                              location.pathname == "/basic-inputs"
                                ? "active"
                                : ""
                            }
                          >
                            Basic Inputs
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/form-select"
                            className={
                              location.pathname == "/form-select"
                                ? "active"
                                : ""
                            }
                          >
                            Form Select
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/form-editors"
                            className={
                              location.pathname == "/form-editors"
                                ? "active"
                                : ""
                            }
                          >
                            Form Editors
                          </Link>
                        </li>
                      </ul>
                    </li>
                  ) : null} */}
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu("login");
                    }}
                    className={openMenu === "login" ? "active" : ""}
                  >
                    <Link to="/admin-login">
                      <i className="ti ti-lock-square-rounded"></i>
                      <span>Login</span>
                    </Link>
                  </li>
                  {!isEmployee ? (
                    <li>
                      <Link
                        to="/customer"
                        className={
                          location.pathname == "/customer" ? "active" : ""
                        }
                      >
                        <i className="ti ti-user-up"></i>
                        <span>Customers</span>
                      </Link>
                    </li>
                  ) : null}

                  {!isEmployee ? (
                    <li>
                      <Link
                        to="/employee"
                        className={
                          location.pathname == "/employee" ? "active" : ""
                        }
                      >
                        <i className="ti ti-building-community"></i>
                        <span>Employee</span>
                      </Link>
                    </li>
                  ) : null}

                  {isAdmin ? (
                    <li>
                      <Link
                        to="/departments"
                        className={
                          location.pathname == "/departments" ? "active" : ""
                        }
                      >
                        <i className="ti ti-medal"></i>
                        <span>Department</span>
                      </Link>
                    </li>
                  ) : null}

                  {!isEmployee ? (
                    <li>
                      <Link
                        to="/customer-firm"
                        className={
                          location.pathname == "/customer-firm" ? "active" : ""
                        }
                      >
                        <i className="ti ti-chart-arcs"></i>
                        <span>Customer Firm</span>
                      </Link>
                    </li>
                  ) : null}

                  {isAdmin ? (
                    <li>
                      <Link
                        to="/services"
                        className={
                          location.pathname == "/services" ? "active" : ""
                        }
                      >
                        <i className="ti ti-briefcase"></i>
                        <span>Services</span>
                      </Link>
                    </li>
                  ) : null}

                  {!isEmployee ? (
                    <li>
                      <Link
                        to="/firm-services"
                        className={
                          location.pathname == "/firm-services" ? "active" : ""
                        }
                      >
                        <i className="ti ti-link"></i>
                        <span>Firm Services</span>
                      </Link>
                    </li>
                  ) : null}

                  {isAdmin || isManager ? (
                    <li>
                      <Link
                        to="/tasks"
                        className={
                          location.pathname == "/tasks" ? "active" : ""
                        }
                      >
                        <i className="ti ti-list-check"></i>
                        <span>Tasks</span>
                      </Link>
                    </li>
                  ) : null}

                  {/* {isAdmin ? (
                    <>
                      <li>
                        <a href="#">
                          <i className="ti ti-brand-campaignmonitor"></i>
                          <span>Campaign</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ti ti-atom-2"></i>
                          <span>Projects</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ti ti-file-star"></i>
                          <span>Proposals</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ti ti-file-check"></i>
                          <span>Contracts</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ti ti-file-report"></i>
                          <span>Estimations</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ti ti-file-invoice"></i>
                          <span>Invoices</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ti ti-report-money"></i>
                          <span>Payments</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ti ti-chart-bar"></i>
                          <span>Analytics</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ti ti-bounce-right"></i>
                          <span>Activities</span>
                        </a>
                      </li>
                    </>
                  ) : null} */}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
