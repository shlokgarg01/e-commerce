import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../actions/userAction";
import { useAlert } from "react-alert";
import logo from "../../../images/logo.jpeg";

const Header = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user, loading } = useSelector((state) => state.user);

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#e3f2fd" }}
    >
      <div className="container-fluid">
        <Link
          to="/"
          className="d-flex flex-row justify-content-center align-items-center text-decoration-none"
        >
          <img alt="Logo" src={logo} className="rounded-circle" height="40" />
          &ensp;
          <div className="navbar-brand">Parchun King</div>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {loading !== true && user && user.role === 'admin' && (
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/admin/orders">
                  Orders
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/users">
                  Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/categories">
                  Categories
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/subcategories">
                  Sub-Categories
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/products">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/coupons">
                  Coupons
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/banners">
                  Banners
                </Link>
              </li>
            </ul>
          )}
          <ul className="navbar-nav mb-2 mb-lg-0 ms-auto mr-4">
            {loading !== true && user && (
              <li className="nav-item dropdown">
                <div
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <b>{user.name}</b>
                </div>
                <ul className="dropdown-menu">
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      onClick={() => {
                        dispatch(logout());
                        alert.success("Logout Success");
                      }}
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
