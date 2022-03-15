import React from 'react'
import logo from '../Images/logo.svg'
// import reportIcon from '../Images/file-earmark-bar-graph-fill.svg'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Navbar(props) {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'))

    console.log(user.firstName[0]);

    function ClearLocalStorage() {
        localStorage.clear();
        props.setUserData();
        navigate('/auth/login')
    }

    function getLogout() {
        axios.get(`http://admin.liveexamcenter.in/api/auth/logout`,
            {
                headers: {
                    'Authorization': JSON.parse(localStorage.getItem('token'))
                }
            })
            .then(res => res.status === 204 && ClearLocalStorage())
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: '#212b36', height: '70px' }}>
            {/* <nav className="navbar navbar-expand-lg navbar-light bg-light"> */}
            <div className="container-fluid" style={{ marginLeft: "8%", marginRight: "3rem" }}>
                <Link className="navbar-brand" to="/"><img src={logo} alt="logo" height="50" style={{ marginRight: "1.5rem" }} /></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/questions/default">Questions</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="#">Tests</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="#">Reports</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="#">Settings</Link>
                        </li>
                    </ul>

                    <div className="btn-group">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                            {user.firstName[0] + user.lastName[0]}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-lg-end" aria-labelledby="dropdownMenuButton1">
                            <li><button className="dropdown-item" type="button">Action</button></li>
                            <li><button className="dropdown-item" type="button">Another action</button></li>
                            <li><button className="dropdown-item" type="button">Something else here</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" type="button" onClick={() => getLogout()}>Logout</button></li>
                        </ul>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar
