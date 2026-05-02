import { Link } from "react-router-dom";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="footer d-block d-md-flex justify-content-between text-md-start text-center">
                <p className="mb-md-0 mb-1">Copyright &copy; <script type="26d4b9971e3df1c99e14a87e-text/javascript">document.write(new Date().getFullYear())</script> <a href="javascript:void(0);" className="link-primary text-decoration-underline">CRMS</a></p>
                <div className="d-flex align-items-center gap-2 footer-links justify-content-center justify-content-md-end">
                    <a href="javascript:void(0);">About</a>
                    <a href="javascript:void(0);">Terms</a>
                    <a href="javascript:void(0);">Contact Us</a>
                </div>
            </footer>
        </>
    );
}

export default Footer;
