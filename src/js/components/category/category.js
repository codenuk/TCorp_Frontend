import React from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom'

import '../../../css/_list_Category.css';

import { API_URL_DATABASE } from '../../config_database.js';

class ListCategory extends React.Component {

    // Define State and Props
    constructor(props) {
        super(props);
        this.state = {
            category: [],
            filter_name: [],
            indexOfItem: -1,
            isTokenValid: true,
            isFinish: false,

            //EDITE CATEGORY
            name: '',
            description: ''
        }

        this.onAddItem = this.onAddItem.bind(this);
        this.generateListCategory = this.generateListCategory.bind(this);
        this.generateListCategoryRow = this.generateListCategoryRow.bind(this);
        this.filterCategory = this.filterCategory.bind(this);
        this.checkName = this.checkName.bind(this);
        this.buttonSubmit = this.buttonSubmit.bind(this);
    }

    handleChangeName = event => {
        var current = this;
        var a = this.state.filter_name.indexOf(event.target.value);
        console.log("Hello filter >>>>", a)
        this.setState({ indexOfItem: a })
        if(event.target.value.length <= 45 && a === -1){
            current.setState({ name: event.target.value });
        }
    }

    handleChangeDescription = event => {
        if(event.target.value.length <= 45){
            this.setState({ description: event.target.value });
        }
    }

    handleSubmit = event => {
        event.preventDefault();

        const postCategory = {
            "name": this.state.name,
            "description": this.state.description
        };
        console.log("postCategory", postCategory)

        axios.post(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/product_categories`, postCategory, { headers: { "x-access-token": localStorage.getItem('token_auth') } })
            .then(res => {
                // console.log(res);
                this.setState({ isFinish: true });
                window.location.reload();
                // this.setState({isTokenValid: true});
            }).catch(function (err) {
                console.log(err);
                // this.setState({isTokenValid: false});
            })

    }

    componentDidMount() {
        var token_auth = localStorage.getItem('token_auth');
        var current = this;

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/product_categories`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log("category", res)
                const category = res.data;
                this.setState({
                    category: category,
                    isTokenValid: true
                });
                current.filterCategory();

            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });
    }

    filterCategory(){
        var filter_name = []
        this.state.category.map(function(category){
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
            return <button type="button" className="btn btn-warning px-4">เพิ่มหมวดหมู่สินค้า</button>
        }
        return <button type="submit" className="btn btn-warning px-4">เพิ่มหมวดหมู่สินค้า</button>
    }

    onAddItem(event) {
        console.log("onAddItem", event.target.id)
    }

    generateListCategoryRow() {
        return (
            <>
                <li class="list-group-item list-group-item-action border-0" key={'Cras justo odio'} id={'Cras justo odio'} onClick={this.onAddItem}>Cras justo odio</li>
            </>
        )
    }

    generateListCategory(layerCategory) {
        let listCategory = []
        console.log("=== generateListCategory: listCategory=", listCategory, "layerCategory=", layerCategory)
        listCategory.push(this.generateListCategoryRow())

        return listCategory;
    }

    render() {
        if (!this.state.isTokenValid) {
            return <Redirect to='/' />
        }
        return (
            <div>

                <div className="Createproducts">
                    <div className="card-header">
                        <h4>เพิ่มหมวดหมู่สินค้า:</h4>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="card-body p-4">
                            <div className="form-group row">
                                <label for="staticEmail" className="col-sm-2 col-form-label-lg">หมวดหมู่</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" onChange={this.handleChangeName} required />
                                    {this.checkName()}
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="inputPassword" className="col-sm-2 col-form-label-lg">รายละเอียดหมวดหมู่</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" onChange={this.handleChangeDescription} required />
                                </div>
                            </div>
                            <div className="form-group row float-right">
                                <div className="col-lg-12">
                                    {this.buttonSubmit()}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row mt-5">
                    <table className="table">
                        <thead>
                            <tr style={{fontSize: "1.3rem"}}>
                                <th>หมวดหมู่สินค้า</th>
                                <th>รายละเอียด</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.category.map((category) => (
                                <>
                                    <tr key={category.id} id={category.id}>
                                        <td>{category.name}</td>
                                        <td>{category.description}</td>
                                        <td>
                                            <Link to={`/edit-category/${category.id}`} className="btn btn-warning ">แก้ไข</Link>
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                        <div className="mb-4"></div>
                    </table>
                </div>

            </div>
        );
    }
}

export default ListCategory;