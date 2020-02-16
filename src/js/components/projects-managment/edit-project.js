import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'
import NumberFormat from 'react-number-format';

import { API_URL_DATABASE } from '../../config_database.js';

class EditProject extends React.Component {
    state = {
        projectIdOlds: [],
        customers: [],
        proCategories: [],
        bills: [],
        isTokenValid: false,
        isFinish: false,
        checkDelete: false,

        //Post Data
        name_th: "",
        description: "",
        value: "",
        contract_id: "",
        end_contract_date: "",
        billing_configuration_id: "",
        project_category_id: "",
        customer_id: "",
    }

    handleChangeName = event => {
        if (event.target.value.length <= 255) {
            this.setState({ name_th: event.target.value });
        }
    }

    handleChangeDescription = event => {
        if (event.target.value.length <= 255) {
            this.setState({ description: event.target.value });
        }
    }

    handleChangeValue = event => {
        console.log(event.target.value)
        if (event.target.value !== "" && event.target.value.length <= 25) {
            this.setState({ value: event.target.value });
        }
        else {
            this.setState({ value: 0 });
        }
    }

    handleChangeContractIdName = event => {
        if (event.target.value.length <= 44) {
            this.setState({ contract_id: event.target.value });
        }
    }

    handleChangeEndContractDate = event => {
        if (event.target.value.length <= 10) {
            console.log("date", event.target.value.length)
            this.setState({ end_contract_date: event.target.value });
        }
    }

    handleChangeBillingConfigurationsId = event => {
        this.setState({ billing_configuration_id: event.target.value });
    }

    handleChangeProjectCategories = event => {
        this.setState({ project_category_id: event.target.value });
    }

    handleChangeCustomerId = event => {
        this.setState({ customer_id: event.target.value });
    }

    handleAborted = event => {
        event.preventDefault();
        console.log("handleAborted")
        var info = { "is_aborted": 0 }
        if (this.state.projectIdOlds[0].is_aborted === 0) {
            info['is_aborted'] = 1
        }

        axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.match.params.tcorp_id}`, info, { headers: { "x-access-token": localStorage.getItem('token_auth') } })
            .then(res => {
                console.log(res);
                this.setState({ isFinish: true });
                this.setState({ isTokenValid: true });
            }).catch(function (err) {
                console.log(err);
                // this.setState({ isTokenValid: false });
            })

    }

    handleSubmit = event => {
        event.preventDefault();

        var value_not_comma = this.state.value;
        for (var i = 0; i < 4; i++) {
            value_not_comma = value_not_comma.replace(",", "");
            this.setState({ value: value_not_comma });
            console.log("hello", value_not_comma)
        }

        const project = {
            "name_th": this.state.name_th,
            "description": this.state.description,
            "value": value_not_comma,
            "contract_id": this.state.contract_id,
            "end_contract_date": this.state.end_contract_date,
            "billing_configuration_id": this.state.billing_configuration_id,
            "project_category_id": this.state.project_category_id,
            "customer_id": this.state.customer_id
        };
        console.log("project", project)

        axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.match.params.tcorp_id}`, project, { headers: { "x-access-token": localStorage.getItem('token_auth') } })
            .then(res => {
                console.log(res);
                this.setState({ isFinish: true });
                this.setState({ isTokenValid: true });
            }).catch(function (err) {
                console.log(err);
                // this.setState({ isTokenValid: false });
            })

    }

    componentDidMount() {
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var current = this;

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.match.params.tcorp_id}    
        `, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const projectIdOlds = res.data;
                this.setState({
                    projectIdOlds: projectIdOlds,
                    isTokenValid: true,

                    name_th: projectIdOlds[0].name_th,
                    description: projectIdOlds[0].description,
                    value: projectIdOlds[0].value,
                    contract_id: projectIdOlds[0].contract_id,
                    end_contract_date: projectIdOlds[0].end_contract_date.substring(0, 10),
                    billing_configuration_id: projectIdOlds[0].billing_configuration_id,
                    project_category_id: projectIdOlds[0].project_category_id,
                    customer_id: projectIdOlds[0].customer_id,
                });
                console.log("check data", current.state.end_contract_date)
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/customers`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const customers = res.data;
                // console.log(projects.length)
                this.setState({ customers: customers, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/project_categories`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const proCategories = res.data;
                // console.log(projects.length)
                this.setState({ proCategories: proCategories, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/billing_configurations`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const bills = res.data;
                // console.log(projects.length)
                this.setState({ bills: bills, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });
    }

    handleDelete = () => {
        var token_auth = localStorage.getItem('token_auth');
        console.log("check token ", token_auth)
        axios.delete(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.match.params.tcorp_id}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ checkDelete: true });
            })
    }

    checkNanData(data) {
        if (data === "") {
            var na = "N/A";
            return na;
        }
        return data;
    }

    checkNanDataPrice(data) {
        if (data === "") {
            var na = "N/A";
            return na;
        }
        var x = data.toString().indexOf('.');
        var y = data.toString().length;
        // console.log("dot price", x)
        // console.log("dot 2", y)
        if (x === -1) {
            return data + ".00";
        }
        if (y - x === 2) {
            return data + "0";
        }
        return data;
    }

    checkNullDate(data) {
        if (data === null) {
            var na = "N/A";
            return na;
        }
        return data.slice(0, 10);
    }

    render() {
        if (this.state.isFinish === true) {
            return <Redirect to={`/project-task/${this.state.projectIdOlds[0].tcorp_id}`} />
        }
        if (this.state.checkDelete === true) {
            return <Redirect to={`/project-overview`} />
        }
        return (
            <div>
                {this.state.projectIdOlds.map((projectIdOld) => (
                    <>
                        <Link to={`/project-task/${projectIdOld.tcorp_id}`}><i className="IconClosePage fas fa-times"></i></Link>
                        <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }} >
                            <form onSubmit={this.handleSubmit}>
                                <h1>แก้ไขรายละเอียดโปรเจคที่: {projectIdOld.tcorp_id}</h1>
                                <div className="row">
                                    <button type="button" onClick={(e) => { if (window.confirm('คุณต้องการยกเลิกโปรเจคนี้หรือไม่?')) this.handleAborted(e) }} className="btn btn-dark mr-0 ml-auto">{projectIdOld.is_aborted === 0 ? 'ยกเลิกโปรเจค' : 'ใช้งานโปรเจค'}</button>
                                    <button type="button" onClick={(e) => { if (window.confirm('คุณต้องการที่จะลบโปรเจคนี้หรือไม่?')) this.handleDelete(e) }} className="btn btn-danger ml-1">ลบโปรเจค</button>
                                </div>
                                <div className="form-group">
                                    <h4>ชื่อโปรเจค</h4>
                                    <input type="text" className="form-control" id="exampleInputEmail1" onChange={this.handleChangeName} aria-describedby="emailHelp" defaultValue={this.checkNanData(projectIdOld.name_th)} />
                                </div>
                                <div className="form-group">
                                    <h4>รายละอียดโปรเจค</h4>
                                    <input type="text" className="form-control" id="exampleInputPassword1" onChange={this.handleChangeDescription} defaultValue={this.checkNanData(projectIdOld.description)} />
                                </div>
                                <div className="form-group">
                                    <h4>มูลค่างาน</h4>
                                    <NumberFormat className="form-control" onChange={this.handleChangeValue} thousandSeparator={true} defaultValue={projectIdOld.value} />
                                </div>
                                <div className="form-group">
                                    <h4>สัญญาเลขที่</h4>
                                    <input type="text" className="form-control" id="exampleInputPassword1" onChange={this.handleChangeContractIdName} defaultValue={this.checkNanData(projectIdOld.contract_id)} />
                                </div>
                                <div className="form-group">
                                    <h4>กำหนดส่งงาน</h4>
                                    <input type="date" className="form-control" defaultValue={this.checkNullDate(projectIdOld.end_contract_date)} onChange={this.handleChangeEndContractDate} />
                                </div>
                                <div className="form-group">
                                    <h4>กำหนดการวางบิล</h4>
                                    <select className="form-control" onChange={this.handleChangeBillingConfigurationsId}>
                                        {this.state.bills.map(function (bill) {
                                            if (projectIdOld.billing_configuration_id === bill.id) return <option value={bill.id} selected>{bill.description}</option>;
                                            return <option value={bill.id}>{bill.type}</option>;
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <h4>หมวดหมู่งาน</h4>
                                    <select className="form-control " onChange={this.handleChangeProjectCategories}>
                                        {this.state.proCategories.map(function (proCategory) {
                                            if (projectIdOld.project_category_id === proCategory.id) return <option value={proCategory.id} selected>{proCategory.type}</option>;
                                            return <option value={proCategory.id}>{proCategory.type}</option>;
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <h4>ลูกค้า</h4>
                                    <select className="form-control " onChange={this.handleChangeCustomerId}>
                                        {this.state.customers.map(function (customer) {
                                            if (projectIdOld.customer_id === customer.id) return <option value={customer.id} selected>{customer.name} Public Company Limited ({customer.name})</option>;
                                            return <option value={customer.id}>{customer.name} Public Company Limited ({customer.name})</option>;
                                        })}
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary mb-5" style={{ width: "100%", fontSize: "1.3em", color: "white" }}>แก้ไขโปรเจค</button>
                            </form>
                        </div>
                    </>
                ))}
            </div>
        )
    }

}

export default EditProject;
