import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

import '../../../css/bootstrap.css';
import '../../../css/adjust_bootstrap.css';
import '../../../vendor/fontawesome-free/css/all.css';
import '../../../css/mystyles.css';
import logo from '../../../images/avatar.jpg';

import { API_URL_DATABASE } from '../../config_database.js';

class componentUserManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            isActive: true,
            isTokenValid: false
        }
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
    }

    handleChangeStatus(event) {
        // console.log(event.target.value);
        if(event.target.value === "1"){
            this.setState({ isActive: true,  allUsers: this.state.allUsers})
        }
        else{
            this.setState({ isActive: false,  allUsers: this.state.allUsers })
        }
        
    }

    componentDidMount() {
        // console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var current = this;
        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/users`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res.data)
                const allUsers = res.data;
                // console.log(persons.length)
                this.setState({ allUsers: allUsers, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });
    }

    checkActive(data) {
        if (data === 0) {
            var deactive = "Deactive";
            return deactive;
        }
        var active = "Active";
        return active
    }

    nameUpperLower(data) {
        // console.log(data);
        if (data === null || data === "") {
            return data
        }
        else {
            var count = data.length;
            var firstChar = data.substring(0, 1).toUpperCase();
            var anotherChar = data.substring(1, count).toLowerCase();

            var name = firstChar + anotherChar;
            return name;
        }
    }

    render() {
        var current = this;
        console.log("state", this.state.isActive)
        console.log("state", this.state.allUsers)

        return (
            <>
                <select className="form-control" onChange={this.handleChangeStatus}>
                    <option value="1" selected>Active</option>
                    <option value="0">Deactive</option>
                </select>
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Create At</th>
                            <th>Last login</th>
                            <th>Status</th>
                            <th>Update</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.allUsers.map(function (allUser) {
                            if (current.state.isActive === true && allUser.active === 1) {
                                console.log("active",allUser.username)
                                return (
                                    <tr>
                                        <td style={{ width: '5px' }}>
                                            <img src={logo} className="rounded-circle" style={{ width: '42px' }} alt="ture" />
                                        </td>
                                        <td>
                                            {current.nameUpperLower(allUser.firstname)} {current.nameUpperLower(allUser.lastname)}
                                        </td>
                                        <td>
                                            {allUser.username}
                                        </td>
                                        <td>{allUser.name}</td>
                                        <td>01 Oct 2019 13.00</td>
                                        <td>31 Oct 2019 22.00</td>
                                        <td> {current.checkActive(allUser.active)} </td>
                                        <td>
                                            <form action="_users_profile_admin.html">
                                                <Link to={`/admin-users-profile/${allUser.username}`} ><button type="submit" className="btn btn-warning">แก้ไขข้อมูล</button></Link>
                                            </form>
                                        </td>
                                    </tr>
                                )
                            }
                            if (current.state.isActive === false && allUser.active === 0) {
                                console.log("deactive",allUser.username)

                                return (
                                    <tr>
                                        <td style={{ width: '5px' }}>
                                            <img src={logo} className="rounded-circle" style={{ width: '42px' }} alt="ture" />
                                        </td>
                                        <td>
                                            {current.nameUpperLower(allUser.firstname)} {current.nameUpperLower(allUser.lastname)}
                                        </td>
                                        <td>
                                            {allUser.username}
                                        </td>
                                        <td>{allUser.name}</td>
                                        <td>01 Oct 2019 13.00</td>
                                        <td>31 Oct 2019 22.00</td>
                                        <td> {current.checkActive(allUser.active)} </td>
                                        <td>
                                            <form action="_users_profile_admin.html">
                                                <Link to={`/admin-users-profile/${allUser.username}`} ><button type="submit" className="btn btn-warning">แก้ไขข้อมูล</button></Link>
                                            </form>
                                        </td>
                                    </tr>
                                )
                            }
                        })}
                        <div className="mb-5"></div>
                    </tbody>
                </table>
            </>

        )
    };
}


export default componentUserManagement;