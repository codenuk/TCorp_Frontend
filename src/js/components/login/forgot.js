import React from 'react';
import { Link } from 'react-router-dom'

import "../../../vendor/bootstrapv2/bootstrap.css" // ttps://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css
import "../../../css/adjust_bootstrap.css";
import "../../../css/sign_in.css";

class ForgotPass extends React.Component {
    render() {
        return (
            <div>
                <form class="form-signin" action="/project-overview">
                    <h1 id="Vanilla-Team">Vanilla</h1>
                    <p class="TopicLogin">ลืมรหัสผ่าน</p>
                    <label for="inputEmail" class="sr-only">Email address</label>
                    <input type="email" id="inputEmail" class="form-control" placeholder="Email address" autofocus/>
                    <label for="inputPassword" class="sr-only">Password</label>
                    <input type="password" id="inputPassword" class="form-control" placeholder="Password" />
                    <input type="password" id="inputPassword" class="form-control" placeholder="Re-Password" />
                    <button class="btn btn-lg btn-primary btn-block" id="ButtonLogin" type="submit">ส่งข้อมูลไปที่ Email</button>

                    <Link to="/"><p className="DetailLogin">ย้อนกลับ</p></Link>

                    <p class="mt-5 mb-3 text-muted center-text">&copy; 2019 By Vanilla Team</p>
                </form>
            </div>
            
        );
    }
    
}

export default ForgotPass;