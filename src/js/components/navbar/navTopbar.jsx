import React from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Link , Redirect} from 'react-router-dom'

import logo from '../../../images/avatar.jpg';
import '../../../css/bootstrap.css';
import '../../../css/adjust_bootstrap.css';
import '../../../css/simple-sidebar.css';
import '../../../css/_navbar.css';
import '../../../vendor/fontawesome-free/css/all.css';
import '../../../css/mystyles.css';

import $ from 'jquery';

import { API_URL_DATABASE } from '../../config_database.js';

class NavTopbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_infoes: [],
            themeColorWhiteVanilla: "bg-white",
            loggedIn: true,
            decodeToken: '',
        }
    }

    componentDidMount() {
        // console.log(`>>>>>>>>>>>>>>>>>>>NUK  ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var decoded = jwt_decode(token_auth);
        var username = decoded.username;
        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/users/${username}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const user_infoes = res.data;
                this.setState({ user_infoes: user_infoes });
            })
            .catch(function (err) {
                console.log(err)
            });
        // <!-- Menu Toggle Script -->
        $("#menu-toggle").click(function(e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });
    }

    getUsername() {
        // console.log(`Sending with headers navTopbar  ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var decoded = jwt_decode(token_auth);
        var username = decoded.username;
        return username

    }

    logout= () =>  {
        // remove user from local storage to log user out
        this.setState({loggedIn: false});
        localStorage.removeItem('token_auth');
        // currentUserSubject.next(null);
        console.log("token_auth", localStorage.removeItem('token_auth'))
    }
    
    render() {
        if (this.state.loggedIn === false){
            return <Redirect to='/' /> 
        }
        return (
            <div>
                <nav className={`navbar navbar-expand-lg navbar-light ${this.state.themeColorWhiteVanilla}`}>
                    <button className="btn btn-primary" id="menu-toggle">Menu</button>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/project-overview">Projects Management<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item">
                                {this.state.user_infoes.map(function(user_info) {
                                    if(user_info.role_id === 0 || user_info.role_id === 1 || user_info.role_id === 2){
                                        return <Link className="nav-link" to="/users_management">Users Management</Link>;
                                    }
                                    return null;
                                })}
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to={`/users-profile/${this.getUsername()}`}>{this.getUsername()}</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img src={logo} className="rounded-circle" style={{width: '40px'}} alt="true"/>
                                </Link>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <Link className="dropdown-item" to={`/users-profile/${this.getUsername()}`}>โปรไฟท์</Link>
                                        <div className="dropdown-divider"></div>
                                    <Link className="dropdown-item" onClick={this.logout}>ออกจากระบบ</Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
                
            </div>
        )
    };
}

export default NavTopbar;

