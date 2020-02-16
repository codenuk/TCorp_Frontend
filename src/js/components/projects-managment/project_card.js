import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom'

import '../../../css/bootstrap.css';
import '../../../css/adjust_bootstrap.css';
import '../../../vendor/fontawesome-free/css/all.css';
import '../../../css/mystyles.css';

class ComponentProjectCards extends React.Component {

    state = {
        projects: [],
        isTokenValid: true,
    }

    componentDidMount() {
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        //token_auth = "asdasdasdasd";
        var current = this;
        axios.get(`http://vanilla-erp.com:10000/api/v1/projects/overview`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const projects = res.data;
                // console.log(persons.length)
                this.setState({ projects: projects, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });
    }

    diffTime(date) {
        var dateNow = new Date();
        var dateEnd = new Date(date);
        var diff = (dateEnd - dateNow) / (1000 * 3600 * 24);
        var x = Math.floor(diff);
        return x;
    }

    persent(total_tasks, total_finished) {
        var cal_per = total_finished / (total_tasks-2) * 100;
        var x = Math.floor(cal_per);
        if (isNaN(x)) {
            var checkNan = "N/A";
            return checkNan
        }
        // var xx = x + "%";
        console.log(x)
        return x
    }

    checkData(data) {
        if (data === null) {
            var nanData = "N/A";
            return nanData;
        }
        var cutString = data.slice(0, 15);
        return cutString;
    }

    checkValue(data){
        if (data === null) {
            var nanData = "N/A";
            return nanData;
        }
        return data;
    }

    colorCustomer(data, project) {
        if (data === 1) {
            // current.state.count = false;
            return (<p className="Card-sign" style={{ color: "#17a2b8" }} key={project.id}>{project.customer_name} <span className="Card-id" key={project.id}> :{project.tcorp_id}</span> </p>);
        }
        return (<p className="Card-sign" style={{ color: "#fd7e14" }} key={project.id}>{project.customer_name} <span className="Card-id" key={project.id}> :{project.tcorp_id}</span> </p>);
    }

    // 25% 50% 75% 100% = #dc3545 #ffc107 #17a2b8 #28a745
    colorPersent(data, project) {
        var current = this;
        if (data <= 25) {
            return (
                <div className="small-card" style={{ backgroundColor: "#dc3545" }}>
                    <h1 className="Percent"><b>{current.persent(project.no_total_tasks, project.no_total_finished)}%</b></h1>
                    <p className="Progress">Progress</p>
                </div>
            );
        }
        if (data <= 50) {
            return (
                <div className="small-card" style={{ backgroundColor: "#ffc107" }}>
                    <h1 className="Percent"><b>{current.persent(project.no_total_tasks, project.no_total_finished)}%</b></h1>
                    <p className="Progress">Progress</p>
                </div>
            );
        }
        if (data <= 75) {
            return (
                <div className="small-card" style={{ backgroundColor: "#17a2b8" }}>
                    <h1 className="Percent"><b>{current.persent(project.no_total_tasks, project.no_total_finished)}%</b></h1>
                    <p className="Progress">Progress</p>
                </div>
            );
        }
        if (data <= 100) {
            return (
                <div className="small-card" style={{ backgroundColor: "#28a745" }}>
                    <h1 className="Percent"><b>{current.persent(project.no_total_tasks, project.no_total_finished)}%</b></h1>
                    <p className="Progress">Progress</p>
                </div>
            );
        }
        return (
            <div className="small-card" style={{ backgroundColor: "#dc3545" }}>
                <h1 className="Percent"><b>{current.persent(project.no_total_tasks, project.no_total_finished)}</b></h1>
                <p className="Progress">Progress</p>
            </div>
        )
    }

    // 25% 50% 75% 100% = #dc3545 #ffc107 #17a2b8 #28a745
    colorPersentBar(data, project) {
        if (data <= 25) {
            return (
                <div className="progress-bar" role="progressbar" style={{ width: `${this.persent(project.no_total_tasks, project.no_total_finished)}%`, backgroundColor: "#dc3545"}}  aria-valuemin="0" aria-valuemax="100"></div>
            );
        }
        if (data <= 50) {
            return (
                <div className="progress-bar" role="progressbar" style={{ width: `${this.persent(project.no_total_tasks, project.no_total_finished)}%`, backgroundColor: "#ffc107" }}  aria-valuemin="0" aria-valuemax="100"></div>
            );
        }
        if (data <= 75) {
            return (
                <div className="progress-bar" role="progressbar" style={{ width: `${this.persent(project.no_total_tasks, project.no_total_finished)}%`, backgroundColor: "#17a2b8" }}  aria-valuemin="0" aria-valuemax="100"></div>
            );
        }
        if (data <= 100) {
            return (
                <div className="progress-bar" role="progressbar" style={{ width:  `${this.persent(project.no_total_tasks, project.no_total_finished)}%`, backgroundColor: "#28a745" }}  aria-valuemin="0" aria-valuemax="100"></div>
            );
        }
        return (
            <div className="progress-bar" role="progressbar" style={{ width: `${this.persent(project.no_total_tasks, project.no_total_finished)}%`, backgroundColor: "#dc3545" }}  aria-valuemin="0" aria-valuemax="100"></div>
        )
    }

    createFakeData() {
        var current = this
        return (
            <>
                {this.state.projects.map((project) => (
                    <Link to={{ pathname: `/project-task/${project.tcorp_id}`, id: project.id }} className="none_line">
                        <div className="card">
                            {current.colorPersent(current.persent(project.no_total_tasks, project.no_total_finished), project)}
                            {current.colorCustomer(project.customer_id, project)}
                            <h1 className="Card-setting">{project.type}</h1>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-5">
                                        <p className="Class-info">งานที่สำเร็จล่าสุด</p>
                                        <p className="Class-info-status" style={{ color: "#11be9f" }}>{this.checkData(project.task_prev)}</p>
                                    </div>
                                    <div className="col-5">
                                        <p className="Class-info">งานถัดไปที่ต้องทำ</p>
                                        <p className="Class-info-status" style={{ color: "#be1111" }}>{this.checkData(project.task_next)}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="Class-info">มูลค่างาน</p>
                                        <p className="Class-info-status" style={{ color: "#11be9f" }}>{this.checkValue(project.value.toLocaleString())} ฿</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-5">
                                        <span className="Class-info">สถานะ:<span className="Class-info-identity">{this.diffTime(project.end_contract_date)} Day</span></span>
                                    </div>
                                    <div className="col-7">
                                        <span className="Class-info" style={{ color: "#000000" }}>ส่งมอบงานภายใน:<span className="Class-info-identity" style={{ color: "#000000" }}>{project.end_contract_date.slice(0, 10)}</span></span>
                                    </div>
                                </div>
                                <div className="progress card-project-prgress-bar">
                                    {current.colorPersentBar(current.persent(project.no_total_tasks, project.no_total_finished), project)}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </>
        )
    }


    render() {
        if (!this.state.isTokenValid) {
            return <Redirect to='/' />
        }

        return (
            <div>
                <div className="row">

                    {this.createFakeData()}

                </div>
                <div className="mb-5"></div>
            </div>
        )
    };
}


export default ComponentProjectCards;
