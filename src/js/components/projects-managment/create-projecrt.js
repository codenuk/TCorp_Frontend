import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'

class FrontEnd extends React.Component {

    state = {
        customers: [],
        proCategories: [],
        bills: [],
        isTokenValid: false,
        isFinish: false,

        //Post Data
        name_th: "",
        description: "",
        tcorp_id: "",
        value: "",
        contract_id: "",
        end_contract_date: "",
        billing_configuration_id: '',
        project_category_id: '',
        customer_id: ''
    }

    handleChangeName = event => {
        this.setState({ name_th: event.target.value });
    }

    handleChangeDescription = event => {
        this.setState({ description: event.target.value });
    }

    handleChangeTcorpId = event => {
        this.setState({ tcorp_id: event.target.value });
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
            "tcorp_id": this.state.tcorp_id,
            "value": this.state.value,
            "contract_id": this.state.contract_id,
            "end_contract_date": this.state.end_contract_date,
            "billing_configuration_id": this.state.billing_configuration_id,
            "project_category_id": this.state.project_category_id,
            "customer_id": this.state.customer_id
        };
        console.log("project", project)

        axios.post(`http://vanilla-erp.com:10000/api/v1/projects`, project, {headers: {"x-access-token": localStorage.getItem('token_auth')}})
            .then(res => {
                // console.log(res);
                this.setState({isFinish: true});
                this.setState({isTokenValid: true});
            }).catch(function(err) {
                console.log(err);
                this.setState({isTokenValid: false});
            })
        
    }

    componentDidMount() {
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        //token_auth = "asdasdasdasd";
        var current = this;

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
                console.log(res)
                const bills = res.data;
                // console.log(projects.length)
                this.setState({ bills: bills, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });
    }

    render() {
        if(this.state.isFinish === true){
            return <Redirect to='/project-overview' />
        }
        return (
            <div>

                <Link to="/project-overview"><i className="IconClosePage fas fa-times"></i></Link>
                <div className="container" style={{paddingTop: "50px", paddingRight: "15%"}}>
                <form onSubmit={this.handleSubmit}>
                        <h1>สร้างรายละเอียดโปรเจค</h1>
                        <div className="form-group">
                            <h4>ชื่อโปรเจค</h4>
                            <input type="text" className="form-control" onChange={this.handleChangeName} aria-describedby="emailHelp" placeholder="ความยาวไม่เกิน 20 ตัวอักษร" required/>
                        </div>
                        <div className="form-group">
                            <h4>รายละอียดโปรเจค</h4>
                            <input type="text" className="form-control" onChange={this.handleChangeDescription} placeholder="ความยาวไม่เกิน 1024 ตัวอักษร" />
                        </div>
                        <div className="form-group">
                            <h4>รหัสโปรเจค</h4>
                            <input type="text" className="form-control" onChange={this.handleChangeTcorpId} placeholder="TXXXXX" required/>
                        </div>
                        <div className="form-group">
                            <h4>มูลค่างาน</h4>
                            <input type="number" className="form-control" onChange={this.handleChangeValue} placeholder="XXX,XXX,XXX" />
                        </div>
                        <div className="form-group">
                            <h4>สัญญาเลขที่</h4>
                            <input type="text" className="form-control" onChange={this.handleChangeContractIdName} placeholder="XXXXXX" />
                        </div>
                        <div className="form-group">
                            <h4>กำหนดส่งงาน</h4>
                            <input type="date" className="form-control"  onChange={this.handleChangeEndContractDate}/>
                        </div>
                        <div className="form-group">
                            <h4>กำหนดการวางบิล</h4>
                            <select className="form-control"  onChange={this.handleChangeBillingConfigurationsId} required>
                                <option value=''>None</option>
                                {this.state.bills.map(function (bill) {
                                    return (
                                        <option value={bill.id}>{bill.description}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <h4>หมวดหมู่งาน</h4>
                            <select className="form-control " onChange={this.handleChangeProjectCategories} required>
                                <option value=''>None</option>
                                {this.state.proCategories.map(function (proCategory) {
                                    return (
                                        <option value={proCategory.id}>{proCategory.type}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <h4>ลูกค้า</h4>
                            <select className="form-control "  onChange={this.handleChangeCustomerId} required>
                                <option value=''>None</option>
                                {this.state.customers.map(function (customer) {
                                    return (
                                        <option value={customer.id}>{customer.name} Public Company Limited ({customer.name})</option>
                                    )
                                })}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary mb-5" style={{ width: "100%", fontSize: "1.3em", color: "white" }}>สร้างโปรเจค</button>
                    </form>
                </div>
            </div>

        );
    }

}

export default FrontEnd;