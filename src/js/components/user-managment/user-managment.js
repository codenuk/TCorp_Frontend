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

    state = {
        allUsers: [],
        isTokenValid: false,
    }

    componentDidMount() {
        // console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var current = this;
        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/users`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
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
        console.log(data);
        if (data === null || data === "") {
            return data
        }
        else{
            var count = data.length;
            var firstChar = data.substring(0, 1).toUpperCase();
            var anotherChar = data.substring(1, count).toLowerCase();

            var name = firstChar + anotherChar;
            return name;
        }
    }

    render() {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Create At</th>
                        <th>Last login</th>
                        <th>Status</th>
                        <th>Update</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.allUsers.map((allUser) => (
                        <tr>
                            <td style={{ width: '5px' }}>
                                <img src={logo} className="rounded-circle" style={{ width: '42px' }} alt="ture" />
                            </td>
                            <td>
                                {this.nameUpperLower(allUser.firstname)} {this.nameUpperLower(allUser.lastname)}
                            </td>
                            <td>{allUser.name}</td>
                            <td>01 Oct 2019 13.00</td>
                            <td>31 Oct 2019 22.00</td>
                            <td> {this.checkActive(allUser.active)} </td>
                            <td>
                                <form action="_users_profile_admin.html">
                                    <Link to={`/admin-users-profile/${allUser.username}`} ><button type="submit" className="btn btn-warning">แก้ไขข้อมูล</button></Link>
                                </form>
                            </td>
                        </tr>
                    ))}
                    <div className="mb-5"></div>
                </tbody>
            </table>

        )
    };
}


export default componentUserManagement;