import React from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Link, Redirect } from 'react-router-dom'

class EditProfile extends React.Component {

    state = {
        user_infos: [],

        phone: '',
        gender: '',
        birthdate: '',
        address: '',
        isFinish: false
    }

    handleChangePhone = event => {
        this.setState({ phone: event.target.value });
    }

    handleChangeGender = event => {
        this.setState({ gender: event.target.value });
    }

    handleChangeBirthdate = event => {
        this.setState({ birthdate: event.target.value });        
    }

    handleChangeAddress = event => {
        this.setState({ address: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        console.log("handleSubmit")

        const edited = {
            "phone": this.state.phone,
            "gender": this.state.gender,
            "birthdate": this.state.birthdate,
            "address": this.state.address
        };
        console.log("edited", edited)

        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var decoded = jwt_decode(token_auth);
        var username = decoded.username;
        axios.put(`http://vanilla-erp.com:10000/api/v1/users/${username}`, edited, { headers: { "x-access-token": localStorage.getItem('token_auth') } })
            .then(res => {
                console.log(res);
                this.setState({ isFinish: true });
            }).catch(function (err) {
                console.log(err);
                this.setState({ isFinish: false });
            })
    }

    getUsername() {
        console.log(`Sending with headers navTopbar  ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var decoded = jwt_decode(token_auth);
        var username = decoded.username;
        return username
    }

    componentDidMount() {
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var decoded = jwt_decode(token_auth);
        var username = decoded.username;
        // var current = this;
        axios.get(`http://vanilla-erp.com:10000/api/v1/users/${username}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const user_infos = res.data;
                // console.log(persons.length)
                this.setState({
                    user_infos: user_infos,
                    phone: user_infos[0].phone,
                    gender: user_infos[0].gender,
                    birthdate: user_infos[0].birthdate,
                    address: user_infos[0].address,
                    // isTokenValid: true
                });
            })
            .catch(function (err) {
                console.log(err);
                // current.setState({ isTokenValid: false });
            });
    }

    checkBirthday(date){
        if(date !== null){
            return date.slice(0, 10);
        }
        return date
    }

    checkNaNData(data){
        if(data === null){
            var na = "N/A";
            return na;
        }
        return data;
    }

    render() {
        if (this.state.isFinish === true) {
            return <Redirect to={`/users-profile/${this.getUsername()}`} />
        }
        return (
            <div>
                <Link to={`/users-profile/${this.getUsername()}`}><i className="IconClosePage fas fa-times"></i></Link>
                <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }} >
                    <form onSubmit={this.handleSubmit}>
                        {this.state.user_infos.map((user_info) => (
                            <>
                                <h1>แก้ไขข้อมูลส่วนตัว: {}</h1>

                                <div className="form-group">
                                    <h4>เบอร์ติดต่อ</h4>
                                    <input type="number" className="form-control" onChange={this.handleChangePhone} placeholder={this.checkNaNData(user_info.phone)} />
                                </div>
                                <div className="form-group">
                                    <h4>เพศ</h4>
                                    <select className="form-control" onChange={this.handleChangeGender}>
                                        {this.state.user_infos.map(function (user_info){
                                            if (user_info.gender===0) return <option value="0" selected>None</option>
                                            return <option value="0" >None</option>
                                        })}
                                        {this.state.user_infos.map(function (user_info){
                                            if (user_info.gender===1) return <option value="1" selected>ชาย</option>
                                            return <option value="1" >ชาย</option>
                                        })}
                                        {this.state.user_infos.map(function (user_info){
                                            if (user_info.gender===2) return <option value="2" selected>หญิง</option>
                                            return <option value="2">หญิง</option>
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <h4>วันเกิด</h4>
                                    <input type="date" className="form-control" onChange={this.handleChangeBirthdate} defaultValue={this.checkBirthday(user_info.birthdate)} />
                                </div>
                                <div className="form-group">
                                    <h4>ที่อยู่</h4>
                                    <input type="text" className="form-control" onChange={this.handleChangeAddress} placeholder={this.checkNaNData(user_info.address)} />
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: "100%", fontSize: "1.3em", color: "white" }}>แก้ไขโปรเจค</button>
                            </>
                        ))}
                    </form>
                </div>

            </div>
        )
    }

}

export default EditProfile;