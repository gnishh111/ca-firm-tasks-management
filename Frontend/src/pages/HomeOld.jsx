import { useEffect } from "react";
import { loadScript, loadStyle } from "../utils/loadAssets";
import { Link } from "react-router-dom";

function Home() {
    useEffect(() => {
        const cssFiles = [
            "https://fonts.googleapis.com/css?family=Oswald:200,300,400,500,600,700&display=swap",
            "https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap",
            "/assets/web/assets/css/bootstrap.min.css",
            "/assets/web/assets/css/jquery-ui.css",
            "/assets/web/assets/css/sm-core-css.css",
            "/assets/web/assets/css/sm-simple.css",
            "/assets/web/assets/css/font-awesome.min.css",
            "/assets/web/assets/flaticon/flaticon.css",
            "/assets/web/assets/css/owl.carousel.min.css",
            "/assets/web/assets/css/owl.theme.default.min.css",
            "/assets/web/assets/css/jquery.fancybox.min.css",
            "/assets/web/assets/slick/slick-theme.css",
            "/assets/web/assets/slick/slick.css",
            "/assets/web/assets/YoutubeVideoModalPlugin/jquery.yu2fvl.css",
            "/assets/web/assets/css/animate.css",
            "/assets/web/assets/css/style.css",
            "/assets/web/assets/css/responsive.css",
        ];

        const loadedCss = cssFiles.map(href => loadStyle(href));

        loadScript("/assets/web/assets/js/jquery-3.2.0.min.js")
            .then(() => loadScript("/assets/web/assets/js/jquery-ui.js"))
            .then(() => loadScript("/assets/web/assets/js/jquery.smartmenus.min.js"))
            .then(() => loadScript("/assets/web/assets/js/owl.carousel.min.js"))
            .then(() => loadScript("/assets/web/assets/slick/slick.min.js"))
            .then(() => loadScript("/assets/web/assets/js/jquery.counterup.min.js"))
            .then(() => loadScript("/assets/web/assets/js/countdown.js"))
            .then(() => loadScript("/assets/web/assets/js/jquery.scrollUp.js"))
            .then(() => loadScript("/assets/web/assets/js/jquery.waypoints.min.js"))
            .then(() => loadScript("/assets/web/assets/js/jquery.fancybox.min.js"))
            .then(() => loadScript("/assets/web/assets/js/wow.min.js"))
            .then(() => loadScript("/assets/web/assets/YoutubeVideoModalPlugin/jquery.yu2fvl.js"))
            .then(() => loadScript("/assets/web/assets/js/bootstrap.min.js"))
            .then(() => loadScript("/assets/web/assets/js/theme.js"))
            .catch(err => console.error("Script load error:", err));

        return () => {
            loadedCss.forEach(link => link.remove());
        };
    }, []);

    return (
        <>
            {/* <link href="https://fonts.googleapis.com/css?family=Oswald:200,300,400,500,600,700&display=swap" rel="stylesheet" />
            <link
                href="https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap"
                rel="stylesheet" />
            <link rel="stylesheet" href="/assets/web/assets/css/bootstrap.min.css" />
            <link rel="stylesheet" href="/assets/web/assets/css/jquery-ui.css" />
            <link rel="stylesheet" href="/assets/web/assets/css/sm-core-css.css" />
            <link rel="stylesheet" href="/assets/web/assets/css/sm-simple.css" />
            <link rel="stylesheet" href="/assets/web/assets/css/font-awesome.min.css" />
            <link rel="stylesheet" href="/assets/web/assets/flaticon/flaticon.css" />
            <link rel="stylesheet" href="/assets/web/assets/css/owl.carousel.min.css" />
            <link rel="stylesheet" href="/assets/web/assets/css/owl.theme.default.min.css" />
            <link rel="stylesheet" href="/assets/web/assets/css/jquery.fancybox.min.css" />
            <link rel="stylesheet" href="/assets/web/assets/slick/slick-theme.css" />
            <link rel="stylesheet" href="/assets/web/assets/slick/slick.css" />
            <link href="/assets/web/assets/YoutubeVideoModalPlugin/jquery.yu2fvl.css" rel="stylesheet" type="text/css" />
            <link rel="stylesheet" href="/assets/web/assets/css/animate.css" />
            <link rel="stylesheet" href="/assets/web/assets/css/style.css" />
            <link rel="stylesheet" href="/assets/web/assets/css/responsive.css" /> */}
            <link rel="shortcut icon" type="image/png" href="/assets/admin/images/favicon.ico"></link>

            <div id="preloader"></div>
            <header className="header-area dfoody-header dfdV2">
                <div className="dfoody-header-box">
                    <div className="container">
                        <div className="row">
                            <div className="col-3 col-md-3">
                                <div className="logo-wrapper">
                                    <a href="#">
                                        <img src="/assets/admin/images/logo.png" alt="" style={{ width: "194px" }} />
                                    </a>
                                </div>
                            </div>
                            <div className="col-9 col-md-9">
                                <div className="gm-box">
                                    <div className="gmb-contact">
                                        <p>Call Now: <a href="tel:8883875000">888.387.8888</a></p>
                                    </div>
                                    <div className="dfoody-menu-wrapper">
                                        <input id="dfoodyMenu-state" type="checkbox" />
                                        <label className="dfoodyMenu-btn" for="dfoodyMenu-state">
                                            <span className="dfoodyMenu-btn-icon"></span>
                                        </label>
                                        <ul id="dfoodyMenu" className="sm sm-simple dfoody-menu">
                                            <li><a href="#about">About</a></li>
                                            <li><a href="#about">Download</a></li>
                                            <li><Link to="/admin-login" className="btn btn-warning"
                                                style={{ color: "white" }}>Login to Portal</Link></li>
                                        </ul>
                                    </div>
                                    <div className="mt-icons">
                                        <ul className="mti-list">
                                            <li>
                                                <span className="searchIcon">
                                                    <i className="flaticon-search"></i>
                                                </span>
                                                <div className="hSearchBox">
                                                    <form id="search" action="#" method="post">
                                                        <div className="search-o-group">
                                                            <input type="text" name="search-terms" id="search-terms"
                                                                placeholder="Enter search terms..." />
                                                            <button type="submit" className="osearch-btn"><i
                                                                className="fa fa-search" aria-hidden="true"></i></button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <section className="hero-area heroV2">
                <img src="/assets/web/assets/img/graphic/hero-2.png" alt="" className="hero-graphic-bg wow fadeInDown" data-delay=".99s" data-wow-duration="2s" />
                <div className="container">
                    <div className="hero-content">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="hero-text">
                                    <h2 className="wow fadeInUp" data-delay=".5s">We belive good food offer great smile</h2>
                                    <p className="wow fadeInUp" data-wow-duration="2s" data-delay=".99s">The Dfoody is a
                                        neighborhood restaurant serving
                                        seasonal global cuisine driven by the faire.
                                    </p>
                                    <a href="#consult" className="btn-style-a smoothscroll wow fadeInUp" data-delay="0.85s">BOOK
                                        A TABLE</a>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="hero-img">
                                    <img src="/assets/web/assets/img/section-img/hero2.png" alt=""
                                        className="wow slideInUp" data-wow-duration="2s" data-delay=".99s" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="about2-area" id="about">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="about2-img">
                                <img src="/assets/web/assets/img/section-img/about-2.jpg" alt="" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="section-text about1-text a2text">
                                <div className="section-titleV2">
                                    <h3>About Dfoddy</h3>
                                </div>
                                <p>Dfoody is a place where cooked food is sold to the public, and where people sit down to eat
                                    it. It is also a place where people go to enjoy the time and to eat a meal. Some restaurants
                                    are a chain, meaning that there are restaurants which have the same name and serve and where
                                    people the same food. time and to eat a meal. Some restaurants are a chain, time and to eat
                                    a meal. Some restaurants are a chain.</p>
                                <a href="#" className="btn-style-b">Learn More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="delicious-menu-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-titleV2">
                                <h3>Our Delicious Menu</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="dm-food-tab dmftV2">
                                <div className="dft-nav">
                                    <nav>
                                        <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                            <a className="nav-item nav-link active" id="nav-Breakfast-tab" data-toggle="tab"
                                                href="#nav-Breakfast" role="tab" aria-controls="nav-Breakfast"
                                                aria-selected="true">
                                                <div className="dftn-box">
                                                    <img src="/assets/web/assets/img/food-menu/fmtnav-1.jpg"
                                                        alt="" />
                                                    <div className="dftnb-title">
                                                        <p>Breakfast</p>
                                                    </div>
                                                </div>
                                            </a>
                                            <a className="nav-item nav-link" id="nav-Lunch-tab" data-toggle="tab"
                                                href="#nav-Lunch" role="tab" aria-controls="nav-Lunch"
                                                aria-selected="false">
                                                <div className="dftn-box">
                                                    <img src="/assets/web/assets/img/food-menu/lunch-1.jpg"
                                                        alt="" />
                                                    <div className="dftnb-title">
                                                        <p>Lunch</p>
                                                    </div>
                                                </div>
                                            </a>
                                            <a className="nav-item nav-link" id="nav-Dinner-tab" data-toggle="tab"
                                                href="#nav-Dinner" role="tab" aria-controls="nav-Dinner"
                                                aria-selected="false">
                                                <div className="dftn-box">
                                                    <img src="/assets/web/assets/img/food-menu/dinner-1.jpg"
                                                        alt="" />
                                                    <div className="dftnb-title">
                                                        <p>Dinner</p>
                                                    </div>
                                                </div>
                                            </a>
                                            <a className="nav-item nav-link" id="nav-Dessert-tab" data-toggle="tab"
                                                href="#nav-Dessert" role="tab" aria-controls="nav-Dessert"
                                                aria-selected="false">
                                                <div className="dftn-box">
                                                    <img src="/assets/web/assets/img/food-menu/dessert-1.jpg"
                                                        alt="" />
                                                    <div className="dftnb-title">
                                                        <p>Dessert</p>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </nav>
                                </div>
                                <div className="dft-content">
                                    <div className="tab-content" id="nav-tabContent">
                                        <div className="tab-pane fade show active" id="nav-Breakfast" role="tabpanel"
                                            aria-labelledby="nav-Breakfast-tab">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="dft-menus">
                                                        <ul className="dft-menulist">
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>15.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>20.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>10.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>12.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="dft-img">
                                                        <img src="/assets/web/assets/img/food-menu/breakfast-1.jpg"
                                                            alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="nav-Lunch" role="tabpanel"
                                            aria-labelledby="nav-Lunch-tab">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="dft-menus">
                                                        <ul className="dft-menulist">
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>15.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>20.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>10.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>12.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="dft-img">
                                                        <img src="/assets/web/assets/img/food-menu/lunch-1.jpg"
                                                            alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="nav-Dinner" role="tabpanel"
                                            aria-labelledby="nav-Dinner-tab">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="dft-menus">
                                                        <ul className="dft-menulist">
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>15.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>20.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>10.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>12.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="dft-img">
                                                        <img src="/assets/web/assets/img/food-menu/dinner-1.jpg"
                                                            alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="nav-Dessert" role="tabpanel"
                                            aria-labelledby="nav-Dessert-tab">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="dft-menus">
                                                        <ul className="dft-menulist">
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>15.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>20.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>10.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="dft-single-list">
                                                                    <div className="dftsl-text">
                                                                        <h4>Bread barrel Kauntry Boy Brakfast</h4>
                                                                        <p>Bread recipes for snacks or breakfast. </p>
                                                                    </div>
                                                                    <div className="dfsl-price">
                                                                        <h3><span>$</span>12.0</h3>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="dft-img">
                                                        <img src="/assets/web/assets/img/food-menu/dessert-1.jpg"
                                                            alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="why-choose-us-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-titleV2">
                                <h3>Why Choose Us</h3>
                                <p className="sub-title">Food service or catering industry defines those businesses, institutions,
                                    and
                                    companies responsible for any meal prepared outside the home.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="single-wcu">
                                <div className="sw-icon">
                                    <img src="/assets/web/assets/img/icons/chef.png" alt="" />
                                </div>
                                <div className="sw-text">
                                    <h4>Best Chef</h4>
                                    <p>Our chef is a trained professional cook and tradesman who is proficient in all aspects of
                                        food preparation</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="single-wcu">
                                <div className="sw-icon">
                                    <img src="/assets/web/assets/img/icons/food.png" alt="" />
                                </div>
                                <div className="sw-text">
                                    <h4>Fresh Food</h4>
                                    <p>Fresh food is food which has not been preserved and has not spoiled yet. For vegetables
                                        and fruits.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="single-wcu">
                                <div className="sw-icon">
                                    <img src="/assets/web/assets/img/icons/delivery.png" alt="" />
                                </div>
                                <div className="sw-text">
                                    <h4>Fast Delivery</h4>
                                    <p>Get Fast Food delivery, fast. Easy online ordering for takeout and delivery from Fast
                                        Food restaurants near you.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="most-popular-food-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-titleV2">
                                <h3>Most Popular Food</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="most-poplar-food-wrappper">
                                <div className="popular-food-carousel owl-carousel owl-theme">
                                    <div className="item">
                                        <div className="single-food-box">
                                            <div className="sfb-img">
                                                <img src="/assets/web/assets/img/food-menu/mpfood-1.jpg"
                                                    alt="" />
                                                <div className="sfbi-btn">
                                                    <a href="#" className="add-cart-btn">Add To Cart</a>
                                                </div>
                                            </div>
                                            <div className="sbf-info">
                                                <h4>Chicken Fried</h4>
                                                <ul className="sbfi-ratings">
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                </ul>
                                                <p className="price">$32.00</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="single-food-box">
                                            <div className="sfb-img">
                                                <img src="/assets/web/assets/img/food-menu/mpfood-2.jpg"
                                                    alt="" />
                                                <div className="sfbi-btn">
                                                    <a href="#" className="add-cart-btn">Add To Cart</a>
                                                </div>
                                            </div>
                                            <div className="sbf-info">
                                                <h4>Chicken Fried</h4>
                                                <ul className="sbfi-ratings">
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                </ul>
                                                <p className="price">$20.00</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="single-food-box">
                                            <div className="sfb-img">
                                                <img src="/assets/web/assets/img/food-menu/mpfood-3.jpg"
                                                    alt="" />
                                                <div className="sfbi-btn">
                                                    <a href="#" className="add-cart-btn">Add To Cart</a>
                                                </div>
                                            </div>
                                            <div className="sbf-info">
                                                <h4>Chicken Fried</h4>
                                                <ul className="sbfi-ratings">
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                </ul>
                                                <p className="price">$25.00</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="single-food-box">
                                            <div className="sfb-img">
                                                <img src="/assets/web/assets/img/food-menu/mpfood-2.jpg"
                                                    alt="" />
                                                <div className="sfbi-btn">
                                                    <a href="#" className="add-cart-btn">Add To Cart</a>
                                                </div>
                                            </div>
                                            <div className="sbf-info">
                                                <h4>Chicken Fried</h4>
                                                <ul className="sbfi-ratings">
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                    <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                                </ul>
                                                <p className="price">$20.00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="food-video-area fva-2">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="youtube-videoplay-button">
                                <a className="button is-play btn-Vplay play-1" href="https://www.youtube.com/watch?v=pIuCqUnvHdk">
                                    <div className="button-outer-circle has-scale-animation"></div>
                                    <div className="button-outer-circle has-scale-animation has-delay-short"></div>
                                    <div className="button-icon is-play">
                                        <svg height="100%" width="100%" fill="#b99165;">
                                            <polygon className="triangle" points="5,0 30,15 5,30"></polygon>
                                            <path className="path" d="M5,0 L30,15 L5,30z" fill="none" stroke="#b99165;"
                                                stroke-width="1"></path>
                                        </svg>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="testimonial2-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="testimonial2-img">
                                <img src="/assets/web/assets/img/section-img/testimonial2.jpg" alt="" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="section-titleV2">
                                <h3>Our Customer Says</h3>
                            </div>
                            <div className="testimonial-wrapper wow fadeIn" data-wow-delay=".50s">
                                <div className="testimonial-carousel owl-carousel owl-theme">
                                    <div className="item">
                                        <div className="single-testimonial">
                                            <div className="st-text">
                                                <p>We visited this place for breakfast and dinner. The place is very
                                                    conveniently located (on the highway ) with ample parking space. The food at
                                                    both the meals was tasty and definitely worth the price. Good quantity
                                                    served per portion. Service as also good.</p>
                                                <h4>Thomas Paul <span>Customer</span></h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="single-testimonial">
                                            <div className="st-text">
                                                <p>We visited this place for breakfast and dinner. The place is very
                                                    conveniently located (on the highway ) with ample parking space. The food at
                                                    both the meals was tasty and definitely worth the price. Good quantity
                                                    served per portion. Service as also good.</p>
                                                <h4>Thomas Paul <span>Customer</span></h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="single-testimonial">
                                            <div className="st-text">
                                                <p>We visited this place for breakfast and dinner. The place is very
                                                    conveniently located (on the highway ) with ample parking space. The food at
                                                    both the meals was tasty and definitely worth the price. Good quantity
                                                    served per portion. Service as also good.</p>
                                                <h4>Thomas Paul <span>Customer</span></h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="blog-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-titleV2">
                                <h3>Latest Posts</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="single-blogV1">
                                <div className="sb-img">
                                    <img src="/assets/web/assets/img/blog/blog-1.jpg" alt="" />
                                </div>
                                <div className="sb-text">
                                    <ul className="sb-meta">
                                        <li>by<a href="#">admin</a></li>
                                        <li>January 10, 2020</li>
                                    </ul>
                                    <a href="blog-details.html">
                                        <h4>How To Cook The Spicy Chinese Chick For Cold Weather</h4>
                                    </a>
                                    <p>Should do the trick for a pound or so, salt and pepper. Heat another teaspoon of olive
                                        oil in a medium skillet over medium heat</p>
                                    <a href="blog-details.html" className="read-more-btn-1">Read More<i
                                        className="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="single-blogV1">
                                <div className="sb-img">
                                    <img src="/assets/web/assets/img/blog/blog-2.jpg" alt="" />
                                </div>
                                <div className="sb-text">
                                    <ul className="sb-meta">
                                        <li>by<a href="#">admin</a></li>
                                        <li>January 08, 2020</li>
                                    </ul>
                                    <a href="blog-details.html">
                                        <h4>How To Cook The Spicy Chinese Chic</h4>
                                    </a>
                                    <p>Should do the trick for a pound or so, salt and pepper. Heat another teaspoon of olive
                                        oil in a medium skillet over medium heat</p>
                                    <a href="blog-details.html" className="read-more-btn-1">Read More<i
                                        className="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="single-blogV1">
                                <div className="sb-img">
                                    <img src="/assets/web/assets/img/blog/blog-3.jpg" alt="" />
                                </div>
                                <div className="sb-text">
                                    <ul className="sb-meta">
                                        <li>by<a href="#">admin</a></li>
                                        <li>January 05, 2020</li>
                                    </ul>
                                    <a href="blog-details.html">
                                        <h4>How To Cook The Spicy Chinese Chic</h4>
                                    </a>
                                    <p>Should do the trick for a pound or so, salt and pepper. Heat another teaspoon of olive
                                        oil in a medium skillet over medium heat</p>
                                    <a href="blog-details.html" className="read-more-btn-1">Read More<i
                                        className="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="booking-area">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="booking-form">
                                <img src="/assets/web/assets/img/bg/booking-form-bg.jpg" alt=""
                                    className="bform-bg" />
                                <div className="section-titleV2">
                                    <h3>Make A reservation</h3>
                                    <p>You can call us directly at 888-88888</p>
                                </div>
                                <div className="bform">
                                    <form action="#">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <input type="text" className="df-control" id="name" name="name"
                                                    placeholder="Name *" />
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" className="df-control" id="phone" name="phone"
                                                    placeholder="Phone *" />
                                            </div>
                                            <div className="col-md-6">
                                                <input type="date" className="df-control" id="date" name="date" />
                                            </div>
                                            <div className="col-md-6">
                                                <select name="time" id="time" className="df-control">
                                                    <option value="0">00.00</option>
                                                    <option value="1">01.00</option>
                                                    <option value="2">02.00</option>
                                                    <option value="3">03.00</option>
                                                    <option value="4">04.00</option>
                                                    <option value="5">05.00</option>
                                                    <option value="6">06.00</option>
                                                    <option value="7">07.00</option>
                                                    <option value="8">08.00</option>
                                                    <option value="9">09.00</option>
                                                    <option value="10">10.00</option>
                                                    <option value="11">11.00</option>
                                                    <option value="12">12.00</option>
                                                    <option value="13">13.00</option>
                                                    <option value="14">14.00</option>
                                                    <option value="15">15.00</option>
                                                    <option value="16">16.00</option>
                                                    <option value="17">17.00</option>
                                                    <option value="18">18.00</option>
                                                    <option value="19">19.00</option>
                                                    <option value="20">20.00</option>
                                                    <option value="21">21.00</option>
                                                    <option value="22">22.00</option>
                                                    <option value="23">23.00</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" className="df-control" id="seat" name="seat"
                                                    placeholder="Seat *" />
                                            </div>
                                            <div className="col-md-6">
                                                <input type="email" className="df-control" id="email" name="email"
                                                    placeholder="Email *" />
                                            </div>
                                            <div className="col-md-12">
                                                <textarea name="msg" id="msg" className="df-control" placeholder="Message *"></textarea>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="submit" className="bfs-btn" value="Submit Message" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="footer-area">
                <div className="footer-widget-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="f-widget footer-logo-info">
                                    <img src="/assets/admin/images/logo.svg" alt="" style={{ width: "200px" }} />
                                    <div className="fw-contact">
                                        <p><i className="fa fa-map-marker" aria-hidden="true"></i>Materfront avenue, street
                                            2005F, USA
                                        </p>
                                        <a href="#"><i className="fa fa-phone" aria-hidden="true"></i>+1 888.387.5000</a>
                                        <a href="#">+1 888.387.5000</a>
                                        <a href="#" className="fmail"><i className="fa fa-envelope"
                                            aria-hidden="true"></i><span className="__cf_email__"
                                                data-cfemail="f49d9a929bb49991909c919884da979b99">[email&#160;protected]</span></a>
                                    </div>
                                </div>
                                <div className="footer-social-widget">
                                    <h4>Follow Us :</h4>
                                    <ul className="footer-social">
                                        <li><a href="https://twitter.com/voidcoders"><i className="fa fa-twitter"
                                            aria-hidden="true"></i></a></li>
                                        <li><a href="https://www.facebook.com/voidcoders/"><i className="fa fa-facebook"
                                            aria-hidden="true"></i></a></li>
                                        <li><a href="https://www.instagram.com/voidcoders/"><i className="fa fa-instagram"
                                            aria-hidden="true"></i></a></li>
                                        <li><a href="https://www.linkedin.com/company/voidcoders/about/"><i
                                            className="fa fa-linkedin" aria-hidden="true"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="f-widget">
                                            <h4>Usefull Links</h4>
                                            <ul className="fw-links">
                                                <li><a href="#">Home</a></li>
                                                <li><a href="#">About</a></li>
                                                <li><a href="#">reservation</a></li>
                                                <li><a href="#">Contacts</a></li>
                                                <li><a href="#">Our Menu</a></li>
                                                <li><a href="#">Blog</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="f-widget">
                                            <h4>Extras</h4>
                                            <ul className="fw-links">
                                                <li><a href="#">My Order</a></li>
                                                <li><a href="#">Checkout</a></li>
                                                <li><a href="#">Catering</a></li>
                                                <li><a href="#">Our Locations</a></li>
                                                <li><a href="#">Privacy Policy</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="f-widget f-instawiget">
                                    <h4>Instagram</h4>
                                    <ul className="fw-instagram">
                                        <li><a data-fancybox="gallery"
                                            href="/assets/web/assets/img/gallery/insta-1.jpg"><img
                                                src="/assets/web/assets/img/gallery/insta-1.jpg"
                                                alt="" /></a></li>
                                        <li><a data-fancybox="gallery"
                                            href="/assets/web/assets/img/gallery/insta-2.jpg"><img
                                                src="/assets/web/assets/img/gallery/insta-2.jpg"
                                                alt="" /></a></li>
                                        <li><a data-fancybox="gallery"
                                            href="/assets/web/assets/img/gallery/insta-3.jpg"><img
                                                src="/assets/web/assets/img/gallery/insta-3.jpg"
                                                alt="" /></a></li>
                                        <li><a data-fancybox="gallery"
                                            href="/assets/web/assets/img/gallery/insta-4.jpg"><img
                                                src="/assets/web/assets/img/gallery/insta-4.jpg"
                                                alt="" /></a></li>
                                        <li><a data-fancybox="gallery"
                                            href="/assets/'web/assets/img/gallery/insta-5.jpg"><img
                                                src="/assets/web/assets/img/gallery/insta-5.jpg"
                                                alt="" /></a></li>
                                        <li><a data-fancybox="gallery"
                                            href="/assets/web/assets/img/gallery/insta-6.jpg"><img
                                                src="/assets/web/assets/img/gallery/insta-6.jpg"
                                                alt="" /></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="copyright-text">
                                    <p>© 2025-26 ViralNiagaTechnologies All Rights Reserved By <a href="#">ViralNiaga</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/* <script src="/assets/web/assets/js/jquery-3.2.0.min.js"></script>
            <script src="/assets/web/assets/js/jquery-ui.js"></script>
            <script src="/assets/web/assets/js/jquery.smartmenus.min.js"></script>
            <script src="/assets/web/assets/js/owl.carousel.min.js"></script>
            <script src="/assets/web/assets/slick/slick.min.js"></script>
            <script src="/assets/web/assets/js/jquery.counterup.min.js"></script>
            <script src="/assets/web/assets/js/countdown.js"></script>
            <script src="/assets/web/assets/js/jquery.scrollUp.js"></script>
            <script src="/assets/web/assets/js/jquery.waypoints.min.js"></script>
            <script src="/assets/web/assets/js/jquery.fancybox.min.js"></script>
            <script src="/assets/web/assets/js/wow.min.js"></script>
            <script src="/assets/web/assets/YoutubeVideoModalPlugin/jquery.yu2fvl.js"></script>
            <script src="/assets/web/assets/js/bootstrap.min.js"></script>
            <script src="/assets/web/assets/js/theme.js"></script> */}
        </>
    );
}

export default Home;
