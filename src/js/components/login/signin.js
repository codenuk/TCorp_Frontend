import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom'

import "../../../vendor/bootstrapv2/bootstrap.css" // ttps://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css
import "../../../css/adjust_bootstrap.css";
import "../../../css/sign_in.css";

import { API_URL_DATABASE } from '../../config_database.js';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            loggedIn: false,
            checkActivate: ''
        };
    }

    handleChangeUsername = event => {
        this.setState({ username: event.target.value });
    }

    handleChangePassword = event => {
        this.setState({ password: event.target.value });
    }

    handleSubmit = async event => {
        event.preventDefault();
        console.log("handleSubmit")

        const user = {
            "username": this.state.username,
            "password": this.state.password
        };
        console.log("user", user)
        var current = this;

        await axios.post(`http://vanilla-erp.com:${API_URL_DATABASE}/api/auth/login`, user)
            .then(res => {
                // console.log(res);
                console.log(res.data.token);
                localStorage.setItem('token_auth', res.data.token)
                console.log("token_auth", localStorage.getItem('token_auth'))
            }).catch(function(err) {
                console.log(err)
            })   

        var token_auth = await localStorage.getItem('token_auth');
        await axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/users/${this.state.username}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const user_infoes = res.data;
                if(user_infoes[0].active!==0){
                    this.setState({ checkActivate: true ,loggedIn: true});
                }
                if(user_infoes[0].active === 0){
                    this.setState({ checkActivate: false });
                    alert("User Deactivate");
                }
            })
            .catch(function (err) {
                current.setState({ loggedIn: true });
                alert("ID or Password incorrect");
            });

    }

    render() {
        if (this.state.loggedIn === true && this.state.checkActivate === true){
            return <Redirect to='/project-overview'/> 
        }
        return (
            <div>
                <form className="form-signin" onSubmit={this.handleSubmit}  checkProps="Hello Prop">
                    <h1 id="Vanilla-Team">Vanilla</h1>
                    <p className="TopicLogin">เข้าสู่ระบบ</p>
                    <label for="inputEmail" className="sr-only">Username</label>
                    <input type="text" id="inputUsername" name="username" className="form-control" onChange={this.handleChangeUsername} placeholder="Username" required></input>
                    <label for="inputPassword" className="sr-only">Password</label>
                    <input type="password" id="inputPassword" name="password" className="form-control" onChange={this.handleChangePassword} placeholder="Password" required></input>
                    {/* <div className="checkbox mb-3 center-text">
                        <label className="remember-password">
                            <input type="checkbox" value="remember-me" /> จดจำรหัสผ่าน
                        </label>
                    </div> */}

                    <button className="btn btn-lg btn-primary btn-block" id="ButtonLogin" type="submit">เข้าสู่ระบบ</button>

                    <Link to="/register-page"><p className="DetailLogin">สมัครสมาชิกใหม่</p></Link>
                    {/* <Link to="/forgot-page"><p className="DetailLogin">ลืมรหัสผ่าน</p></Link> */}

                    <p className="mt-5 mb-3 text-muted center-text">&copy; 2019 By Vanilla Team</p>
                </form>
            </div>

        );
    }

}

export default Login;