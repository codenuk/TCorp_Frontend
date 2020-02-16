import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom'

import "../../../vendor/bootstrapv2/bootstrap.css" // ttps://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css
import "../../../css/adjust_bootstrap.css";
import "../../../css/sign_in.css";

import { API_URL_DATABASE } from '../../config_database.js';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],

            firstname: '',
            lastname: '',
            email: '',
            username: '',
            password: '',
            re_password: '',
            active: 0,
            employee_id: 'null',
            loggedIn: false,

            category: [],
            filter_name: [],
            indexOfItem: -1
        }

        this.filterCategory = this.filterCategory.bind(this);
        this.checkName = this.checkName.bind(this);
        this.buttonSubmit = this.buttonSubmit.bind(this);
    }

    handleChangeFirstname = event => {
        this.setState({ firstname: event.target.value });
    }

    handleChangeLastname = event => {
        this.setState({ lastname: event.target.value });
    }

    handleChangeEmail = event => {
        this.setState({ email: event.target.value });
    }

    handleChangeUsername = event => {
        var a = this.state.filter_name.indexOf(event.target.value);
        console.log("Hello filter >>>>", a)
        this.setState({ indexOfItem: a })
        if(event.target.value.length <= 45 && a === -1){
            this.setState({ username: event.target.value });
        }
    }

    handleChangePassword = event => {
        this.setState({ password: event.target.value });
    }

    handleChangeRePassword = event => {
        this.setState({ re_password: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        console.log("handleSubmit")

        const regiser_user = {
            "firstname": this.state.firstname,
            "lastname": this.state.lastname,
            "email": this.state.email,
            "username": this.state.username,
            "password": this.state.password,
            "employee_id": this.state.employee_id,
            "active": this.state.active
        };
        console.log("regiser user", regiser_user)
        if(this.state.re_password !== regiser_user.password){
            alert("Incorrect Password");
        }else{
            axios.post(`http://vanilla-erp.com:${API_URL_DATABASE}/api/auth/register`, regiser_user)
                .then(res => {
                    // console.log(res);
                    console.log(res.data.token);
                    this.setState({loggedIn: true});
                }).catch(function(err) {
                    console.log(err)
                })
        }
    }

    componentDidMount() {
        // console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var current = this;
        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/users` )
            .then(res => {
                // console.log(res)
                const allUsers = res.data;
                this.setState({ allUsers: allUsers, isTokenValid: true });
                current.filterCategory();
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });
    }

    filterCategory(){
        var filter_name = []
        this.state.allUsers.map(function(allUsers){
            filter_name.push(allUsers.username);
        })
        this.setState({ filter_name: filter_name})
        // console.log("hello filter", this.state.filter_name)
    }

    checkName(){
        console.log("indexOfItem", this.state.indexOfItem)
        if (this.state.indexOfItem !== -1){
            return <label className="ml-2 mt-2" style={{color: "#ff6666"}}>มีคนได้ใช้ Username นี้แล้วกรุณาเปลี่ยน</label>
        }
    }

    buttonSubmit(){
        if (this.state.indexOfItem !== -1){
            return <button className="btn btn-lg btn-primary btn-block" id="ButtonLogin" type="button">สมัครสมาชิกใหม่</button>
        }
        return <button className="btn btn-lg btn-primary btn-block" id="ButtonLogin" type="submit">สมัครสมาชิกใหม่</button>

    }

    render() {
        if (this.state.loggedIn === true){
            return <Redirect to='/' />
        }
        return (
            <div>
                <form className="form-signin" onSubmit={this.handleSubmit}>
                    <h1 id="Vanilla-Team">Vanilla</h1>
                    <p className="TopicLogin">สมัครสมาชิก</p>
                    <label for="inputEmail" className="sr-only">Username</label>
                    {/* <input type="text" id="inputEmployeeId" className="form-control" placeholder="Employee Id" onChange={this.handleChangeEmployeeId}/> */}
                    <input type="text" id="inputFirstname" className="form-control" placeholder="Firstname" onChange={this.handleChangeFirstname} required/>
                    <input type="text" id="inputLastname" className="form-control" placeholder="Lastname" onChange={this.handleChangeLastname} required/>
                    <input type="email" id="inputEmail" className="form-control" placeholder="Email Address" onChange={this.handleChangeEmail} required/>
                    <input type="text" id="inputUsername" className="form-control" placeholder="Username" autofocus onChange={this.handleChangeUsername} required/>
                    {this.checkName()}
                    <input type="password" id="inputPassword" className="form-control" placeholder="Password" onChange={this.handleChangePassword} required/>
                    <input type="password" id="inputRePassword" className="form-control" placeholder="Re-Password" onChange={this.handleChangeRePassword} required/>
                    {this.buttonSubmit()}
                    <Link to="/"><p className="DetailLogin">ย้อนกลับ</p></Link>
                    <p className="mt-5 mb-3 text-muted center-text">&copy; 2019 By Vanilla Team</p>
                </form>
            </div>
        );
    }
    
}

export default Register;