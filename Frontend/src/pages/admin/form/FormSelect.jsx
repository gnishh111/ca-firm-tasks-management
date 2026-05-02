import Footer from "@/components/admin/Footer";
import { useEffect } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";

export default function FormSelect() {
    useEffect(() => {
        const elements = document.querySelectorAll(
            "select[data-choices], input[data-choices]"
        );

        const instances = [];

        elements.forEach((el) => {
            const instance = new Choices(el, {
                searchEnabled: !el.hasAttribute("data-choices-search-false"),
                removeItemButton: el.hasAttribute("data-choices-removeitem"),
                shouldSort: !el.hasAttribute("data-choices-sorting-false"),
            });

            instances.push(instance);
        });
        return () => {
            instances.forEach((instance) => instance.destroy());
        };
    }, []);

    return (
        <div className="page-wrapper">

            <div className="content pb-0">

                <div className="mb-4">
                    <h4 className="mb-1">Form Select</h4>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 p-0">
                            <li className="breadcrumb-item"><a href="index-2.html">Home</a></li>
                            <li className="breadcrumb-item"><a href="#">Forms</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Form Select</li>
                        </ol>
                    </nav>
                </div>

                <div className="row">

                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Select2</h5>
                            </div>
                            <div className="card-body">

                                <p className="text-muted">Select2 gives you a customizable select box with support for searching, tagging, remote data sets, infinite scrolling, and many other highly used options.</p>
                                <div className="row g-3">
                                    <div className="col-lg-6">
                                        <p className="mb-1 fw-bold text-muted">Single Select</p>
                                        <p className="text-muted fs-14">
                                            Select2 can take a regular select box like this...
                                        </p>
                                        <select className="form-control" data-choices>
                                            <option>Select</option>
                                            <optgroup label="Alaskan/Hawaiian Time Zone">
                                                <option defaultValue="AK">Alaska</option>
                                                <option defaultValue="HI">Hawaii</option>
                                            </optgroup>
                                            <optgroup label="Pacific Time Zone">
                                                <option defaultValue="CA">California</option>
                                                <option defaultValue="NV">Nevada</option>
                                                <option defaultValue="OR">Oregon</option>
                                                <option defaultValue="WA">Washington</option>
                                            </optgroup>
                                            <optgroup label="Mountain Time Zone">
                                                <option defaultValue="AZ">Arizona</option>
                                                <option defaultValue="CO">Colorado</option>
                                                <option defaultValue="ID">Idaho</option>
                                                <option defaultValue="MT">Montana</option>
                                                <option defaultValue="NE">Nebraska</option>
                                                <option defaultValue="NM">New Mexico</option>
                                                <option defaultValue="ND">North Dakota</option>
                                                <option defaultValue="UT">Utah</option>
                                                <option defaultValue="WY">Wyoming</option>
                                            </optgroup>
                                            <optgroup label="Central Time Zone">
                                                <option defaultValue="AL">Alabama</option>
                                                <option defaultValue="AR">Arkansas</option>
                                                <option defaultValue="IL">Illinois</option>
                                                <option defaultValue="IA">Iowa</option>
                                                <option defaultValue="KS">Kansas</option>
                                                <option defaultValue="KY">Kentucky</option>
                                                <option defaultValue="LA">Louisiana</option>
                                                <option defaultValue="MN">Minnesota</option>
                                                <option defaultValue="MS">Mississippi</option>
                                                <option defaultValue="MO">Missouri</option>
                                                <option defaultValue="OK">Oklahoma</option>
                                                <option defaultValue="SD">South Dakota</option>
                                                <option defaultValue="TX">Texas</option>
                                                <option defaultValue="TN">Tennessee</option>
                                                <option defaultValue="WI">Wisconsin</option>
                                            </optgroup>
                                            <optgroup label="Eastern Time Zone">
                                                <option defaultValue="CT">Connecticut</option>
                                                <option defaultValue="DE">Delaware</option>
                                                <option defaultValue="FL">Florida</option>
                                                <option defaultValue="GA">Georgia</option>
                                                <option defaultValue="IN">Indiana</option>
                                                <option defaultValue="ME">Maine</option>
                                                <option defaultValue="MD">Maryland</option>
                                                <option defaultValue="MA">Massachusetts</option>
                                                <option defaultValue="MI">Michigan</option>
                                                <option defaultValue="NH">New Hampshire</option>
                                                <option defaultValue="NJ">New Jersey</option>
                                                <option defaultValue="NY">New York</option>
                                                <option defaultValue="NC">North Carolina</option>
                                                <option defaultValue="OH">Ohio</option>
                                                <option defaultValue="PA">Pennsylvania</option>
                                                <option defaultValue="RI">Rhode Island</option>
                                                <option defaultValue="SC">South Carolina</option>
                                                <option defaultValue="VT">Vermont</option>
                                                <option defaultValue="VA">Virginia</option>
                                                <option defaultValue="WV">West Virginia</option>
                                            </optgroup>
                                        </select>
                                    </div>

                                    <div className="col-lg-6">
                                        <p className="mb-1 fw-bold text-muted">Multiple Select</p>
                                        <p className="text-muted fs-14">
                                            Select2 can take a regular select box like this...
                                        </p>

                                        <select className="form-control select2-multiple" data-choices data-choices-removeitem multiple="multiple" data-placeholder="Choose ...">
                                            <optgroup label="Alaskan/Hawaiian Time Zone">
                                                <option defaultValue="AK">Alaska</option>
                                                <option defaultValue="HI">Hawaii</option>
                                            </optgroup>
                                            <optgroup label="Pacific Time Zone">
                                                <option defaultValue="CA">California</option>
                                                <option defaultValue="NV">Nevada</option>
                                                <option defaultValue="OR">Oregon</option>
                                                <option defaultValue="WA">Washington</option>
                                            </optgroup>
                                            <optgroup label="Mountain Time Zone">
                                                <option defaultValue="AZ">Arizona</option>
                                                <option defaultValue="CO">Colorado</option>
                                                <option defaultValue="ID">Idaho</option>
                                                <option defaultValue="MT">Montana</option>
                                                <option defaultValue="NE">Nebraska</option>
                                                <option defaultValue="NM">New Mexico</option>
                                                <option defaultValue="ND">North Dakota</option>
                                                <option defaultValue="UT">Utah</option>
                                                <option defaultValue="WY">Wyoming</option>
                                            </optgroup>
                                            <optgroup label="Central Time Zone">
                                                <option defaultValue="AL">Alabama</option>
                                                <option defaultValue="AR">Arkansas</option>
                                                <option defaultValue="IL">Illinois</option>
                                                <option defaultValue="IA">Iowa</option>
                                                <option defaultValue="KS">Kansas</option>
                                                <option defaultValue="KY">Kentucky</option>
                                                <option defaultValue="LA">Louisiana</option>
                                                <option defaultValue="MN">Minnesota</option>
                                                <option defaultValue="MS">Mississippi</option>
                                                <option defaultValue="MO">Missouri</option>
                                                <option defaultValue="OK">Oklahoma</option>
                                                <option defaultValue="SD">South Dakota</option>
                                                <option defaultValue="TX">Texas</option>
                                                <option defaultValue="TN">Tennessee</option>
                                                <option defaultValue="WI">Wisconsin</option>
                                            </optgroup>
                                            <optgroup label="Eastern Time Zone">
                                                <option defaultValue="CT">Connecticut</option>
                                                <option defaultValue="DE">Delaware</option>
                                                <option defaultValue="FL">Florida</option>
                                                <option defaultValue="GA">Georgia</option>
                                                <option defaultValue="IN">Indiana</option>
                                                <option defaultValue="ME">Maine</option>
                                                <option defaultValue="MD">Maryland</option>
                                                <option defaultValue="MA">Massachusetts</option>
                                                <option defaultValue="MI">Michigan</option>
                                                <option defaultValue="NH">New Hampshire</option>
                                                <option defaultValue="NJ">New Jersey</option>
                                                <option defaultValue="NY">New York</option>
                                                <option defaultValue="NC">North Carolina</option>
                                                <option defaultValue="OH">Ohio</option>
                                                <option defaultValue="PA">Pennsylvania</option>
                                                <option defaultValue="RI">Rhode Island</option>
                                                <option defaultValue="SC">South Carolina</option>
                                                <option defaultValue="VT">Vermont</option>
                                                <option defaultValue="VA">Virginia</option>
                                                <option defaultValue="WV">West Virginia</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="row">

                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Choices</h5>
                                </div>
                                <div className="card-body">
                                    <div>
                                        <h5 className="fs-14 mb-2">Single Select Input Example</h5>

                                        <div className="row">

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-single-default" className="form-label text-muted">Default</label>
                                                    <p className="text-muted">Set <code>data-choices</code> attribute to set a default single select.</p>
                                                    <select className="form-control" data-choices name="choices-single-default" id="choices-single-default">
                                                        <option defaultValue="">This is a placeholder</option>
                                                        <option defaultValue="Choice 1">Choice 1</option>
                                                        <option defaultValue="Choice 2">Choice 2</option>
                                                        <option defaultValue="Choice 3">Choice 3</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-single-groups" className="form-label text-muted">Option Groups</label>
                                                    <p className="text-muted">Set <code>data-choices data-choices-groups</code> attribute to set option group</p>
                                                    <select className="form-control" id="choices-single-groups" data-choices data-choices-groups data-placeholder="Select City" name="choices-single-groups">
                                                        <option defaultValue="">Choose a city</option>
                                                        <optgroup label="UK">
                                                            <option defaultValue="London">London</option>
                                                            <option defaultValue="Manchester">Manchester</option>
                                                            <option defaultValue="Liverpool">Liverpool</option>
                                                        </optgroup>
                                                        <optgroup label="FR">
                                                            <option defaultValue="Paris">Paris</option>
                                                            <option defaultValue="Lyon">Lyon</option>
                                                            <option defaultValue="Marseille">Marseille</option>
                                                        </optgroup>
                                                        <optgroup label="DE" disabled>
                                                            <option defaultValue="Hamburg">Hamburg</option>
                                                            <option defaultValue="Munich">Munich</option>
                                                            <option defaultValue="Berlin">Berlin</option>
                                                        </optgroup>
                                                        <optgroup label="US">
                                                            <option defaultValue="New York">New York</option>
                                                            <option defaultValue="Washington" disabled>Washington</option>
                                                            <option defaultValue="Michigan">Michigan</option>
                                                        </optgroup>
                                                        <optgroup label="SP">
                                                            <option defaultValue="Madrid">Madrid</option>
                                                            <option defaultValue="Barcelona">Barcelona</option>
                                                            <option defaultValue="Malaga">Malaga</option>
                                                        </optgroup>
                                                        <optgroup label="CA">
                                                            <option defaultValue="Montreal">Montreal</option>
                                                            <option defaultValue="Toronto">Toronto</option>
                                                            <option defaultValue="Vancouver">Vancouver</option>
                                                        </optgroup>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-single-no-search" className="form-label text-muted">Options added via config with no search</label>
                                                    <p className="text-muted">Set <code>data-choices data-choices-search-false data-choices-removeitem</code></p>
                                                    <select className="form-control" id="choices-single-no-search" name="choices-single-no-search" data-choices data-choices-search-false data-choices-removeitem>
                                                        <option defaultValue="Zero">Zero</option>
                                                        <option defaultValue="One">One</option>
                                                        <option defaultValue="Two">Two</option>
                                                        <option defaultValue="Three">Three</option>
                                                        <option defaultValue="Four">Four</option>
                                                        <option defaultValue="Five">Five</option>
                                                        <option defaultValue="Six">Six</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-single-no-sorting" className="form-label text-muted">Options added via config with no sorting</label>
                                                    <p className="text-muted">Set <code>data-choices data-choices-sorting-false</code> attribute.</p>
                                                    <select className="form-control" id="choices-single-no-sorting" name="choices-single-no-sorting" data-choices data-choices-sorting-false>
                                                        <option defaultValue="Madrid">Madrid</option>
                                                        <option defaultValue="Toronto">Toronto</option>
                                                        <option defaultValue="Vancouver">Vancouver</option>
                                                        <option defaultValue="London">London</option>
                                                        <option defaultValue="Manchester">Manchester</option>
                                                        <option defaultValue="Liverpool">Liverpool</option>
                                                        <option defaultValue="Paris">Paris</option>
                                                        <option defaultValue="Malaga">Malaga</option>
                                                        <option defaultValue="Washington" disabled>Washington</option>
                                                        <option defaultValue="Lyon">Lyon</option>
                                                        <option defaultValue="Marseille">Marseille</option>
                                                        <option defaultValue="Hamburg">Hamburg</option>
                                                        <option defaultValue="Munich">Munich</option>
                                                        <option defaultValue="Barcelona">Barcelona</option>
                                                        <option defaultValue="Berlin">Berlin</option>
                                                        <option defaultValue="Montreal">Montreal</option>
                                                        <option defaultValue="New York">New York</option>
                                                        <option defaultValue="Michigan">Michigan</option>
                                                    </select>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="mt-4">
                                        <h5 className="fs-14 mb-3">Multiple Select Input</h5>
                                        <div className="row">

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-multiple-default" className="form-label text-muted">Default</label>
                                                    <p className="text-muted">Set <code>data-choices multiple</code> attribute.</p>
                                                    <select className="form-control" id="choices-multiple-default" data-choices name="choices-multiple-default" multiple>
                                                        <option defaultValue="Choice 1">Choice 1</option>
                                                        <option defaultValue="Choice 2">Choice 2</option>
                                                        <option defaultValue="Choice 3">Choice 3</option>
                                                        <option defaultValue="Choice 4" disabled>Choice 4</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-multiple-remove-button" className="form-label text-muted">With remove button</label>
                                                    <p className="text-muted">Set <code>data-choices data-choices-removeitem multiple</code> attribute.</p>
                                                    <select className="form-control" id="choices-multiple-remove-button" data-choices data-choices-removeitem name="choices-multiple-remove-button" multiple>
                                                        <option defaultValue="Choice 1">Choice 1</option>
                                                        <option defaultValue="Choice 2">Choice 2</option>
                                                        <option defaultValue="Choice 3">Choice 3</option>
                                                        <option defaultValue="Choice 4">Choice 4</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-multiple-groups" className="form-label text-muted">Option groups</label>
                                                    <p className="text-muted">Set <code>data-choices data-choices-multiple-groups="true" multiple</code> attribute. </p>
                                                    <select className="form-control" id="choices-multiple-groups" name="choices-multiple-groups" data-choices data-choices-multiple-groups="true" multiple>
                                                        <option defaultValue="">Choose a city</option>
                                                        <optgroup label="UK">
                                                            <option defaultValue="London">London</option>
                                                            <option defaultValue="Manchester">Manchester</option>
                                                            <option defaultValue="Liverpool">Liverpool</option>
                                                        </optgroup>
                                                        <optgroup label="FR">
                                                            <option defaultValue="Paris">Paris</option>
                                                            <option defaultValue="Lyon">Lyon</option>
                                                            <option defaultValue="Marseille">Marseille</option>
                                                        </optgroup>
                                                        <optgroup label="DE" disabled>
                                                            <option defaultValue="Hamburg">Hamburg</option>
                                                            <option defaultValue="Munich">Munich</option>
                                                            <option defaultValue="Berlin">Berlin</option>
                                                        </optgroup>
                                                        <optgroup label="US">
                                                            <option defaultValue="New York">New York</option>
                                                            <option defaultValue="Washington" disabled>Washington</option>
                                                            <option defaultValue="Michigan">Michigan</option>
                                                        </optgroup>
                                                        <optgroup label="SP">
                                                            <option defaultValue="Madrid">Madrid</option>
                                                            <option defaultValue="Barcelona">Barcelona</option>
                                                            <option defaultValue="Malaga">Malaga</option>
                                                        </optgroup>
                                                        <optgroup label="CA">
                                                            <option defaultValue="Montreal">Montreal</option>
                                                            <option defaultValue="Toronto">Toronto</option>
                                                            <option defaultValue="Vancouver">Vancouver</option>
                                                        </optgroup>
                                                    </select>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="mt-4">
                                        <h5 className="fs-14 mb-3">Text Inputs</h5>

                                        <div className="row">

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-text-remove-button" className="form-label text-muted">Set limit values with remove button</label>
                                                    <p className="text-muted">Set <code>data-choices data-choices-limit="Required Limit" data-choices-removeitem</code> attribute.</p>
                                                    <input className="form-control" id="choices-text-remove-button" data-choices data-choices-limit="3" data-choices-removeitem type="text" defaultValue="Task-1" />
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="choices-text-unique-values" className="form-label text-muted">Unique values only, no pasting</label>
                                                    <p className="text-muted">Set <code>data-choices data-choices-text-unique-true</code> attribute.</p>
                                                    <input className="form-control" id="choices-text-unique-values" data-choices data-choices-text-unique-true type="text" defaultValue="Project-A, Project-B" />
                                                </div>
                                            </div>

                                        </div>

                                        <div>
                                            <label htmlFor="choices-text-disabled" className="form-label text-muted">Disabled</label>
                                            <p className="text-muted">Set <code>data-choices data-choices-text-disabled-true</code> attribute.</p>
                                            <input className="form-control" id="choices-text-disabled" data-choices data-choices-text-disabled-true type="text" defaultValue="alex@example.com, laura@example.com" />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <Footer />

            </div>
        </div>
    );
}
