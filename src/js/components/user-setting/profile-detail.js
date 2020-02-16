import React from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom'
// Redirect,
import '../../../css/bootstrap.css';
import '../../../css/adjust_bootstrap.css';
import '../../../vendor/fontawesome-free/css/all.css';
import '../../../css/mystyles.css';
import logo from '../../../images/avatar.jpg';

class ProfileDetails extends React.Component {

    state = {
        user_infos: [],
        isTokenValid: false,
    }

    componentDidMount() {
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var decoded = jwt_decode(token_auth);
        var username = decoded.username;
        var current = this;
        axios.get(`http://vanilla-erp.com:10000/api/v1/users/${username}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const user_infos = res.data;
                // console.log(persons.length)
                this.setState({ user_infos: user_infos, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });
    }

    checkGender(gen) {
        if (gen === 0) {
            var na = "N/A"
            return na
        }
        if (gen === 1) {
            var male = "ชาย";
            return male;
        }
        if (gen === 2) {
            var female = "หญิง";
            return female;
        }
        var na = "N/A"
        return na
    }

    checkBirthday(date) {
        if (date === null || date === "null") {
            var n_a = "N/A";
            return n_a;
        }
        var na = date.slice(0, 10);
        return na
    }

    checkNaNData(data) {
        if (data === null || data === "null") {
            var na = "N/A";
            return na;
        }
        return data;
    }

    nameUpperLower(data) {
        if(data === null){
            var na = "N/A";
            return na;
        }
        var count = data.length;
        var firstChar = data.substring(0,1).toUpperCase();
        var anotherChar = data.substring(1,count).toLowerCase();
 
        var name = firstChar+anotherChar;
        return name;
    }

    render() {
        // console.log("last",this.state.user_infos);
        return (
            <>
                {this.state.user_infos.map((user_info) => (
                    <div className="row">
                        <div className="col-3">
                            <div className="row newRow">
                                <div className="col-12">
                                    <img src={logo} width="100%" alt='ture' />
                                </div>
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="row">
                                <div className="col-12">
                                    <h2> {this.nameUpperLower(user_info.firstname)} {this.nameUpperLower(user_info.lastname)} </h2>
                                    <h4 className="line_under_Projects">ตำแหน่งงาน: {user_info.name} </h4>
                                    <h3>รายละเอียดเพิ่มเติม</h3>
                                    <h5>Email: {user_info.email} </h5>
                                    <h5>เบอร์ติดต่อ: {this.checkNaNData(user_info.phone)} </h5>
                                    <h5>เพศ: {this.checkGender(user_info.gender)} </h5>
                                    <h5>วันเกิด: {this.checkBirthday(user_info.birthdate)} </h5>
                                    <h5>ที่อยู่: {this.checkNaNData(user_info.address)} </h5>
                                    <Link to="/edit-users-profile"><button type="button" className="btn btn-secondary">แก้ไขข้อมูลส่วนตัว</button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        )
    };
}


export default ProfileDetails;