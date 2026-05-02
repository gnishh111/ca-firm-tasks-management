import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored auth/session
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    navigate("/admin-login", { replace: true });
  };

  return (
    <>
      <header className="navbar-header">
        <div className="page-container topbar-menu">
          <div className="d-flex align-items-center gap-2">
            <a href="index-2.html" className="logo">
              <span className="logo-light">
                <span className="logo-lg">
                  <img src="assets/img/logo.svg" alt="logo" />
                </span>
                <span className="logo-sm">
                  <img src="assets/img/logo-small.svg" alt="small logo" />
                </span>
              </span>

              <span className="logo-dark">
                <span className="logo-lg">
                  <img src="assets/img/logo-white.svg" alt="dark logo" />
                </span>
              </span>
            </a>

            <a id="mobile_btn" className="mobile-btn" href="#sidebar">
              <i className="ti ti-menu-deep fs-24"></i>
            </a>

            <button
              className="sidenav-toggle-btn btn border-0 p-0"
              id="toggle_btn2"
            >
              <i className="ti ti-arrow-bar-to-right"></i>
            </button>

            <div className="me-auto d-flex align-items-center header-search d-lg-flex d-none">
              <div className="input-icon position-relative me-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Keyword"
                />
                <span className="input-icon-addon d-inline-flex p-0 header-search-icon">
                  <i className="ti ti-command"></i>
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <div className="header-item d-flex d-lg-none me-2">
              <button
                className="topbar-link btn"
                data-bs-toggle="modal"
                data-bs-target="#searchModal"
                type="button"
              >
                <i className="ti ti-search fs-16"></i>
              </button>
            </div>

            <div className="header-item">
              <div className="dropdown me-2">
                <a
                  href="javascript:void(0);"
                  className="btn topbar-link btnFullscreen"
                >
                  <i className="ti ti-maximize"></i>
                </a>
              </div>
            </div>

            <div className="header-item d-none d-sm-flex me-2">
              <button
                className="topbar-link btn topbar-link"
                id="light-dark-mode"
                type="button"
              >
                <i className="ti ti-moon fs-16"></i>
              </button>
            </div>

            <div className="header-item d-none d-sm-flex">
              <div className="dropdown me-2">
                <a
                  href="javascript:void(0);"
                  className="btn topbar-link topbar-teal-link"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-layout-grid-add"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
                  <a href="contacts.html" className="dropdown-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="d-flex mb-1 fw-semibold text-dark">
                          Contacts
                        </span>
                        <span className="fs-13">View All the Contacts</span>
                      </div>
                      <i className="ti ti-chevron-right-pipe text-dark"></i>
                    </div>
                  </a>

                  <a href="pipeline.html" className="dropdown-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="d-flex mb-1 fw-semibold text-dark">
                          Pipeline
                        </span>
                        <span className="fs-13">View All the Pipeline</span>
                      </div>
                      <i className="ti ti-chevron-right-pipe text-dark"></i>
                    </div>
                  </a>

                  <a href="activities.html" className="dropdown-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="d-flex mb-1 fw-semibold text-dark">
                          Activities
                        </span>
                        <span className="fs-13">Activities</span>
                      </div>
                      <i className="ti ti-chevron-right-pipe text-dark"></i>
                    </div>
                  </a>

                  <a href="analytics.html" className="dropdown-item">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <span className="d-flex mb-1 fw-semibold text-dark">
                          Analytics
                        </span>
                        <span className="fs-13">Analytics</span>
                      </div>
                      <i className="ti ti-chevron-right-pipe text-dark"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="header-item d-none d-sm-flex">
              <div className="dropdown me-2">
                <a
                  href="faq.html"
                  className="btn topbar-link topbar-indigo-link"
                >
                  <i className="ti ti-help-hexagon"></i>
                </a>
              </div>
            </div>

            <div className="header-item d-none d-sm-flex">
              <div className="dropdown me-2">
                <a
                  href="lead-reports.html"
                  className="btn topbar-link topbar-warning-link"
                >
                  <i className="ti ti-chart-pie"></i>
                </a>
              </div>
            </div>

            <div className="header-line"></div>

            <div className="header-item">
              <div className="dropdown me-2">
                <a href="chat.html" className="btn topbar-link">
                  <i className="ti ti-message-circle-exclamation"></i>
                  <span className="badge rounded-pill">14</span>
                </a>
              </div>
            </div>

            <div className="header-item">
              <div className="dropdown me-2">
                <button
                  className="topbar-link btn topbar-link dropdown-toggle drop-arrow-none"
                  data-bs-toggle="dropdown"
                  data-bs-offset="0,24"
                  type="button"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  <i className="ti ti-bell-check fs-16 animate-ring"></i>
                  <span className="badge rounded-pill">10</span>
                </button>

                <div
                  className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg"
                  style={{ minHeight: "300px" }}
                >
                  <div className="p-2 border-bottom">
                    <div className="row align-items-center">
                      <div className="col">
                        <h6 className="m-0 fs-16 fw-semibold">
                          {" "}
                          Notifications
                        </h6>
                      </div>
                    </div>
                  </div>

                  <div
                    className="notification-body position-relative z-2 rounded-0"
                    data-simplebar
                  >
                    <div
                      className="dropdown-item notification-item py-3 text-wrap border-bottom"
                      id="notification-1"
                    >
                      <div className="d-flex">
                        <div className="me-2 position-relative flex-shrink-0">
                          <img
                            src="assets/img/users/user-01.jpg"
                            className="avatar-md rounded-circle"
                            alt="Img"
                          />
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0 fw-medium text-dark">John Doe</p>
                          <p className="mb-1 text-wrap">
                            left 6 comments on{" "}
                            <span className="fw-medium text-dark">
                              Isla Nublar SOC2 compliance report
                            </span>
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fs-12">
                              <i className="ti ti-clock me-1"></i>4 min ago
                            </span>
                            <div className="notification-action d-flex align-items-center float-end gap-2">
                              <a
                                href="javascript:void(0);"
                                className="notification-read rounded-circle bg-danger"
                                data-bs-toggle="tooltip"
                                title=""
                                data-bs-original-title="Make as Read"
                                aria-label="Make as Read"
                              ></a>
                              <button
                                className="btn rounded-circle p-0"
                                data-dismissible="#notification-1"
                              >
                                <i className="ti ti-x"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="dropdown-item notification-item py-3 text-wrap border-bottom"
                      id="notification-2"
                    >
                      <div className="d-flex">
                        <div className="me-2 position-relative flex-shrink-0">
                          <img
                            src="assets/img/users/user-12.jpg"
                            className="avatar-md rounded-circle"
                            alt="Img"
                          />
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0 fw-medium text-dark">
                            Thomas William
                          </p>
                          <p className="mb-1 text-wrap">
                            “Oh, I finished de-bugging the phones, but the
                            system's compiling for eighteen minutes, or
                            twenty...”
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fs-12">
                              <i className="ti ti-clock me-1"></i>8 min ago
                            </span>
                            <div className="notification-action d-flex align-items-center float-end gap-2">
                              <a
                                href="javascript:void(0);"
                                className="notification-read rounded-circle bg-danger"
                                data-bs-toggle="tooltip"
                                title=""
                                data-bs-original-title="Make as Read"
                                aria-label="Make as Read"
                              ></a>
                              <button
                                className="btn rounded-circle p-0"
                                data-dismissible="#notification-2"
                              >
                                <i className="ti ti-x"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="dropdown-item notification-item py-3 text-wrap border-bottom"
                      id="notification-3"
                    >
                      <div className="d-flex">
                        <div className="me-2 position-relative flex-shrink-0">
                          <img
                            src="assets/img/profiles/avatar-12.jpg"
                            className="avatar-md rounded-circle"
                            alt="Img"
                          />
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0 fw-medium text-dark">
                            Sarah Anderson
                          </p>
                          <p className="mb-1 text-wrap">
                            attached a file to{" "}
                            <span className="fw-medium text-dark">
                              Isla Nublar SOC2 compliance report
                            </span>
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fs-12">
                              <i className="ti ti-clock me-1"></i>15 min ago
                            </span>
                            <div className="notification-action d-flex align-items-center float-end gap-2">
                              <a
                                href="javascript:void(0);"
                                className="notification-read rounded-circle bg-danger"
                                data-bs-toggle="tooltip"
                                title=""
                                data-bs-original-title="Make as Read"
                                aria-label="Make as Read"
                              ></a>
                              <button
                                className="btn rounded-circle p-0"
                                data-dismissible="#notification-3"
                              >
                                <i className="ti ti-x"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="dropdown-item notification-item py-3 text-wrap"
                      id="notification-4"
                    >
                      <div className="d-flex">
                        <div className="me-2 position-relative flex-shrink-0">
                          <img
                            src="assets/img/profiles/avatar-08.jpg"
                            className="avatar-md rounded-circle"
                            alt="Img"
                          />
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0 fw-medium text-dark">
                            Ann McClure
                          </p>
                          <p className="mb-1 text-wrap">
                            mentioned you in{" "}
                            <span className="fw-medium text-dark">
                              Bug Fix Review - Task #432
                            </span>
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fs-12">
                              <i className="ti ti-clock me-1"></i>20 min ago
                            </span>
                            <div className="notification-action d-flex align-items-center float-end gap-2">
                              <a
                                href="javascript:void(0);"
                                className="notification-read rounded-circle bg-danger"
                                data-bs-toggle="tooltip"
                                title=""
                                data-bs-original-title="Make as Read"
                                aria-label="Make as Read"
                              ></a>
                              <button
                                className="btn rounded-circle p-0"
                                data-dismissible="#notification-4"
                              >
                                <i className="ti ti-x"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-bottom border-top text-center">
                    <a
                      href="notifications.html"
                      className="text-center text-decoration-underline fs-14 mb-0"
                    >
                      View All Notifications
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="dropdown profile-dropdown d-flex align-items-center justify-content-center">
              <a
                href="javascript:void(0);"
                className="topbar-link dropdown-toggle drop-arrow-none position-relative"
                data-bs-toggle="dropdown"
                data-bs-offset="0,22"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <img
                  src="assets/img/users/user-40.jpg"
                  width="38"
                  className="rounded-1 d-flex"
                  alt="user-image"
                />
                <span className="online text-success">
                  <i className="ti ti-circle-filled d-flex bg-white rounded-circle border border-1 border-white"></i>
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
                <div className="d-flex align-items-center bg-light rounded-3 p-2 mb-2">
                  <img
                    src="assets/img/users/user-40.jpg"
                    className="rounded-circle"
                    width="42"
                    height="42"
                    alt="Img"
                  />
                  <div className="ms-2">
                    <p className="fw-medium text-dark mb-0">Katherine Brooks</p>
                    <span className="d-block fs-13">Installer</span>
                  </div>
                </div>

                <a href="profile-settings.html" className="dropdown-item">
                  <i className="ti ti-user-circle me-1 align-middle"></i>
                  <span className="align-middle">Profile Settings</span>
                </a>

                <div className="form-check form-switch form-check-reverse d-flex align-items-center justify-content-between dropdown-item mb-0">
                  <label className="form-check-label" htmlFor="notify">
                    <i className="ti ti-bell"></i>Notifications
                  </label>
                  <input
                    className="form-check-input me-0"
                    type="checkbox"
                    role="switch"
                    id="notify"
                  />
                </div>

                <a href="javascript:void(0);" className="dropdown-item">
                  <i className="ti ti-help-circle me-1 align-middle"></i>
                  <span className="align-middle">Help & Support</span>
                </a>

                <a href="profile-settings.html" className="dropdown-item">
                  <i className="ti ti-settings me-1 align-middle"></i>
                  <span className="align-middle">Settings</span>
                </a>

                <div className="pt-2 mt-2 border-top">
                  <button
                    type="button"
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="ti ti-logout me-1 fs-17 align-middle"></i>
                    <span className="align-middle">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="modal fade" id="searchModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content bg-transparent">
            <div className="card shadow-none mb-0">
              <div
                className="px-3 py-2 d-flex flex-row align-items-center"
                id="search-top"
              >
                <i className="ti ti-search fs-22"></i>
                <input
                  type="search"
                  className="form-control border-0"
                  placeholder="Search"
                />
                <button
                  type="button"
                  className="btn p-0"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x fs-22"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
