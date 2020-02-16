import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'

class EditProject extends React.Component {

    state = {
        projectIdOlds: [],
        customers: [],
        proCategories: [],
        bills: [],
        isTokenValid: false,
        isFinish: false,

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
        this.setState({ name_th: event.target.value });
    }

    handleChangeDescription = event => {
        this.setState({ description: event.target.value });
    }

    handleChangeValue = event => {
        this.setState({ value: event.target.value });
    }

    handleChangeContractIdName = event => {
        this.setState({ contract_id: event.target.value });
    }

    handleChangeEndContractDate = event => {
        this.setState({ end_contract_date: event.target.value });
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

    handleSubmit = event => {
        event.preventDefault();
        console.log("handleSubmit")

        const project = {
            "name_th": this.state.name_th,
            "description": this.state.description,
            "value": this.state.value,
            "contract_id": this.state.contract_id,
            "end_contract_date": this.state.end_contract_date,
            "billing_configuration_id": this.state.billing_configuration_id,
            "project_category_id": this.state.project_category_id,
            "customer_id": this.state.customer_id
        };
        console.log("project", project)

        axios.put(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.match.params.tcorp_id}`, project, { headers: { "x-access-token": localStorage.getItem('token_auth') } })
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

        axios.get(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.match.params.tcorp_id}    
        `, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const projectIdOlds = res.data;
                this.setState({
                    projectIdOlds: projectIdOlds,
                    isTokenValid: true,
                    
                    name_th: projectIdOlds[0].name_th,
                    description: projectIdOlds[0].description,
                    value: projectIdOlds[0].value,
                    contract_id: projectIdOlds[0].contract_id,
                    end_contract_date: projectIdOlds[0].end_contract_date,
                    billing_configuration_id: projectIdOlds[0].billing_configuration_id,
                    project_category_id: projectIdOlds[0].project_category_id,
                    customer_id: projectIdOlds[0].customer_id,
                });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:10000/api/v1/customers`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const customers = res.data;
                // console.log(projects.length)
                this.setState({ customers: customers, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:10000/api/v1/project_categories`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const proCategories = res.data;
                // console.log(projects.length)
                this.setState({ proCategories: proCategories, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:10000/api/v1/billing_configurations`, { headers: { 'x-access-token': token_auth } })
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

    checkNanData(data) {
        if (data === "") {
            var na = "N/A";
            return na;
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
        return (
            <div>
                {this.state.projectIdOlds.map((projectIdOld) => (
                    <>
                        <Link to={`/project-task/${projectIdOld.tcorp_id}`}><i className="IconClosePage fas fa-times"></i></Link>
                        <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }} >
                            <form onSubmit={this.handleSubmit}>
                                <h1>แก้ไขรายละเอียดโปรเจคที่: {projectIdOld.tcorp_id}</h1>
                                <div className="form-group">
                                    <h4>ชื่อโปรเจค</h4>
                                    <input type="text" className="form-control" id="exampleInputEmail1" onChange={this.handleChangeName} aria-describedby="emailHelp" placeholder={this.checkNanData(projectIdOld.name_th)} />
                                </div>
                                <div className="form-group">
                                    <h4>รายละอียดโปรเจค</h4>
                                    <input type="text" className="form-control" id="exampleInputPassword1" onChange={this.handleChangeDescription} placeholder={this.checkNanData(projectIdOld.description)} />
                                </div>
                                <div className="form-group">
                                    <h4>มูลค่างาน</h4>
                                    <input type="number" className="form-control" id="exampleInputPassword1" onChange={this.handleChangeValue} placeholder={this.checkNanData(projectIdOld.value)} />
                                </div>
                                <div className="form-group">
                                    <h4>สัญญาเลขที่</h4>
                                    <input type="text" className="form-control" id="exampleInputPassword1" onChange={this.handleChangeContractIdName} placeholder={this.checkNanData(projectIdOld.contract_id)} />
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