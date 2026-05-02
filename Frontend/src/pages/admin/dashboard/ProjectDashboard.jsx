import { useState, useEffect } from "react";
import api from "@/api/axios";
import Footer from "@/components/admin/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker-theme.css";
import { AppDateInput, APP_DATE_FORMAT } from "@/components/AppDateInput";

function ProjectDashboard() {
  const [projectStartDate, setProjectStartDate] = useState(null);
  const [projectDueDate, setProjectDueDate] = useState(null);

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div>
            <h4 className="mb-0">Project Dashboard</h4>
          </div>
          <div className="gap-2 d-flex align-items-center flex-wrap">
            <div className="daterangepick form-control w-auto d-flex align-items-center">
              <i className="ti ti-calendar text-dark me-2"></i>
              <span className="reportrange-picker-field text-dark">
                23 May 2025 - 30 May 2025
              </span>
            </div>
            <a
              href="javascript:void(0);"
              className="btn btn-icon btn-outline-light shadow"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              aria-label="Refresh"
              data-bs-original-title="Refresh"
            >
              <i className="ti ti-refresh"></i>
            </a>
            <a
              href="javascript:void(0);"
              className="btn btn-icon btn-outline-light shadow"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              aria-label="Collapse"
              data-bs-original-title="Collapse"
              id="collapse-header"
            >
              <i className="ti ti-transition-top"></i>
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-xl-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                  <h6 className="mb-0">Recent Projects</h6>
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="dropdown me-2">
                      <a
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="javascript:void(0);"
                      >
                        Last 30 days
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 15 days
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 30 days
                        </a>
                      </div>
                    </div>
                    <a
                      className="btn btn-primary d-inline-flex align-items-center"
                      href="javascript:void(0);"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add"
                    >
                      <i className="ti ti-square-rounded-plus-filled me-1"></i>
                      Add Project
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive custom-table">
                  <table className="table table-nowrap" id="recent-project">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Company Name</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-xl-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                  <h6 className="mb-0">Project By Stage</h6>
                  <div className="dropdown">
                    <a
                      className="dropdown-toggle btn btn-outline-light shadow"
                      data-bs-toggle="dropdown"
                      href="javascript:void(0);"
                    >
                      Last 30 days
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      <a href="javascript:void(0);" className="dropdown-item">
                        Last 15 days
                      </a>
                      <a href="javascript:void(0);" className="dropdown-item">
                        Last 30 days
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div id="contacts-analysis"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 col-xl-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                  <h6 className="mb-0">Projects By Stage</h6>
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="dropdown me-2">
                      <a
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="javascript:void(0);"
                      >
                        Sales Pipeline
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">
                          Marketing Pipeline
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Sales Pipeline
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Email
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Chats
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Operational
                        </a>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="javascript:void(0);"
                      >
                        Last 3 months
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 30 Days
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 15 Days
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 7 Days
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body center pt-0">
                <div id="project-stage"></div>
                <p className="fw-medium mb-0">
                  This data collected based on the Projects for last 30 days
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-xl-6 d-flex flex-column">
            <div className="card flex-fill">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                  <h6 className="mb-0">Leads By Stage</h6>
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="dropdown me-2">
                      <a
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="javascript:void(0);"
                      >
                        Marketing Pipeline
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">
                          Marketing Pipeline
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Sales Pipeline
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Email
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Chats
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Operational
                        </a>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="javascript:void(0);"
                      >
                        Last 3 months
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 30 Days
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 15 Days
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 7 Days
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body py-0">
                <div id="last-chart"></div>
              </div>
            </div>

            <div className="card w-100">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                  <h6 className="mb-0">Won Deals Stage</h6>
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="dropdown me-2">
                      <a
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="javascript:void(0);"
                      >
                        Marketing Pipeline
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">
                          Marketing Pipeline
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Sales Pipeline
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Email
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Chats
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Operational
                        </a>
                      </div>
                    </div>
                    <div className="dropdown">
                      <a
                        className="dropdown-toggle btn btn-outline-light shadow"
                        data-bs-toggle="dropdown"
                        href="javascript:void(0);"
                      >
                        Last 3 months
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 30 Days
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 15 Days
                        </a>
                        <a href="javascript:void(0);" className="dropdown-item">
                          Last 7 Days
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body py-0">
                <div id="won-chart"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabindex="-1"
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="mb-0">Add New Project</h5>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form action="https://crms.dreamstechnologies.com/html/template/projects-list.html">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project ID<span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project Type <span className="text-danger">*</span>
                  </label>
                  <select className="select2" data-toggle="select2">
                    <option>Choose</option>
                    <option>Mobile App</option>
                    <option>Meeting</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Client <span className="text-danger">*</span>
                  </label>
                  <select className="select">
                    <option>Select</option>
                    <option>NovaWave LLC</option>
                    <option>Silver Hawk</option>
                    <option>Harbor View</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select className="select">
                    <option>Select</option>
                    <option>Harbor View</option>
                    <option>LLC</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Project Timing <span className="text-danger">*</span>
                  </label>
                  <select className="select">
                    <option>Select</option>
                    <option>Hourly</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Less than 1 Month</option>
                    <option>Less than 3 months</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Price <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Responsible Persons <span className="text-danger">*</span>
                  </label>
                  <select
                    className="multiple-img"
                    multiple="multiple"
                    data-toggle=" multiple"
                  >
                    <option
                      data-image="assets/img/profiles/avatar-02.jpg"
                      selected
                    >
                      Robert Johnson
                    </option>
                    <option data-image="assets/img/users/user-01.jpg">
                      Sharon Roy
                    </option>
                    <option data-image="assets/img/profiles/avatar-21.jpg">
                      Vaughan Lewis
                    </option>
                    <option data-image="assets/img/profiles/avatar-23.jpg">
                      Jessica Louise
                    </option>
                    <option data-image="assets/img/profiles/avatar-16.jpg">
                      Carol Thomas
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Team Leader <span className="text-danger">*</span>
                  </label>
                  <select
                    className="multiple-img"
                    multiple="multiple"
                    data-toggle=" multiple"
                  >
                    <option
                      data-image="assets/img/profiles/avatar-19.jpg"
                      selected
                    >
                      Darlee Robertson
                    </option>
                    <option data-image="assets/img/users/user-01.jpg">
                      Sharon Roy
                    </option>
                    <option data-image="assets/img/profiles/avatar-21.jpg">
                      Vaughan Lewis
                    </option>
                    <option data-image="assets/img/profiles/avatar-23.jpg">
                      Jessica Louise
                    </option>
                    <option data-image="assets/img/profiles/avatar-16.jpg">
                      Carol Thomas
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    wrapperClassName="w-100"
                    selected={projectStartDate}
                    onChange={(date) => setProjectStartDate(date)}
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
                    popperPlacement="bottom-start"
                    popperClassName="app-datepicker-popper"
                    calendarClassName="app-datepicker"
                    showPopperArrow={false}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Due Date <span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    wrapperClassName="w-100"
                    selected={projectDueDate}
                    onChange={(date) => setProjectDueDate(date)}
                    customInput={<AppDateInput placeholder="Select due date" />}
                    placeholderText="Select due date"
                    dateFormat={APP_DATE_FORMAT}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="scroll"
                    scrollableYearDropdown
                    yearDropdownItemNumber={101}
                    popperPlacement="bottom-start"
                    popperClassName="app-datepicker-popper"
                    calendarClassName="app-datepicker"
                    showPopperArrow={false}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <select className="select">
                    <option>Select</option>
                    <option>High</option>
                    <option>Low</option>
                    <option>Medium</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="select">
                    <option>Select</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Description"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#create_success"
              >
                Create New
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProjectDashboard;
