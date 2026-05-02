import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker-theme.css";
import { AppDateInput, APP_DATE_FORMAT } from "@/components/AppDateInput";
import Footer from "@/components/admin/Footer";

export default function BasicInputs() {
  const [basicDate, setBasicDate] = useState(null);

  return (
    <div className="page-wrapper">
      <div className="content pb-0">
        <div className="mb-4">
          <h4 className="mb-1">Form Elements</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 p-0">
              <li className="breadcrumb-item">
                <a href="index-2.html">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="#">Base UI</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Form Elements
              </li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Input Types</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label htmlFor="input-label" className="form-label">
                        Text
                      </label>
                      <input type="text" className="form-control" id="input" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-label" className="form-label">
                        Form Input With Label
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="input-label"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-placeholder" className="form-label">
                        Form Input With Placeholder
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="input-placeholder"
                        placeholder="Placeholder"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-text" className="form-label">
                        Type Text
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="input-text"
                        placeholder="Text"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-number" className="form-label">
                        Type Number
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="input-number"
                        placeholder="Number"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-password" className="form-label">
                        Type Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="input-password"
                        placeholder="Password"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-email" className="form-label">
                        Type Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="input-email"
                        placeholder="email@xyz.com"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-tel" className="form-label">
                        Type Tel
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="input-tel"
                        placeholder="+1100-2031-1233"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-date" className="form-label">
                        Type Date
                      </label>
                      <DatePicker
                        wrapperClassName="w-100"
                        selected={basicDate}
                        onChange={(date) => setBasicDate(date)}
                        customInput={<AppDateInput placeholder="Select date" />}
                        placeholderText="Select date"
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
                    <div className="mb-3">
                      <label htmlFor="input-week" className="form-label">
                        Type Week
                      </label>
                      <input
                        type="week"
                        className="form-control"
                        id="input-week"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-month" className="form-label">
                        Type Month
                      </label>
                      <input
                        type="month"
                        className="form-control"
                        id="input-month"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-time" className="form-label">
                        Type Time
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        id="input-time"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="input-datetime-local"
                        className="form-label"
                      >
                        Type Datetime Local
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="input-datetime-local"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="text-area" className="form-label">
                        Textarea
                      </label>
                      <textarea
                        className="form-control"
                        id="text-area"
                        rows="4"
                      ></textarea>
                    </div>

                    <div className="mb-0">
                      <label htmlFor="example-range" className="form-label">
                        Range
                      </label>
                      <input
                        className="form-range"
                        id="example-range"
                        type="range"
                        name="range"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label htmlFor="input-search" className="form-label">
                        Type Search
                      </label>
                      <input
                        type="search"
                        className="form-control"
                        id="input-search"
                        placeholder="Search"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-submit" className="form-label">
                        Type Submit
                      </label>
                      <input
                        type="submit"
                        className="form-control"
                        id="input-submit"
                        value="Submit"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-reset" className="form-label">
                        Type Reset
                      </label>
                      <input
                        type="reset"
                        className="form-control"
                        id="input-reset"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-button" className="form-label">
                        Type Button
                      </label>
                      <input
                        type="button"
                        className="form-control btn btn-primary"
                        id="input-button"
                        value="Button"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Type Color</label>
                      <input
                        className="form-control form-input-color"
                        type="color"
                        value="#136bd0"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-file" className="form-label">
                        Type File
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        id="input-file"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Type Url</label>
                      <input
                        className="form-control"
                        type="url"
                        name="website"
                        placeholder="http://example.com/"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-disabled" className="form-label">
                        Type Disabled
                      </label>
                      <input
                        type="text"
                        id="input-disabled"
                        className="form-control"
                        placeholder="Disabled input"
                        disabled=""
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="input-readonlytext"
                        className="form-label"
                      >
                        Input Readonly Text
                      </label>
                      <input
                        type="text"
                        readonly=""
                        className="form-control-plaintext"
                        id="input-readonlytext"
                        value="email@example.com"
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="disabled-readonlytext"
                        className="form-label"
                      >
                        Disabled Readonly Input
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        value="Disabled readonly input"
                        id="disabled-readonlytext"
                        aria-label="Disabled input example"
                        disabled=""
                        readonly=""
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Type Readonly Input</label>
                      <input
                        className="form-control"
                        type="text"
                        value="Readonly input here..."
                        aria-label="readonly input example"
                        readonly=""
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="input-DataList" className="form-label">
                        Datalist example
                      </label>
                      <input
                        className="form-control"
                        list="datalistOptions"
                        id="input-DataList"
                        placeholder="Type to search..."
                      />
                      <datalist id="datalistOptions">
                        <option value="San Francisco"></option>
                        <option value="New York"></option>
                        <option value="Seattle"></option>
                        <option value="Los Angeles"></option>
                        <option value="Chicago"></option>
                      </datalist>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="example-select" className="form-label">
                        Input Select
                      </label>
                      <select className="form-select" id="example-select">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="example-multiselect"
                        className="form-label"
                      >
                        Multiple Select
                      </label>
                      <select
                        id="example-multiselect"
                        multiple
                        className="form-control"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className="mb-0">
                      <label htmlFor="example-helping" className="form-label">
                        Helping text
                      </label>
                      <input
                        type="text"
                        id="example-helping"
                        className="form-control mb-1"
                        placeholder="Helping text"
                      />
                      <span className="help-block">
                        <small>
                          A block of help text that breaks onto a new line and
                          may extend beyond one line.
                        </small>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card card-h-100">
              <div className="card-header">
                <h5 className="card-title">Input Shapes</h5>
              </div>
              <div className="card-body">
                <div className="row gy-3">
                  <div className="col-xl-12">
                    <label htmlFor="input-noradius" className="form-label">
                      Input With No Radius
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      id="input-noradius"
                      placeholder="No Radius"
                    />
                  </div>
                  <div className="col-xl-12">
                    <label htmlFor="input-rounded" className="form-label">
                      Input With Radius
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="input-rounded"
                      placeholder="Default Radius"
                    />
                  </div>
                  <div className="col-xl-12">
                    <label htmlFor="input-rounded-pill" className="form-label">
                      Rounded Input
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="input-rounded-pill"
                      placeholder="Rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Disabled forms</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="disabledTextInput" className="form-label">
                      Disabled Input
                    </label>
                    <input
                      type="text"
                      id="disabledTextInput"
                      className="form-control"
                      placeholder="Disabled input"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="disabledSelect" className="form-label">
                      Disabled Select Menu
                    </label>
                    <select id="disabledSelect" className="form-select">
                      <option>Disabled select</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="disabledFieldsetCheck"
                        disabled=""
                      />
                      <label
                        className="form-check-label"
                        htmlFor="disabledFieldsetCheck"
                      >
                        Can't check this
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="disabledFieldsetRadio"
                        disabled=""
                      />
                      <label
                        className="form-check-label"
                        htmlFor="disabledFieldsetRadio"
                      >
                        Can't check this
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card card-h-100">
              <div className="card-header">
                <h5 className="card-title">Input Sizing</h5>
              </div>
              <div className="card-body">
                <input
                  className="form-control form-control-sm mb-3"
                  type="text"
                  placeholder=".form-control-sm"
                  aria-label=".form-control-sm example"
                />
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="Default input"
                  aria-label="default input example"
                />
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder=".form-control-lg"
                  aria-label=".form-control-lg example"
                />
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">File Input</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">
                      Default file input example
                    </label>
                    <input className="form-control" type="file" id="formFile" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formFileMultiple" className="form-label">
                      Multiple files input example
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="formFileMultiple"
                      multiple
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formFileDisabled" className="form-label">
                      Disabled file input example
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="formFileDisabled"
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formFileSm" className="form-label">
                      Small file input example
                    </label>
                    <input
                      className="form-control form-control-sm"
                      id="formFileSm"
                      type="file"
                    />
                  </div>
                  <div>
                    <label htmlFor="formFileLg" className="form-label">
                      Large file input example
                    </label>
                    <input
                      className="form-control form-control-lg"
                      id="formFileLg"
                      type="file"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
