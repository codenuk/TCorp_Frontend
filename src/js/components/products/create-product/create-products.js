import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'

import '../../../../vendor/bootstrapv2/bootstrap.css';
import '../../../../css/adjust_bootstrap.css';
import '../../../../vendor/fontawesome-free/css/all.css';
import '../../../../css/mystyles.css';

import { API_URL_DATABASE } from '../../../config_database.js';

class ComponentCreateProduct extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            suppliers: [],
            product_categories: [],
            allProductName: [],
            indexOfItem: -1,
            isFinish: false,

            //POST PRODUCT
            tcorp_id: '',
            description: '',
            product_category_id: '',
            supplier_id: '',
            child_products: []
        }

        this.createNewRowByButton = this.createNewRowByButton.bind(this);
        this.handleDeleteChildProduct = this.handleDeleteChildProduct.bind(this);
        this.filterProducts = this.filterProducts.bind(this);
        this.checkName = this.checkName.bind(this);
        this.buttonSubmit = this.buttonSubmit.bind(this);
    }

    handleChangeProductId = event => {
        var a = this.state.allProductName.indexOf(event.target.value);
        console.log("Hello filter >>>>", a)
        this.setState({ indexOfItem: a })
        if(event.target.value.length <= 45 && a === -1){
            this.setState({ tcorp_id: event.target.value });
        }
    }

    handleChangeDescription = event => {
        if(event.target.value.length <= 45){
            this.setState({ description: event.target.value });
            console.log("description", this.state.description)
        }
    }

    handleChangeCategoryId = event => {
        this.setState({ product_category_id: event.target.value });
    }

    handleChangeSupplierId = event => {
        this.setState({ supplier_id: event.target.value });
    }

    handleChangeChildProducts = event => {
        this.setState({ child_products: event.target.value });
    }

    handleChangeId = event => {
        var current = this;

        console.log(`check input valur ${event.target.value}`)
        this.state.products.map(function(products){
            if(event.target.value === products.tcorp_id && event.target.value.length <= 100){
                console.log(`check chile product id ${products}`)
                current.state.child_products[event.target.parentNode.parentNode.id].id = products.id;
                current.state.child_products[event.target.parentNode.parentNode.id].description = products.description;
                current.setState({ child_products: current.state.child_products});
            };
        });
    }

    handleChangeQuility = event => {
        if(event.target.value <= 9999999){
            this.state.child_products[event.target.parentNode.parentNode.id].quantity = event.target.value;
            this.setState({ child_products: this.state.child_products });
        }
    }

    handleSubmit = event => {
        console.log("THIS HERE handleSubmit")
        event.preventDefault();

        this.state.child_products.map((child_products) => {
            delete child_products["description"];
        })
        
        console.log("check>>>>", this.state.child_products);
        const product = {
            "tcorp_id": this.state.tcorp_id,
            "description": this.state.description,
            "supplier_id": this.state.supplier_id,
            "product_category_id": this.state.product_category_id,
            "child_products": this.state.child_products
        };
        console.log("product", product)

        axios.post(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/products`, product, { headers: { "x-access-token": localStorage.getItem('token_auth') } })
            .then(res => {
                // console.log(res);
                this.setState({ isFinish: true });
                // this.setState({isTokenValid: true});
            }).catch(function (err) {
                console.log(err);
                // this.setState({isTokenValid: false});
            })
    }

    componentDidMount() {
        var token_auth = localStorage.getItem('token_auth');
        var current = this;

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/products`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const products = res.data;
                console.log(products)
                this.setState({ products: products, isTokenValid: true });
                this.filterProducts()
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/product_categories`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const product_categories = res.data;
                // console.log(projects.length)
                this.setState({ product_categories: product_categories, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/suppliers`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const suppliers = res.data;
                // console.log(projects.length)
                this.setState({ suppliers: suppliers, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            })
    }

    filterProducts(){
        var allProductName = []
        this.state.products.map(function(products){
            allProductName.push(products.tcorp_id);
        })
        this.setState({ allProductName: allProductName})
        console.log("hello filter", this.state.allProductName)
    }

    checkName(){
        console.log("indexOfItem", this.state.indexOfItem)
        if (this.state.indexOfItem !== -1){
            return <label className="ml-2 mt-2" style={{color: "#ff6666"}}>รหัสสินค้าซ้ำ</label>
        }
    }

    buttonSubmit(){
        if (this.state.indexOfItem !== -1){
            return <button type="button" className="btn btn-warning px-4">เพิ่มสินค้า</button>
        }
        return <button type="submit" className="btn btn-warning px-4">เพิ่มสินค้า</button>

    }

    isHavingNewRow(child_products) {
        if (child_products[child_products.length - 1].id === "") {
            return true;
        }
        return false;
    }

    createNewRowByButton() {
        this.state.child_products.push({
            'id': '',
            'description': '',
            'quantity': ''
        });
        this.setState({ child_products: this.state.child_products });
    }

    handleDeleteChildProduct(event) {
        console.log(event.target.parentNode.parentNode);
        this.state.child_products.splice(event.target.parentNode.parentNode.id, 1);
        this.setState({ child_products: this.state.child_products });
    }

    render() {
        var current = this;
        if (this.state.isFinish === true) {
            return <Redirect to='/products' />
        }
        console.log(">>>>>>>>>>>>>>>", this.state.child_products);
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <h3 className="d-inline">สินค้า</h3>
                        </div>
                    </div>
                    <div className="Createproducts">
                        <div className="card-header">
                            <h4>เพิ่มสินค้า:</h4>
                        </div>
                        <div className="card-body p-4">
                            <div className="form-group row">
                                <label for="staticEmail" className="col-sm-2 col-form-label-lg">รหัสสินค้า</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" onChange={this.handleChangeProductId} required />
                                    {current.checkName()}
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="inputPassword" className="col-sm-2 col-form-label-lg">รายละเอียดสินค้า</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" onChange={this.handleChangeDescription} required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="inputPassword" className="col-sm-2 col-form-label-lg">หมวดหมู่สินค้า</label>
                                <div className="col-sm-10">
                                    <select className="form-control" onChange={this.handleChangeCategoryId} required>
                                        <option value=''>None</option>
                                        {this.state.product_categories.map(function (product_categories) {
                                            return (
                                                <option value={product_categories.id}>{product_categories.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="inputPassword" className="col-sm-2 col-form-label-lg">ยี่ห้อ</label>
                                <div className="col-sm-10">
                                    <select className="form-control" onChange={this.handleChangeSupplierId} required>
                                        <option value=''>None</option>
                                        {this.state.suppliers.map(function (suppliers) {
                                            return (
                                                <option value={suppliers.id}>{suppliers.company_name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-4">
                        <h4 className="mr-4">สินค้าที่เกี่ยวข้อง</h4>
                        <button type="button" onClick={this.createNewRowByButton} className="btn btn-primary">เพิ่มสินค้่าที่เกี่ยวข้อง</button>
                    </div>
                    <div className="row">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>รหัสสินค้า</th>
                                    <th>รายละเอียด</th>
                                    <th>จำนวนชิ้น</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.child_products.map((child_products, index) => (
                                    <tr key={index} id={index}>
                                        <td>
                                            <input class="form-control" type="text" placeholder="รหัสสินค้า" onChange={this.handleChangeId} list="product" required/>
                                            <datalist id="product">
                                                {current.state.products.filter(function(product){
                                                    for (var product_show of current.state.child_products){
                                                        if (product.id === product_show.id) {
                                                            return false;
                                                        }
                                                    }
                                                    console.log("ture")
                                                    return true;
                                                }, current)
                                                .map(function (filtered_product){
                                                    return(
                                                    <option value={filtered_product.tcorp_id}></option>
                                                )})}
                                            </datalist>
                                        </td>
                                        <td>
                                            {child_products.description}
                                        </td>
                                        <td><input class="form-control" type="number" placeholder="จำนวน" value={this.state.child_products[index].quantity} onChange={this.handleChangeQuility} required/></td>
                                        <td>
                                            <Link to="#" className="btn btn-danger" onClick={this.handleDeleteChildProduct}>ลบ</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-right mb-5 mr-1 ml-auto">
                        {current.buttonSubmit()}
                    </div>
                </form>
            </div>
        )
    };
}

export default ComponentCreateProduct;
