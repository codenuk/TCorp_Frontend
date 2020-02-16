import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'

import '../../../css/_list_Category.css';

import { API_URL_DATABASE } from '../../config_database.js';

class EditCategory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allCategory : [],
            category: [],
            filter_name: [],
            indexOfItem: -1,

            // EDIT CATEGORTY
            name: '',
            description: '',
            isFinish: false,
            isTokenValid: true
        }

        this.filterCategory = this.filterCategory.bind(this);
        this.checkName = this.checkName.bind(this);
        this.buttonSubmit = this.buttonSubmit.bind(this);
    }

    handleChangeName = event => {
        var current = this;
        var a = this.state.filter_name.indexOf(event.target.value);
        console.log("Hello filter >>>>", a)
        this.setState({ indexOfItem: a })
        if (event.target.value.length <= 45 && a === -1) {
            this.setState({ name: event.target.value });
        }
    }

    handleChangeDescription = event => {
        if (event.target.value.length <= 45) {
            this.setState({ description: event.target.value });
        }
    }

    handleSubmit = event => {
        event.preventDefault();

        const editCategory = {
            "name": this.state.name,
            "description": this.state.description
        };
        console.log("editCategory", editCategory)

        axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/product_categories/${this.props.match.params.product_category_id}`, editCategory, { headers: { "x-access-token": localStorage.getItem('token_auth') } })
            .then(res => {
                // console.log(res);
                this.setState({ isFinish: true });
            }).catch(function (err) {
                console.log(err);
            })

    }

    componentDidMount() {
        var token_auth = localStorage.getItem('token_auth');
        var current = this;
        // console.log(`This is product_id: ${JSON.stringify(this.props.match.params.product_category_id)}`);

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/product_categories/${this.props.match.params.product_category_id}    
        `, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log("category", res)
                const category = res.data;
                this.setState({
                    category: category,
                    isTokenValid: true,

                    name: category[0].name,
                    description: category[0].description
                });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/product_categories`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log("category", res)
                const allCategory = res.data;
                this.setState({
                    allCategory: allCategory,
                    isTokenValid: true
                });
                current.filterCategory();

            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });
    }

    handleDelete = event => {
        console.log("delete here", event.target.parentNode.parentNode)
        console.log("delete here ID", event.target.parentNode.parentNode.id)
        var token_auth = localStorage.getItem('token_auth');
        console.log("check token ", token_auth)
        axios.delete(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/product_categories/${this.props.match.params.product_category_id}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ isFinish: true });
            })
    }

    filterCategory(){
        var filter_name = []
        this.state.allCategory.map(function(category){
            filter_name.push(category.name);
        })
        this.setState({ filter_name: filter_name})
        // console.log("hello filter", this.state.filter_name)
    }

    checkName(){
        console.log("indexOfItem", this.state.indexOfItem)
        if (this.state.indexOfItem !== -1){
            return <label className="ml-2 mt-2" style={{color: "#ff6666"}}>รหัสสินค้าซ้ำ</label>
        }
    }

    buttonSubmit(){
        if (this.state.indexOfItem !== -1){
            return <button type="button" className="btn btn-primary mb-5" style={{ width: "100%", fontSize: "1.3em", color: "white" }}>ยืนยัน</button>
        }
        return <button type="submit" className="btn btn-primary mb-5" style={{ width: "100%", fontSize: "1.3em", color: "white" }}>ยืนยัน</button>

    }

    render() {
        if (this.state.isFinish === true) {
            return <Redirect to='/category' />
        }
        if (!this.state.isTokenValid) {
            return <Redirect to='/' />
        }
        return (
            <div>
                {this.state.category.map((category) => (
                    <>
                        <Link to="/category"><i className="IconClosePage fas fa-times"></i></Link>
                        <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }}>
                            <form onSubmit={this.handleSubmit}>
                                <h1>แก้ไขหมวดหมู่สินค้า</h1>
                                <div className="row">
                                    <Link onClick={(e) => { if (window.confirm('คุณต้องการลบสินค้าหรือไม่?')) this.handleDelete(e) }} className="btn btn-danger ml-auto mr-0">ลบ</Link>
                                </div>
                                <div className="form-group">
                                    <h4>หมวดหมู่</h4>
                                    <input type="text" className="form-control" onChange={this.handleChangeName} defaultValue={category.name} />
                                    {this.checkName()}
                                </div>
                                <div className="form-group">
                                    <h4>รายละเอียดหมวดหมู่สินค้า</h4>
                                    <input type="text" className="form-control" onChange={this.handleChangeDescription} defaultValue={category.description} />
                                </div>
                                {this.buttonSubmit()}
                            </form>
                        </div>
                    </>
                ))}
            </div>
        );
    }
}

export default EditCategory;