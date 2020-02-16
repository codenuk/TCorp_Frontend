import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'

import { API_URL_DATABASE } from '../../config_database.js';

class EditProduct extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            product: [],
            product_categories: [],
            suppliers: [],
            allProducts: [],
            // id: '',

            //EDITE PRODUCT
            tcorp_id: '',
            description: '',
            product_category_id: '',
            supplier_id: '',
            child_products: [],

            isFinish: false,

            allProductName: [],
            indexOfItem: -1
        }
        this.onDeleteChildProduct = this.onDeleteChildProduct.bind(this);
        this.generateChildProducts = this.generateChildProducts.bind(this);
        this.createNewRowByButton = this.createNewRowByButton.bind(this);
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
            this.setState({ description: event.target.value })
        };
    }

    handleChangeCategoryId = event => {
        this.setState({ product_category_id: event.target.value });
    }

    handleChangeSupplierId = event => {
        this.setState({ supplier_id: event.target.value });
    }

    handleChangeId = event => {
        var current = this;

        this.state.allProducts.map(function(allProducts){
            if(event.target.value === allProducts.tcorp_id && event.target.value.length <= 100){
                // console.log(`check chile product id ${allProducts.id}`)
                current.state.child_products[event.target.parentNode.parentNode.id].id = allProducts.id;
                current.state.product[event.target.parentNode.parentNode.id].child_description = allProducts.description;
                current.setState({ child_products: current.state.child_products, product: current.state.product});
                // console.log("check update description", current.state.child_products)
            };
            return null;
        });
        return null;
    }

    handleChangeQuility = event => {
        if(event.target.value <= 9999999){
            this.state.child_products[event.target.parentNode.parentNode.id].quantity = event.target.value;
            this.setState({ child_products: this.state.child_products });
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        // console.log(">>>>", this.state.child_products.length)
        if (this.state.child_products.length === 0) {
            const editProduct = {
                "tcorp_id": this.state.tcorp_id,
                "description": this.state.description,
                "supplier_id": this.state.supplier_id,
                "product_category_id": this.state.product_category_id,
                "child_products": []
            };
            console.log("editProduct", editProduct)

            axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/products/${this.props.match.params.product_id}`, editProduct, { headers: { "x-access-token": localStorage.getItem('token_auth') } })
                .then(res => {
                    // console.log(res);
                    this.setState({ isFinish: true });
                    // this.setState({isTokenValid: true});
                }).catch(function (err) {
                    console.log(err);
                    // this.setState({isTokenValid: false});
                })
            return null;
        }

        const editProduct = {
            "tcorp_id": this.state.tcorp_id,
            "description": this.state.description,
            "supplier_id": this.state.supplier_id,
            "product_category_id": this.state.product_category_id,
            "child_products": this.state.child_products
        };
        console.log("editProduct", editProduct)

        axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/products/${this.props.match.params.product_id}`, editProduct, { headers: { "x-access-token": localStorage.getItem('token_auth') } })
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
                console.log(res)
                const allProducts = res.data;
                // console.log(persons.length)
                this.setState({ allProducts: allProducts, isTokenValid: true });
                this.filterProducts()
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/products/${this.props.match.params.product_id}    
        `, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log("product", res)
                const product = res.data;
                // console.log("product child_product_id ###", product[0]['child_product_id'])
                // console.log("product quantity ###", product[0]['quantity'])

                var child_product = []
                product.map(function(product_idx, index) {
                    // console.log("map product", product, "index", index)
                    if (product_idx['child_product_id'] !== null) {
                        child_product.push({
                            'id': product_idx['child_product_id'],
                            'quantity': product_idx['quantity']
                        })
                    }
                    
                })

                // console.log("product child_product ###", child_product)
                this.setState({
                    product: product,
                    isTokenValid: true,

                    // id: product[0].id,
                    tcorp_id: product[0].tcorp_id,
                    description: product[0].description,
                    product_category_id: product[0].product_category_id,
                    supplier_id: product[0].supplier_id,
                    child_products: child_product,
                });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/product_categories`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log("product_categories",res)
                const product_categories = res.data;
                // console.log(projects.length)
                this.setState({ product_categories: product_categories, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/suppliers`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log("suppliers",res)
                const suppliers = res.data;
                // console.log(projects.length)
                this.setState({ suppliers: suppliers, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        // Donut
        // console.log(">>> product_hierarchy",this.state.id) 
        // axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/products/product_hierarchy/${this.state.id}`, { headers: { 'x-access-token': token_auth } })
        //     .then(res => {
        //         console.log("product_hierarchy",res, this.state.id)
        //         // const suppliers = res.data;
        //         // console.log(projects.length)
        //         // this.setState({ suppliers: suppliers, isTokenValid: true });
        //     })
        //     .catch(function (err) {
        //         current.setState({ isTokenValid: false });
        //     });
    }

    onDeleteChildProduct(event) {
        // console.log("THIS HERE onDeleteChildProduct");
        // console.log("Delete index", event.target.parentNode.parentNode.id);
        // // Remove array at index on this.state.child_products
        // console.log(">>  this.state.child_products", this.state.child_products[event.target.parentNode.parentNode.id].id)

        if (event.target.parentNode.parentNode.id > -1) {
            // Delete Array by index
            this.state.child_products.splice(event.target.parentNode.parentNode.id, 1);
            this.state.product.splice(event.target.parentNode.parentNode.id, 1);
        }
        this.setState({
            product: this.state.product,
            child_products: this.state.child_products
        });
    }

    generateChildProductsRow(product, index) {
        // console.log("THIS is generateChildProductsRow >>", product)
        if (product.child_product_id === null) {
            return null;
        }
        return (
            
                <tr key={index} id={index}>
                    <td>
                        <input className="form-control" type="text" defaultValue={product.child_product_tcorp_id} onChange={this.handleChangeId} list="product" required/>
                        <datalist id="product">
                                {this.state.allProducts.filter(function(product){
                                    // console.log(">>>>>", this.state.product.id)
                                    for (var product_show of this.state.child_products){
                                        if (product.id === product_show.id || product.id === this.state.product[0].id) {
                                            return false;
                                        }
                                    }
                                    console.log("ture")
                                    return true;
                                }, this)
                                .map(function (filtered_product){
                                    return(
                                    <option value={filtered_product.tcorp_id}></option>
                                )})}
                        </datalist>
                    </td>
                    <td>
                        {product.child_description}
                    </td>
                    <td><input className="form-control" type="number" placeholder="จำนวน" defaultValue={product.quantity} onChange={this.handleChangeQuility} required/></td>
                    <td>
                        <Link className="btn btn-danger" onClick={(e) => { if (window.confirm('คุณต้องการลบสินค้าหรือไม่?')) this.onDeleteChildProduct(e) }}>ลบ</Link>
                    </td>
                </tr> 
        )
    }

    generateChildProducts() {
        let table = []
        var current = this;
        this.state.product.map(function (product, index) {
            table.push(current.generateChildProductsRow(product, index));
        });
        return table;
    }

    createNewRowByButton() {
        // If a product haven't child_products must update value in this index
        // console.log(">>> createNewRowByButton  ===", this.state.product[0].child_product_id)
        if (this.state.product.length === 1 && this.state.product[0].child_product_id === null) {
            // console.log(">>> this.state.product", this.state.product[0])
            this.state.product[0].child_product_id = '';
            this.state.product[0].child_product_tcorp_id = '';
            this.state.product[0].child_description = '';
            this.state.product[0].quantity = '';
        }
        else {
            this.state.product.push({
                'child_product_tcorp_id': '',
                'child_description': '',
                'quantity': ''
            });
        }

        // UPDATE State of Child Products
        this.state.child_products.push({
            'id': '',
            'quantity': ''
        });
        console.log(this.state.child_products);
        this.setState({ child_products: this.state.child_products, product: this.state.product });
    }

    //Delete Parent Product
    handleDelete = () => {
        var token_auth = localStorage.getItem('token_auth');
        
        axios.delete(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/products/${this.props.match.params.product_id}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ isFinish: true });
            })
    }

    filterProducts(){
        var allProductName = []
        this.state.allProducts.map(function(allProducts){
            allProductName.push(allProducts.tcorp_id);
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
            return <button type="button" className="btn btn-primary mb-5" style={{ width: "100%", fontSize: "1.3em", color: "white" }}>เพิ่มสินค้า</button>
        }
        return <button type="submit" className="btn btn-primary mb-5" style={{ width: "100%", fontSize: "1.3em", color: "white" }}>เพิ่มสินค้า</button>
    }

    render() {
        let current = this;
        if (this.state.isFinish === true) {
            return <Redirect to='/products' />
        }
        return (
            <div>
                <Link to="/products"><i className="IconClosePage fas fa-times"></i></Link>
                <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }}>
                    <form onSubmit={this.handleSubmit}>
                        <h1>แก้ไขสินค้า</h1>
                        <div className="row">
                            <Link onClick={(e) => { if (window.confirm('คุณต้องการลบสินค้าหรือไม่?')) current.handleDelete(e) }} className="btn btn-danger ml-auto mr-0">ลบ</Link>
                        </div>
                        <div className="form-group">
                            <h4>รหัสสินค้่า</h4>
                            <input type="text" className="form-control" onChange={current.handleChangeProductId} defaultValue={this.state.tcorp_id} />
                            {current.checkName()}
                        </div>
                        <div className="form-group">
                            <h4>รายละอียดสินค้า</h4>
                            <input type="text" className="form-control" onChange={current.handleChangeDescription} defaultValue={this.state.description} />
                        </div>
                        <div className="form-group">
                            <h4>หมวดหมู่สินค้า</h4>
                            <select className="form-control" onChange={current.handleChangeCategoryId} required>
                                {current.state.product_categories.map(function (product_categories) {
                                    if (current.state.product_category_id === product_categories.id) return <option value={product_categories.id} selected>{product_categories.name}</option>
                                    return <option value={product_categories.id}>{product_categories.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <h4>ยี่ห้อ</h4>
                            <select className="form-control" onChange={current.handleChangeSupplierId} required>
                                {current.state.suppliers.map(function (suppliers) {
                                    if (current.state.supplier_id === suppliers.id) return <option value={suppliers.id} selected>{suppliers.company_name}</option>
                                    return <option value={suppliers.id}>{suppliers.company_name}</option>
                                })}
                            </select>
                        </div>
                        <div className="form-group">
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
                                        {this.generateChildProducts()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {this.buttonSubmit()}
                    </form>
                </div>

            </div>

        );
    }
}

export default EditProduct;