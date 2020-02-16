import React from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import '../../../../css/boq_list.css'

import { API_URL_DATABASE } from '../../../config_database.js';

class ListBoq extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allProducts: [],
            allStatus: [],
            allListLocation: [],

            productsItemShow: [],
            locations: [],

            products: [],
            diff_location: [],
            user_infoes: [],
            history: [],
            role_id: '',
            isTokenValid: '',
            count: true,

            filter_product_id_for_duplication: [],
        }
        this.createNewRowByButton = this.createNewRowByButton.bind(this);
        this.createNewColumnByButton = this.createNewColumnByButton.bind(this);
        this.deleteColumnByButton = this.deleteColumnByButton.bind(this);
        this.checkLocation = this.checkLocation.bind(this);
        this.deleteRowByButton = this.deleteRowByButton.bind(this);
        this.checkLinkAddProduct = this.checkLinkAddProduct.bind(this);
        this.onChangeStockReceivedAt = this.onChangeStockReceivedAt.bind(this);
        this.onChangeQuality = this.onChangeQuality.bind(this);
        this.getHistory = this.getHistory.bind(this);
        this.filterProductIdForDuplication = this.filterProductIdForDuplication.bind(this);
    }

    getData(tcorp_id) {
        return new Promise((resolve, reject) => {
            var token_auth = localStorage.getItem('token_auth');
            // console.log(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/line_item/${tcorp_id}`);
            axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/line_item/${tcorp_id}`, { headers: { 'x-access-token': token_auth } })
                .then(res => {
                    // console.log("this is response", res);
                    var products = res.data;
                    // console.log("inside getdata, products: ", products);
                    resolve({ products: products });
                })
                .catch(reject);
        });
    }

    componentDidMount() {
        // console.log("HELLO WORLD ", this.props.tcorp_id);
        var current = this;
        this.getData(this.props.tcorp_id).then(function (data) {
            var products = data.products;
            current.setState({ products: products.row_product, locations: products.unique_location, isTokenValid: true });
            console.log("THIS IS FROM GET DATA Products row_product", current.state.products);
            console.log("THIS IS FROM GET DATA Products unique_location", current.state.locations);
        }).catch(function (err) {
            console.log(err);
            current.setState({ isTokenValid: false });
        });

        var token_auth = localStorage.getItem('token_auth');
        var decoded = jwt_decode(token_auth);
        var username = decoded.username;
        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/users/${username}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log("use info", res)
                const user_infoes = res.data;

                this.checkLocation();
                this.setState({ user_infoes: user_infoes, role_id: user_infoes[0].role_id });
            })
            .catch(function (err) {
                console.log(err)
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/products`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const allProducts = res.data;
                this.setState({ allProducts: allProducts, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });

        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/tasks_status/status_order`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log(res)
                const allStatus = res.data;
                // console.log(persons.length)
                this.setState({ allStatus: allStatus, isTokenValid: true });
            })
            .catch(function (err) {
                current.setState({ isTokenValid: false });
            });
    }

    checkLocation() {
        var prevLineItemID = -1;
        var current = this
        var productsItem = []
        var productItem = {}
        var count = 0
        this.state.products.map(function (product, index) {
            if (prevLineItemID !== product.line_item_id) {
                productItem = current.state.products[index];
                // console.log('check bug OUT', productItem);

                productItem.child_delivery_location_qty = new Array(current.state.locations.length).fill(0);
                current.state.locations.map(function (uniqueLocation, index) {
                    if (productItem.delivery_location_name === uniqueLocation.name && uniqueLocation.name !== null) {
                        productItem.child_delivery_location_qty[index] = product.qty;
                        // console.log('check bug IN', productItem);

                    }
                });

                productsItem.push(productItem);
                count += 1;

                // Update New prevLineItemID
                prevLineItemID = product.line_item_id;
            }
            else {
                current.state.locations.map(function (uniqueLocation, index) {
                    if (product.delivery_location_name === uniqueLocation.name) {
                        productsItem[count - 1].child_delivery_location_qty[index] = product.qty;
                    }
                });
            }
        });
        this.setState({ productsItemShow: productsItem })
        // console.log("productsItemShow", this.state.productsItemShow)
    }

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    //     taken from: Underscore.js https://underscorejs.org/#debounce
    debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    }

    createNewColumnByButton() {
        this.state.productsItemShow.map(function (each_location, index) {
            each_location.child_delivery_location_qty.push(
                0
            )
        })
        this.state.locations.push({
            'name': '',
            'tcorp_id': this.props.tcorp_id
        })

        this.setState({ productsItemShow: this.state.productsItemShow, locations: this.state.locations });

        var current = this;

        console.log("count productItemShow", this.state.productsItemShow)

        if (this.state.productsItemShow.length >= 1) {

            var listProductId = [];
            current.state.productsItemShow.map(function (product) {
                if (product.product_description !== "") {
                    listProductId.push(product.line_item_id);
                    console.log("work listProductId", product.line_item_id)
                }
                else {
                    console.log("out");
                }
            })
            console.log("listProductId", listProductId)
            const postLocation = {
                "name": "",
                "product_id": listProductId,
                "bill_of_quantity_id": current.props.boq_id
            };
            console.log("postLocation", postLocation)
            var token_auth = localStorage.getItem('token_auth');
            axios.post(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/delivery_location`, postLocation, { headers: { "x-access-token": token_auth } })
                .then(res => {
                    // console.log("line191", res);
                    current.state.locations[current.state.locations.length - 1].id = res.data.line_item_id;
                    current.setState({ products: current.state.products, locations: current.state.locations });
                    // console.log("debug id location", current.state.locations)
                }).catch(function (err) {
                    console.log(err);
                })
        }
        else {
            console.log("work else")
            const postLocation = {
                "name": "",
                "product_id": [],
                "bill_of_quantity_id": current.props.boq_id
            };
            var token_auth = localStorage.getItem('token_auth');
            axios.post(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/delivery_location`, postLocation, { headers: { "x-access-token": token_auth } })
                .then(res => {
                    // console.log(res);
                    current.state.locations[current.state.locations.length - 1].id = res.data.line_item_id;
                    current.setState({ products: current.state.products, locations: current.state.locations });
                    // console.log("debug id location", locations)

                }).catch(function (err) {
                    console.log(err);
                })
        }
    }

    createNewRowByButton() {
        this.state.productsItemShow.push({
            'product_tcorp_id': '',
            'product_description': '',
            'child_delivery_location_qty': new Array(this.state.locations.length).fill(0),
            'line_item_stock_qty': 0,
            'line_item_po_name': '',
            'line_item_received_at': '',
            'status_order_id': 1,
            'line_item_id': ''
        })
        this.setState({ productsItemShow: this.state.productsItemShow })
    }

    deleteRowByButton(event, productId) {
        console.log(`DELETE ROW PRODUCT ${event.target.parentNode.parentNode.id}`);
        console.log("BEFORE DELETE ROW By Button", this.state.productsItemShow[event.target.parentNode.parentNode.id]);
        if (event.target.parentNode.id > -1) {
            this.state.productsItemShow.splice(event.target.parentNode.parentNode.id, 1);
        }
        this.setState({ productsItemShow: this.state.productsItemShow });

        var current = this;
        this.state.allProducts.map(function (allProducts) {
            if (productId === allProducts.tcorp_id) {
                var token_auth = localStorage.getItem('token_auth');
                axios.delete(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/line_item/${current.props.tcorp_id}/${allProducts.id}`, { headers: { 'x-access-token': token_auth } })
                    .then(res => {
                        console.log(res);
                        console.log(res.data);
                        current.setState({ isFinish: true });
                    })
            }
        })
    }

    deleteEmptyRowByButton(event, productId) {
        console.log(`DELETE ROW PRODUCT ${event.target.parentNode.parentNode.id}`);
        console.log("BEFORE DELETE ROW By Button", this.state.productsItemShow[event.target.parentNode.parentNode.id]);
        if (event.target.parentNode.id > -1) {
            this.state.productsItemShow.splice(event.target.parentNode.parentNode.id, 1);
        }
        this.setState({ productsItemShow: this.state.productsItemShow });
    }

    deleteColumnByButton(event, locationId) {
        // console.log(`delete location at ${event.target.parentNode.id}`);
        if (event.target.parentNode.id > -1) {
            this.state.locations.splice(event.target.parentNode.id, 1);
        }
        // console.log("AFTER delete old Column By Button different location>>", this.state.locations);

        this.state.productsItemShow.map(function (each_product_location, index) {
            if (event.target.parentNode.id > -1) {
                each_product_location.child_delivery_location_qty.splice(event.target.parentNode.id, 1);
            }
        })
        // console.log("AFTER delete old Column By Button productsItemShow item show>>", this.state.productsItemShow);

        this.setState({ locations: this.state.locations, productsItemShow: this.state.productsItemShow });

        if (locationId !== undefined) {
            var token_auth = localStorage.getItem('token_auth');
            axios.delete(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/item_to_location/${locationId}/delivery_location_id`, { headers: { 'x-access-token': token_auth } })
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    this.setState({ isFinish: true });
                })
        }
    }

    onChangeLocation(value, index) {
        var current = this;
        // console.log("current.state.locations[index].id", current.state.locations[index].delivery_location_id)
        // console.log("locations", this.state.locations)
        if (current.state.locations[index].id !== undefined) {
            //     if (current.state.locations[index].name !== "") {
            current.state.locations[index].name = value;
            current.setState({ locations: current.state.locations })
            // console.log("check bug onChange location", current.state.locations)
            const editLocation = {
                "name": value
            };
            console.log("current.state.locations[index].id", current.state.locations[index].id)
            this.debounce(axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/delivery_location/${current.state.locations[index].id}`, editLocation,
                { headers: { 'x-access-token': localStorage.getItem('token_auth') } })
                .then(async res => {
                    current.setState({
                        locations: current.state.locations
                    });
                    // this.setState({ isFinish: true });
                }).catch(function (err) {
                    console.log(err);
                }), 1000);
        }
        else {
            // console.log("out")
            current.state.locations[index].name = value;
            current.setState({ locations: current.state.locations });
        }
    }

    onChangeQuality(value, index, inx, products) {
        if (products.line_item_id !== undefined && value <= 99999999) {
            console.log("I AM IN ThIS IS VALUIE ", value)
            this.state.productsItemShow[index].child_delivery_location_qty[inx] = value;
            console.log('check bug', this.state.productsItemShow[index]);

            this.setState({
                productsItemShow: this.state.productsItemShow
            });

            if (value == "") {
                value = 0;
            }

            const editQuality = {
                "qty": parseInt(value, 10)
            };
            var token_auth = localStorage.getItem('token_auth');
            axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/item_to_location/${products.line_item_id}/${this.state.locations[inx].id}/delivery_location_id`, editQuality, { headers: { "x-access-token": token_auth } })
                .then(res => {
                    // console.log(res);
                    this.setState({ productsItemShow: this.state.productsItemShow });
                }).catch(function (err) {
                    console.log(err);
                })
        }

    }

    onChangeStockQuality(value, index, productId) {
        var current = this;
        this.state.allProducts.map(function (allProducts) {
            if (productId === allProducts.tcorp_id && value <= 99999999) {
                // console.log(allProducts.id)
                current.state.productsItemShow[index].line_item_stock_qty = value;

                const editStockQuality = {
                    "stock_qty": parseInt(current.state.productsItemShow[index].line_item_stock_qty, 10)
                };
                // console.log("editStockQuality", editStockQuality)

                var token_auth = localStorage.getItem('token_auth');
                axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/line_item/${current.props.tcorp_id}/${allProducts.id}/stock_qty`, editStockQuality, { headers: { "x-access-token": token_auth } })
                    .then(res => {
                        // console.log(res);
                        current.setState({ productsItemShow: current.state.productsItemShow });
                    }).catch(function (err) {
                        console.log(err);
                    })
            }
        })
    }

    onChangeProduct(value, index, productDescription) {
        this.filterProductIdForDuplication();
        var current = this;
        var checkDuplication = this.state.filter_product_id_for_duplication.indexOf(value);

        console.log("Hello filter >>>>", checkDuplication)
        if (checkDuplication === -1){
            this.state.allProducts.map(function (checkAllProducts) {
                // console.log("nuk debug current.state.productsItemShow", current.state.productsItemShow.product_tcorp_id); 
                if (value === checkAllProducts.tcorp_id) {
                    // console.log(`post value ${value}`)
                    current.state.allProducts.map(function (allProducts) {
                        if (productDescription === allProducts.description) {
                            current.state.productsItemShow[index].product_tcorp_id = value;
                            current.state.productsItemShow[index].product_description = checkAllProducts.description;
                            current.setState({ productsItemShow: current.state.productsItemShow });
                            // console.log(current.state.productsItemShow[index].product_description);
                            const editProduct = {
                                "product_id": checkAllProducts.id
                            };
                            // console.log("editProduct", editProduct)

                            var token_auth = localStorage.getItem('token_auth');

                            axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/line_item/${current.props.tcorp_id}/${allProducts.id}/product_id`, editProduct, { headers: { "x-access-token": token_auth } })
                                .then(res => {
                                    // console.log("put finish", res);
                                    current.setState({ productsItemShow: current.state.productsItemShow });
                                }).catch(function (err) {
                                    console.log(err);
                                })

                            // ประวัติการแก้ไข
                            // const postHistory = {
                            //     "line_item_id": current.state.productsItemShow[index].line_item_id,
                            //     "firstname": current.state.user_infoes[0].firstname,
                            //     "lastname": current.state.user_infoes[0].lastname,
                            //     "role": current.state.user_infoes[0].name,
                            //     "user_id": current.state.user_infoes[0].username,
                            //     "product_tcorp_id": value
                            // };
                            // console.log("postHistory", postHistory)

                            // axios.post(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/log_boqs`, postHistory, { headers: { "x-access-token": token_auth } })
                            //     .then(res => {
                            //         console.log(res);
                            //     }).catch(function (err) {
                            //         console.log(err);
                            //     })
                        }
                        else {
                            current.state.productsItemShow[index].product_tcorp_id = value;
                            current.setState({ productsItemShow: current.state.productsItemShow });
                            // console.log("not math in array object IN")
                        }
                    })
                }
                if (value === checkAllProducts.tcorp_id && productDescription === "") {
                    // console.log(`post value ${value}`)
                    current.state.productsItemShow[index].product_tcorp_id = value;
                    current.state.productsItemShow[index].product_description = checkAllProducts.description;
                    current.setState({ productsItemShow: current.state.productsItemShow });
                    // console.log(current.state.productsItemShow[index].product_description);

                    // console.log("count locations", current.state.locations.length)
                    if (current.state.locations.length >= 1) {

                        var productDeliveryLocationId = [];
                        current.state.locations.map(function (location) {
                            productDeliveryLocationId.push(location.id);
                        })

                        // console.log("fill location_id in array", productDeliveryLocationId)
                        const postProduct = {
                            "products_id": checkAllProducts.id,
                            "delivery_location_id": productDeliveryLocationId,
                            "status_orders_id": "1"
                        };
                        // console.log("postProduct HAVE LOCATION", postProduct)
                        var token_auth = localStorage.getItem('token_auth');
                        axios.post(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/line_item/${current.props.tcorp_id}`, postProduct, { headers: { "x-access-token": token_auth } })
                            .then(res => {
                                // console.log(">>>>>>>>>>>>>>",res);
                                current.state.productsItemShow[index].line_item_id = res.data.line_item_id;
                                current.setState({ productsItemShow: current.state.productsItemShow });
                                console.log(">>>>>>>>>>>>>>", current.state.productsItemShow[index])
                            }).catch(function (err) {
                                console.log(err);
                            })
                    }
                    else {
                        const postProduct = {
                            "products_id": checkAllProducts.id,
                            "delivery_location_id": [],
                            "status_orders_id": "1"
                        };
                        // console.log("postProduct NOT HAVE LOCATION", postProduct)
                        var token_auth = localStorage.getItem('token_auth');
                        axios.post(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/line_item/${current.props.tcorp_id}`, postProduct, { headers: { "x-access-token": token_auth } })
                            .then(res => {
                                // console.log(">>>>>>>>>>>>>>",res);
                                current.state.productsItemShow[index].line_item_id = res.data.line_item_id;
                                current.setState({ productsItemShow: current.state.productsItemShow });
                            }).catch(function (err) {
                                console.log(err);
                            })
                    }
                }
                else {
                    current.state.productsItemShow[index].product_tcorp_id = value;
                    current.setState({ productsItemShow: current.state.productsItemShow });
                }
            })
        }
        else {
            current.state.productsItemShow[index].product_tcorp_id = value;
            current.setState({ productsItemShow: current.state.productsItemShow });
        }
    }

    onChangeStockReceivedAt(value, index, productId) {
        var current = this;
        this.state.allProducts.map(function (allProducts) {
            if (productId === allProducts.tcorp_id && value.length <= 10) {
                console.log("I AM IN SIDE")
                current.state.productsItemShow[index].line_item_received_at = value;
                current.setState({ productsItemShow: current.state.productsItemShow });

                const editReceivedAt = {
                    "received_at": current.state.productsItemShow[index].line_item_received_at
                };
                console.log("editReceivedAt", editReceivedAt)

                var token_auth = localStorage.getItem('token_auth');
                axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/line_item/${current.props.tcorp_id}/${allProducts.id}/received_at`, editReceivedAt, { headers: { "x-access-token": token_auth } })
                    .then(res => {
                        // console.log("put finish", res);
                        current.setState({ productsItemShow: current.state.productsItemShow });
                        // console.log(current.state.products)
                    }).catch(function (err) {
                        console.log(err);
                    })
            }
        })
    }

    onChangePoName(value, index, productId) {
        var current = this;
        // console.log("check bug chalakter", value.length)
        this.state.allProducts.map(function (allProducts) {
            if (productId === allProducts.tcorp_id && value.length <= 44) {
                console.log(current.state.productsItemShow)
                current.state.productsItemShow[index].line_item_po_name = value;
                current.setState({ productsItemShow: current.state.productsItemShow });

                const editPoName = {
                    "po_number": current.state.productsItemShow[index].line_item_po_name
                };
                // console.log("editPoName", editPoName)
                var token_auth = localStorage.getItem('token_auth');
                axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/line_item/${current.props.tcorp_id}/${allProducts.id}/po_number`, editPoName, { headers: { "x-access-token": token_auth } })
                    .then(res => {
                        // console.log("put finish", res);
                        current.setState({ productsItemShow: current.state.productsItemShow });
                        // console.log(current.state.products)
                    }).catch(function (err) {
                        console.log(err);
                    })
            }
        })
    }

    onChangeStatus(value, index, productId) {
        var current = this;
        this.state.allProducts.map(function (allProducts) {
            if (productId === allProducts.tcorp_id) {
                // console.log(`value: ${value}`)
                current.state.productsItemShow[index].status_order_id = value;
                current.setState({ productsItemShow: current.state.productsItemShow });

                const editStatus = {
                    "status_order_id": current.state.productsItemShow[index].status_order_id
                };
                // console.log("editStatus", editStatus)

                var token_auth = localStorage.getItem('token_auth');
                axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/line_item/${current.props.tcorp_id}/${allProducts.id}/status_order`, editStatus, { headers: { "x-access-token": token_auth } })
                    .then(res => {
                        // console.log("put finish", res);
                        current.setState({ productsItemShow: current.state.productsItemShow });
                        // console.log(current.state.products)
                    }).catch(function (err) {
                        console.log(err);
                    })
            }
        })
    }

    checkLinkAddProduct() {
        if (this.state.role_id === 1 || this.state.role_id === 2 || this.state.role_id === 3) {
            this.state.count = false;
            return (
                <>
                    <button type="button" onClick={this.createNewRowByButton} className="btn btn-info mr-1 mb-3"> เพิ่มสินค้า</button>
                    <button type="button" onClick={this.createNewColumnByButton} className="btn btn-dark mr-1 mb-3"> เพิ่มสถานที่จัดส่ง</button>
                </>
            )
        }
    }

    numTotal(index) {
        // console.log("numTotal", this.state.productsItemShow[index].child_delivery_location_qty)
        if (this.state.locations.length !== 0) {
            return this.state.productsItemShow[index].child_delivery_location_qty.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        }
        else {
            return 0
        }
    }

    numPoTotal(index) {
        if (this.state.locations.length !== 0) {
            var po = this.state.productsItemShow[index].child_delivery_location_qty.reduce((a, b) => parseInt(a) + parseInt(b), 0) - this.state.productsItemShow[index].line_item_stock_qty
            if (po < 0) {
                return 0;
            }
            else {
                return po;
            }
        }
        else {
            return 0
        }
    }

    numStock(data) {
        // console.log("data", data);
        if (data === null) {
            return 0;
        }
        return data;
    }

    getHistory(e) {
        // console.log("hi", e.target.id)
        var token_auth = localStorage.getItem('token_auth');
        axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/log_boqs/${e.target.id}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const history = res.data;
                // console.log(persons.length)
                this.setState({ history: history });
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    filterProductIdForDuplication(){
        var filter_name = []
        this.state.productsItemShow.map(function(productsItemShow){
            filter_name.push(productsItemShow.product_tcorp_id);
        })
        this.setState({ filter_product_id_for_duplication: filter_name})
    }

    render() {
        // console.log("list productItemShow", this.state.productsItemShow);
        var current = this;
        return (
            <div>
                {this.checkLinkAddProduct()}
                <div className="row" style={{ overflowX: "auto" }}>
                    <table id="display-table" className="table">
                        <thead>
                            <tr style={{ fontSize: "1.4rem" }}>
                                <th>&nbsp; </th>
                                <th>โมเดล</th>
                                <th>รายละเอียด</th>
                                {this.state.locations.map(function (diff_location, index) {
                                    return (
                                        <th key={index} id={index}>
                                            <i className="fas fa-times ml-auto mr-0" style={{ fontSize: "12px", color: "#999999" }} onClick={(e) => { if (window.confirm('คุณต้องการลบสถานที่หรือไม่')) current.deleteColumnByButton(e, diff_location.id) }}></i>
                                            <input type='text' className="form-control input-task task-deadline" style={{ width: "100px" }} value={diff_location.name} onChange={e => current.onChangeLocation(e.target.value, index)} />
                                        </th>
                                    )
                                })}
                                <th className="input-center">จำนวนทั้งหมด</th>
                                <th className="input-center">Stock</th>
                                <th className="input-center">ต้องเปิด PO</th>
                                <th>เลขที่ PO</th>
                                <th>วันที่รับของ</th>
                                <th>จัดเก็บลง Stock</th>
                                <th>&nbsp; </th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.productsItemShow.map(function (products, index) {
                                if (products.product_description === '') {
                                    return (
                                        <>
                                            <tr class="accordion-toggle" key={index} id={index} style={{ backgroundColor: "#ffcccc" }}>
                                                <td data-toggle="collapse" data-target={`#demo${index}`} draggable="true" ondragstart="drag(event)">
                                                    <i class="fas fa-arrow-down icon" id={(products.line_item_id)} style={{ fontSize: "12px", verticalAlign: "sub" }} onClick={current.getHistory}></i>
                                                </td>

                                                <td >
                                                    <input className="form-control input-task" type="text" style={{ width: "150px" }} value={products.product_tcorp_id}
                                                        onChange={e => current.onChangeProduct(e.target.value, index, products.product_description)} list="product" />
                                                    <datalist id="product">
                                                        {current.state.allProducts.filter(function (product) {
                                                            for (var product_show of this.state.productsItemShow) {
                                                                if (product.tcorp_id === product_show.product_tcorp_id) {
                                                                    return false;
                                                                }
                                                            }
                                                            return true;
                                                        }, current)
                                                            .map(function (filtered_product) {
                                                                return (
                                                                    <option value={filtered_product.tcorp_id}></option>
                                                                )
                                                            })}
                                                    </datalist>
                                                </td>

                                                <td>
                                                    <h3 className="form-control input-task task-deadline" style={{ overflowX: "scroll" }}>{products.product_description}</h3>
                                                </td>

                                                {current.state.productsItemShow[index].child_delivery_location_qty.map((child_delivery_location_qtivrery, inx) => (
                                                    <td>
                                                        <input type='number' className="form-control input-task task-deadline" value={child_delivery_location_qtivrery} onChange={e => current.onChangeQuality(e.target.value, index, inx, products)} readOnly />
                                                    </td>
                                                ))}
                                                <td>
                                                    <h3 className="form-control input-task task-deadline input-center" style={{ width: "100px" }}>{current.numTotal(index)}</h3>
                                                </td>
                                                <td>
                                                    <input type='number' className="form-control input-task task-deadline" style={{ width: "70px" }} value={current.numStock(products.line_item_stock_qty)} onChange={e => current.onChangeStockQuality(e.target.value, index, products.product_tcorp_id)} readOnly />
                                                </td>
                                                <td>
                                                    <h3 className="form-control input-task task-deadline input-center" style={{ width: "80px" }}> {current.numPoTotal(index)}</h3>
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control input-task task-deadline" style={{ width: "150px" }} value={products.line_item_po_name} onChange={e => current.onChangePoName(e.target.value, index, products.product_tcorp_id)} readOnly />
                                                </td>
                                                <td>
                                                    <input type="date" className="form-control input-task task-deadline" value={products.line_item_received_at != null ? products.line_item_received_at.substring(0, 10) : "2019-08-14T00:00:00.000Z"} onChange={e => current.onChangeStockReceivedAt(e.target.value, index, products.product_tcorp_id)} readOnly />
                                                </td>
                                                <td>
                                                    <select className="form-control" style={{ width: "120px" }} onChange={e => current.onChangeStatus(e.target.value, index, products.product_tcorp_id)}>
                                                        {current.state.allStatus.map(function (allStatus) {
                                                            if (allStatus.id === products.status_order_id) return <option value={allStatus.id} selected>{allStatus.status}</option>
                                                            return <option value={allStatus.id} >{allStatus.status}</option>
                                                        })}
                                                    </select>
                                                </td>
                                                <td>
                                                    <i className="fas fa-trash icon ml-auto mr-2 my-3" style={{ fontSize: "15px" }} onClick={(e) => { if (window.confirm('คุณต้องการลบสถานที่หรือไม่')) current.deleteEmptyRowByButton(e, products.product_tcorp_id) }}></i>
                                                </td>
                                            </tr >
                                            <tr>
                                                <td colspan="12" class="hiddenRow">
                                                    <div id={`demo${index}`} class="accordian-body collapse p-3" style={{ fontSize: "1.3rem", fontFamily: "ThaiSansLite" }}>
                                                        {current.state.history.map((history, index) => (
                                                            <>
                                                                <p>{index + 1}. เปลี่ยนสินค้า : <span>{history.product_tcorp_id}</span> By {history.firstname}  {history.lastname}   ตำแหน่ง : {history.role}</p>
                                                            </>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                }
                                return (
                                    <>
                                        <tr class="accordion-toggle" key={index} id={index}>
                                            <td data-toggle="collapse" data-target={`#demo${index}`} draggable="true" ondragstart="drag(event)">
                                                <i class="fas fa-arrow-down icon" id={(products.line_item_id)} style={{ fontSize: "12px", verticalAlign: "sub" }} onClick={current.get}></i>
                                            </td>

                                            <td >
                                                <input className="form-control input-task" type="text" style={{ width: "150px" }} value={products.product_tcorp_id}
                                                    onChange={e => current.onChangeProduct(e.target.value, index, products.product_description)} list="product" />
                                                <datalist id="product">
                                                    {current.state.allProducts.filter(function (product) {
                                                        for (var product_show of this.state.productsItemShow) {
                                                            if (product.tcorp_id === product_show.product_tcorp_id) {
                                                                return false;
                                                            }
                                                        }
                                                        return true;
                                                    }, current)
                                                        .map(function (filtered_product) {
                                                            return (
                                                                <option value={filtered_product.tcorp_id}></option>
                                                            )
                                                        })}
                                                </datalist>
                                            </td>

                                            <td>
                                                <h3 className="form-control input-task task-deadline" style={{ overflowX: "scroll" }}>{products.product_description}</h3>
                                            </td>

                                            {current.state.productsItemShow[index].child_delivery_location_qty.map((child_delivery_location_qtivrery, inx) => (
                                                <td>
                                                    <input type='number' min='0' className="form-control input-task task-deadline" value={child_delivery_location_qtivrery} onChange={e => current.onChangeQuality(e.target.value, index, inx, products)} />
                                                </td>
                                            ))}
                                            <td>
                                                <h3 className="form-control input-task task-deadline input-center" style={{ width: "100px" }}>{current.numTotal(index)}</h3>
                                            </td>
                                            <td>
                                                <input type='number' min='0' className="form-control input-task task-deadline" style={{ width: "70px" }} value={current.numStock(products.line_item_stock_qty)} onChange={e => current.onChangeStockQuality(e.target.value, index, products.product_tcorp_id)} />
                                            </td>
                                            <td>
                                                <h3 className="form-control input-task task-deadline input-center" style={{ width: "80px" }}> {current.numPoTotal(index)}</h3>
                                            </td>
                                            <td>
                                                <input type="text" className="form-control input-task task-deadline" style={{ width: "150px" }} value={products.line_item_po_name} onChange={e => current.onChangePoName(e.target.value, index, products.product_tcorp_id)} />
                                            </td>
                                            <td>
                                                <input type="date" className="form-control input-task task-deadline" value={products.line_item_received_at != null ? products.line_item_received_at.substring(0, 10) : "2019-08-14T00:00:00.000Z"} onChange={e => current.onChangeStockReceivedAt(e.target.value, index, products.product_tcorp_id)} />
                                            </td>
                                            <td>
                                                <select className="form-control" style={{ width: "120px" }} onChange={e => current.onChangeStatus(e.target.value, index, products.product_tcorp_id)}>
                                                    {current.state.allStatus.map(function (allStatus) {
                                                        if (allStatus.id === products.status_order_id) return <option value={allStatus.id} selected>{allStatus.status}</option>
                                                        return <option value={allStatus.id} >{allStatus.status}</option>
                                                    })}
                                                </select>
                                            </td>
                                            <td>
                                                <i className="fas fa-trash icon ml-auto mr-2 my-3" style={{ fontSize: "15px" }} onClick={(e) => { if (window.confirm('คุณต้องการลบสินนี้หรือไม่')) current.deleteRowByButton(e, products.product_tcorp_id) }}></i>
                                            </td>
                                        </tr >
                                        <tr>
                                            <td colspan="12" class="hiddenRow">
                                                <div id={`demo${index}`} class="accordian-body collapse p-3" style={{ fontSize: "1.3rem", fontFamily: "ThaiSansLite" }}>
                                                    {current.state.history.map((history, index) => (
                                                        <>
                                                            <p>{index + 1}. เปลี่ยนสินค้า : <span>{history.product_tcorp_id}</span> By {history.firstname}  {history.lastname}   ตำแหน่ง : {history.role}</p>
                                                        </>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mb-5"></div>
            </div>
        );
    }
}

export default ListBoq;
