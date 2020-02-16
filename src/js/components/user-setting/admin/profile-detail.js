import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom'

import '../../../../css/bootstrap.css';
import '../../../../css/adjust_bootstrap.css';
import '../../../../vendor/fontawesome-free/css/all.css';
import '../../../../css/mystyles.css';
import logo from '../../../../images/avatar.jpg';

class AdminProfileDetails extends React.Component {

    state = {
        user_infos: [],
        roles: [],

        active:'',
        role_id: '',
        isTokenValid: false,
        isFinish: false
    }

    handleChangeRoleID = event => {
        this.setState({ role_id: event.target.value });
    }

    handleChangeActive = event => {
        this.setState({ active: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        console.log("handleSubmit")

        const edited = {
            "role_id": this.state.role_id,
            "active": this.state.active
        };
        console.log("edited", edited)
        var current = this;
        // console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        axios.put(`http://vanilla-erp.com:10000/api/v1/users/${this.props.username}`, edited, { headers: { "x-access-token": token_auth } })
            .then(res => {
                console.log(res);
                this.setState({ isFinish: true });
            }).catch(function (err) {
                console.log(err);
                current.setState({ isFinish: false });
            })

    }

    componentDidMount() {
        // console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var current = this;
        axios.get(`http://vanilla-erp.com:10000/api/v1/users/${this.props.username}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const user_infos = res.data;
                // console.log(persons.length)
                this.setState({
                    user_infos: user_infos, 
                    isTokenValid: true,
                    active: user_infos[0].active,
                    role_id: user_infos[0].role_id
                });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:10000/api/v1/users/role`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const roles = res.data;
                // console.log(persons.length)
                this.setState({
                    roles: roles, 
                });
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

    checkBirthday(date){
        if(date !== null){
            return date.slice(0, 10);
        }
        var na = "N/A"
        return na
    }

    checkNanData(data){
        if(data===null){
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
        if(this.state.isFinish===true){
            return <Redirect to="/users_management" />
        }
        return (
            <>
                {this.state.user_infos.map((user_info) => (
                    <form onSubmit={this.handleSubmit}>
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

                                        <h4>
                                            ตำแหน่งงาน:
                                        <select className="form-control" onChange={this.handleChangeRoleID}>
                                                {this.state.roles.map(function (role) {
                                                    if(role.id===user_info.role_id) return <option value={role.id} selected> {role.name} </option>
                                                    return <option value={role.id} > {role.name} </option>
                                                })}
                                            </select>
                                        </h4>

                                        <h4 className="line_under_Projects">
                                            สถานการทำงาน:
                                        <select className="form-control" onChange={this.handleChangeActive}>
                                                {this.state.user_infos.map(function (user_info) {
                                                    if (user_info.active === 0) return <option value="0" selected>Deactive</option>
                                                    return <option value="0">Deactive</option>
                                                })}
                                                {this.state.user_infos.map(function (user_info) {
                                                    if (user_info.active === 1) return <option value="1" selected>Active</option>
                                                    return <option value="1">Active</option>
                                                })}
                                            </select>
                                        </h4>

                                        <h3>รายละเอียดเพิ่มเติม</h3>
                                        <h5>Email: {this.checkNanData(user_info.email)} </h5>
                                        <h5>เบอร์ติดต่อ: {this.checkNanData(user_info.phone)} </h5>
                                        <h5>เพศ: {this.checkGender(user_info.gender)} </h5>
                                        <h5>วันเกิด: {this.checkBirthday(user_info.birthdate)} </h5>
                                        <h5>ที่อยู่: {this.checkNanData(user_info.address)} </h5>
                                        <button type="submit" className="btn btn-secondary">ยืนยัน</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                ))}
            </>
        )
    };
}


export default AdminProfileDetails;






