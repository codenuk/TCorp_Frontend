import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

import '../../../vendor/bootstrapv2/bootstrap.css';
import '../../../css/adjust_bootstrap.css';
import '../../../vendor/fontawesome-free/css/all.css';

import { API_URL_DATABASE } from '../../config_database.js';

class ComponentListProduct extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            products_show: [],
            filterProductID: '',
            filterProductDesc: '',
            isTokenValid: true,
            checkDelete: false
        }

        this.handleChangeFilterProductID = this.handleChangeFilterProductID.bind(this);
        this.handleChangeFilterProductDesc = this.handleChangeFilterProductDesc.bind(this);
    }

    handleChangeFilterProductID(event) {
        this.setState({
            products_show: this.state.products.filter(function (product) {
                console.log(product.tcorp_id);
                const regex = new RegExp(`${event.target.value}`, 'i');
                var isMatch = regex.test(product.tcorp_id);
                console.log(regex.lastIndex);
                return (isMatch);
            }),
            filterProductID: event.target.value
        });
    }

    handleChangeFilterProductDesc(event) {
        this.setState({
            products_show: this.state.products.filter(function (product) {
                console.log(product.description);
                const regex = new RegExp(`${event.target.value}`, 'i');
                var isMatch = regex.test(product.description);
                console.log(regex.lastIndex);
                return (isMatch);
            }),

            filterProductDesc: event.target.value
        });
    }

    componentDidMount() {
        // console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var current = this;
        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/products`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const products = res.data;
                // console.log(persons.length)
                this.setState({ products: products, products_show: products, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });
    }

    checkData(data) {
        if (data === null) {
            var nanData = "N/A";
            return nanData;
        }
        var cutString = data.slice(0, 70);
        return cutString;
    }

    render() {
        var current = this;
        return (
            <>
                <div className="row mb-3">
                    <div className="">
                        <input class="form-control" type="text" placeholder="ค้นหารหัส" value={this.state.filterProductID} onChange={this.handleChangeFilterProductID} />
                    </div>
                    <div className="">
                        <input class="form-control" type="text" placeholder="ค้นหารายละเอียด" value={this.state.filterProductDesc} onChange={this.handleChangeFilterProductDesc} />
                    </div>
                    <div className=" mr-0 ml-auto">
                        <Link to="/create-product"><button type="button" class="btn btn-secondary">เพิ่มสินค้า</button></Link>
                        <Link to="/category" className='text-white-50'><button type="button" class="btn btn-secondary ml-1">หมวดหมู่สินค้่า</button></Link>
                    </div>
                </div>
                <div className="row">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>รหัสสินค้า</th>
                                <th>รายละเอียด</th>
                                <th>หมวดหมู่สินค้า</th>
                                <th>ยี่ห้อ</th>
                                <th>ดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current.state.products_show.map((products) => (
                                <tr key={products.tcorp_id} id={products.tcorp_id}>
                                    <td> </td>
                                    <td> {products.tcorp_id} </td>
                                    <td> {current.checkData(products.description)} </td>
                                    <td> {products.category_name} </td>
                                    <td> {products.supplier_name}</td>
                                    <td>
                                        <Link to={`/edit-product/${products.tcorp_id}`} className="btn btn-warning ml-1">แก้ไข</Link>
                                    </td>
                                </tr>
                            ))}
                            <div className="mb-5"></div>
                        </tbody>
                    </table>
                </div>
            </>
        )
    };
}

export default ComponentListProduct;
