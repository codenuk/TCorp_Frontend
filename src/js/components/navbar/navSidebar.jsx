import React from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';

import '../../../css/bootstrap.css';
import '../../../css/adjust_bootstrap.css';
import '../../../css/simple-sidebar.css';
import '../../../css/_navbar.css';
import '../../../vendor/fontawesome-free/css/all.css';
import '../../../css/mystyles.css';

class NavSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_infoes: [],
            projects: [],
            themeColorDarkVanilla: "bg-dark-vanilla",
            checkClick: true
        }
    }

    handleCheck = event => {
        // this.setState({ checkClick: true });
        this.setState({ checkClick: false });
    }

    componentDidMount() {
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        // var current = this;
        axios.get(`http://vanilla-erp.com:10000/api/v1/projects/overview`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log("from navslide", res)
                const projects = res.data;
                // console.log(persons.length)
                this.setState({ projects: projects });
            })
            .catch(function (err) {
                console.log(err);
                // current.setState({ isTokenValid: false });
            });

        var decoded = jwt_decode(token_auth);
        var username = decoded.username;
        axios.get(`http://vanilla-erp.com:10000/api/v1/users/${username}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const user_infoes = res.data;
                this.setState({ user_infoes: user_infoes });
            })
            .catch(function (err) {
                console.log(err)
            });
    }

    cutString(data) {
        let newString = data.slice(0, 20);
        return newString
    }

    render() {
        var current = this;
        return (
            <div className={`${this.state.themeColorDarkVanilla} border-right`} id="sidebar-wrapper">
                <div className="sidebar-brand">Vanilla</div>
                <div className="list-group list-group-flush">
                    <Link to="#" className={`list-group-item list-group-item-action ${this.state.themeColorDarkVanilla}`}><i className="fas fa-tachometer-alt icon-fas-nav"></i>Dashboard</Link>
                    <Link to="/project-overview" className={`list-group-item list-group-item-action ${this.state.themeColorDarkVanilla}`}><i className="fas fa-tasks icon-fas-nav"></i>Project Management</Link>
                    <Link to="/products" className={`list-group-item list-group-item-action ${this.state.themeColorDarkVanilla}`}><i className="fas fa-chart-bar icon-fas-nav"></i>Products</Link>
                </div>
                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                    <span>Agenda</span>
                    {this.state.user_infoes.map(function (user_info) {
                        if (user_info.role_id === 0 || user_info.role_id === 1 || user_info.role_id === 2 || user_info.role_id === 3) {
                            return <Link className="d-flex align-items-center text-muted" to="/create-project"><span><i className="fas fa-plus-circle"></i></span></Link>;
                        }
                        return null;
                    })}
                </h6>
                <div className="list-group list-group-flush">
                    {this.state.projects.map(function (project) {
                        // if (current.state.checkClick === true) {
                            // current.state.checkClick = false
                            return (
                                <Link onClick={current.handleCheck} to={{ pathname: `/project-task/${project.tcorp_id}`, id: project.id }} className={`list-group-item list-group-item-action ${current.state.themeColorDarkVanilla} sidebar-projects`}>{project.customer_name} : {current.cutString(project.name_th)}</Link>
                            )
                        // }
                    })}
                </div>
            </div>
        )
    };
}

export default NavSidebar;