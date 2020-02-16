import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios';
import jwt_decode from 'jwt-decode';

class EditBoq extends React.Component {

    state = {
        headDetails: [],
        statusOrder: [],
        isTokenValid: false,
        checkDelete: false,

        products_id: '',
        qty: '',
        stock_qty: '',
        status_orders_id: '',
        purchase_orders_id: '',
        received_at: '',

        role_id: '',
    }

    handleChangeProductId = event => {
        this.setState({ products_id: event.target.value });
    }

    handleChangeQty = event => {
        this.setState({ qty: event.target.value });
    }

    handleChangeStockQty = event => {
        this.setState({ stock_qty: event.target.value });
    }

    handleChangeStatusOrder = event => {
        this.setState({ status_orders_id: event.target.value });
    }

    handleChangePo = event => {
        this.setState({ purchase_orders_id: event.target.value });
    }

    handleChangeReceived = event => {
        this.setState({ received_at: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        console.log("handleSubmit")

        const edit = {
            "products_id": this.state.products_id,
            "qty": this.state.qty,
            "stock_qty": this.state.stock_qty,
            "status_orders_id": this.state.status_orders_id,
            "purchase_orders_id": this.state.purchase_orders_id,
            "received_at": this.state.received_at
        };
        console.log("edit", edit)

        var current = this;
        var tcorp_id = this.props.match.params.tcorp_id
        var products_id = this.props.match.params.products_id
        axios.put(`http://vanilla-erp.com:10000/api/v1/boqs/line_item/${tcorp_id}/line_item/${products_id}`, edit, { headers: { "x-access-token": localStorage.getItem('token_auth') } })
            .then(res => {
                console.log(res);
                this.setState({ isTokenValid: true });
            }).catch(function (err) {
                console.log(err);
                current.setState({ isTokenValid: false });
            })
    }

    handleSubmitForDelete = () => {
        console.log("onClick")
        var tcorp_id = this.props.match.params.tcorp_id
        var products_id = this.props.match.params.products_id
        var token_auth = localStorage.getItem('token_auth');
        console.log(token_auth)
        axios.delete(`http://vanilla-erp.com:10000/api/v1/boqs/line_item/${tcorp_id}/line_item/${products_id}    
        `, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ checkDelete: true });
            })
    }

    componentDidMount() {
        // console.log(`This is tcorp_id: ${JSON.stringify(this.props)}`);
        var tcorp_id = this.props.match.params.tcorp_id
        var products_id = this.props.match.params.products_id
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var current = this;
        axios.get(`http://vanilla-erp.com:10000/api/v1/boqs/line_item/${tcorp_id}/line_item/${products_id}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const headDetails = res.data;
                // console.log(persons.length)
                this.setState({
                    headDetails: headDetails,

                    products_id: headDetails[0].products_id,
                    qty: headDetails[0].qty,
                    stock_qty: headDetails[0].stock_qty,
                    status_orders_id: headDetails[0].status_orders_id,
                    purchase_orders_id: headDetails[0].purchase_orders_id,
                    received_at: headDetails[0].received_at
                });
            })
            .catch(function (err) {
                console.log(err);
            });

        axios.get(`http://vanilla-erp.com:10000/api/v1/boqs/status_order`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res)
                const statusOrder = res.data;
                // console.log(persons.length)
                current.setState({ statusOrder: statusOrder });
            })
            .catch(function (err) {
                console.log(err);
            });

        var decoded = jwt_decode(token_auth);
        var username = decoded.username;
        axios.get(`http://vanilla-erp.com:10000/api/v1/users/${username}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                // console.log("use info",res)
                const user_infoes = res.data;
                this.setState({ user_infoes: user_infoes, role_id: user_infoes[0].role_id });
            })
            .catch(function (err) {
                console.log(err)
            });
    }

    render() {
        var current = this;
        var tcorp_id = this.props.match.params.tcorp_id;
        if (this.state.isTokenValid === true || this.state.checkDelete === true) {
            return <Redirect to={`/boq/line_item/${tcorp_id}`} />
        }
        console.log(">>>>>>>>>>current.state.role_id ",current.state.role_id )
        return (
            <div>
                {current.state.headDetails.map(function (headDetail) {
                    // ADMIN ONLY
                    if (current.state.role_id === 1) {
                        return (
                            <>
                                <Link to={`/boq/${this.props.tcorp_id}/${this.props.boq_id}`}><i className="IconClosePage fas fa-times"></i></Link>
                                <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }} >
                                    <h1>แก้ไขสินค้า: {headDetail.name}</h1>
                                    <div className="row">
                                        <Link className="mr-0 ml-auto" onClick={current.handleSubmitForDelete}><button type="submit" className="btn btn-dark">ลบ Task</button></Link>
                                    </div>

                                    {/* TEAM PM */}
                                    <form onSubmit={current.handleSubmit}>
                                        <h1>ทีม PM</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <input type="text" className="form-control" onChange={current.handleChangeProductId} placeholder={headDetail.products_id} />
                                        </div>
                                        <div className="form-group">
                                            <h4>รายละเอียดสินค้า : </h4>
                                            <h4 className="form-control">{headDetail.description}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>จำนวนของ :</h4>
                                            <input type="number" className="form-control" onChange={current.handleChangeQty} placeholder={headDetail.qty} />
                                        </div>
                                        <div className="row">
                                            <button type="submit" class="btn btn-secondary ml-auto mr-0">ยืนยัน</button>
                                        </div>
                                    </form>
                                    {/*  */}
                                    <div className="my-5"></div>
                                    {/* TEAM STOCK */}
                                    <form onSubmit={current.handleSubmit}>
                                        <h1>ทีม Stock</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <input type="text" className="form-control" onChange={current.handleChangeProductId} placeholder={headDetail.products_id} />
                                        </div>
                                        <div className="form-group">
                                            <h4>จองของแล้ว :</h4>
                                            <input type="number" className="form-control" onChange={current.handleChangeStockQty} placeholder={headDetail.stock_qty} />
                                        </div>
                                        <div className="form-group">
                                            <h4>จัดเก็บลง Stock :</h4>
                                            <select class="form-control" onChange={current.handleChangeStatusOrder}>
                                                <option value="">None</option>
                                                {current.state.statusOrder.map(function (statusOrder) {
                                                    if (statusOrder.id === headDetail.status_orders_id) return <option value={statusOrder.id} selected>{statusOrder.status}</option>
                                                    return <option value={statusOrder.id}>{statusOrder.status}</option>
                                                })}
                                            </select>
                                        </div>
                                        <div className="row">
                                            <button type="submit" class="btn btn-secondary ml-auto">ยืนยัน</button>
                                        </div>
                                    </form>
                                    {/*  */}
                                    <div className="my-5"></div>
                                    {/* TEAM PO */}
                                    <form onSubmit={current.handleSubmit}>
                                        <h1>ทีม PO</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <input type="text" className="form-control" onChange={current.handleChangeProductId} placeholder={headDetail.products_id} />
                                        </div>
                                        <div className="form-group">
                                            <h4>เลขที่ PO :</h4>
                                            <input type="text" className="form-control" onChange={current.handleChangePo} placeholder={headDetail.po_number} />
                                        </div>
                                        <div className="form-group">
                                            <h4>วันที่รับของ :</h4>
                                            <input type="date" class="form-control" onChange={current.handleChangeReceived} defaultValue={headDetail.received_at} />
                                        </div>
                                        <div className="row">
                                            <button type="submit" class="btn btn-secondary ml-auto mb-5">ยืนยัน</button>
                                        </div>
                                    </form>
                                    {/*  */}

                                </div>
                            </>
                        )
                    }

                    // PM ONLY
                    if (current.state.role_id === 3) {
                        return (
                            <>
                                <Link to={`/boq/line_item/${tcorp_id}`}><i className="IconClosePage fas fa-times"></i></Link>
                                <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }} >
                                    <h1>แก้ไขสินค้า: {headDetail.name}</h1>
                                    <div className="row">
                                        <Link className="mr-0 ml-auto" onClick={current.handleSubmitForDelete}><button type="submit" className="btn btn-dark">ลบ Task</button></Link>
                                    </div>

                                    {/* TEAM PM */}
                                    <form onSubmit={current.handleSubmit}>
                                        <h1>ทีม PM</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <input type="text" className="form-control" onChange={current.handleChangeProductId} placeholder={headDetail.products_id} />
                                        </div>
                                        <div className="form-group">
                                            <h4>รายละเอียดสินค้า : </h4>
                                            <h4 className="form-control">{headDetail.description}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>จำนวนของ :</h4>
                                            <input type="number" className="form-control" onChange={current.handleChangeQty} placeholder={headDetail.qty} />
                                        </div>
                                        <div className="row">
                                            <button type="submit" class="btn btn-secondary ml-auto mr-0">ยืนยัน</button>
                                        </div>
                                    </form>
                                    {/*  */}
                                    <div className="my-5"></div>
                                    {/* TEAM STOCK */}
                                    <form>
                                        <h1>ทีม Stock</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <h4 className="form-control">{headDetail.products_id}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>จองของแล้ว :</h4>
                                            <h4 className="form-control">{headDetail.stock_qty}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>จัดเก็บลง Stock :</h4>
                                            {current.state.statusOrder.map(function (statusOrder) {
                                                if (statusOrder.id === headDetail.status_orders_id) return <h4 className="form-control">{statusOrder.status}</h4>
                                                return null
                                            })}
                                        </div>
                                    </form>
                                    {/*  */}
                                    <div className="my-5"></div>
                                    {/* TEAM PO */}
                                    <form>
                                        <h1>ทีม PO</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <h4 className="form-control">{headDetail.products_id}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>เลขที่ PO :</h4>
                                            <h4 className="form-control">{headDetail.po_number}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>วันที่รับของ :</h4>
                                            <h4 class="form-control mb-5">{headDetail.received_at} </h4>
                                        </div>
                                    </form>
                                    {/*  */}

                                </div>
                            </>
                        )
                    }

                    // STOCK ONLY
                    if (current.state.role_id === 5){
                        return (
                            <>
                                <Link to={`/boq/line_item/${tcorp_id}`}><i className="IconClosePage fas fa-times"></i></Link>
                                <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }} >
                                    <h1>แก้ไขสินค้า: {headDetail.name}</h1>

                                    {/* TEAM PM */}
                                    <form>
                                        <h1>ทีม PM</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <h4 className="form-control">{headDetail.products_id}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>รายละเอียดสินค้า : </h4>
                                            <h4 className="form-control">{headDetail.description}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>จำนวนของ :</h4>
                                            <h4 className="form-control">{headDetail.qty}</h4>
                                        </div>
                                    </form>
                                    {/*  */}
                                    <div className="my-5"></div>
                                    {/* TEAM STOCK */}
                                    <form onSubmit={current.handleSubmit}>
                                        <h1>ทีม Stock</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <input type="text" className="form-control" onChange={current.handleChangeProductId} placeholder={headDetail.products_id} />
                                        </div>
                                        <div className="form-group">
                                            <h4>จองของแล้ว :</h4>
                                            <input type="number" className="form-control" onChange={current.handleChangeStockQty} placeholder={headDetail.stock_qty} />
                                        </div>
                                        <div className="form-group">
                                            <h4>จัดเก็บลง Stock :</h4>
                                            <select class="form-control" onChange={current.handleChangeStatusOrder}>
                                                <option value="">None</option>
                                                {current.state.statusOrder.map(function (statusOrder) {
                                                    if (statusOrder.id === headDetail.status_orders_id) return <option value={statusOrder.id} selected>{statusOrder.status}</option>
                                                    return <option value={statusOrder.id}>{statusOrder.status}</option>
                                                })}
                                            </select>
                                        </div>
                                        <div className="row">
                                            <button type="submit" class="btn btn-secondary ml-auto">ยืนยัน</button>
                                        </div>
                                    </form>
                                    {/*  */}
                                    <div className="my-5"></div>
                                    {/* TEAM PO */}
                                    <form>
                                        <h1>ทีม PO</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <h4 className="form-control">{headDetail.products_id}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>เลขที่ PO :</h4>
                                            <h4 className="form-control">{headDetail.po_number}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>วันที่รับของ :</h4>
                                            <h4 className="form-control mb-5">{headDetail.received_at}</h4>
                                        </div>
                                    </form>
                                    {/*  */}

                                </div>
                            </>
                        )
                    }

                    // PO ONLY
                    if (current.state.role_id === 7){
                        return (
                            <>
                                <Link to={`/boq/line_item/${tcorp_id}`}><i className="IconClosePage fas fa-times"></i></Link>
                                <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }} >
                                    <h1>แก้ไขสินค้า: {headDetail.name}</h1>

                                    {/* TEAM PM */}
                                    <form>
                                        <h1>ทีม PM</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <h4 className="form-control">{headDetail.products_id}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>รายละเอียดสินค้า : </h4>
                                            <h4 className="form-control">{headDetail.description}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>จำนวนของ :</h4>
                                            <h4 className="form-control">{headDetail.qty}</h4>
                                        </div>
                                    </form>
                                    {/*  */}
                                    <div className="my-5"></div>
                                    {/* TEAM STOCK */}
                                    <form>
                                        <h1>ทีม Stock</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <h4 className="form-control">{headDetail.products_id}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>จองของแล้ว :</h4>
                                            <h4 className="form-control">{headDetail.stock_qty}</h4>
                                        </div>
                                        <div className="form-group">
                                            <h4>จัดเก็บลง Stock :</h4>
                                            {current.state.statusOrder.map(function (statusOrder) {
                                                if (statusOrder.id === headDetail.status_orders_id) return <h4 className="form-control">{statusOrder.status}</h4>
                                                return null
                                            })}
                                        </div>
                                    </form>
                                    {/*  */}
                                    <div className="my-5"></div>
                                    {/* TEAM PO */}
                                    <form onSubmit={current.handleSubmit}>
                                        <h1>ทีม PO</h1>
                                        <div className="form-group">
                                            <h4>รหัสสินค้า:</h4>
                                            <input type="text" className="form-control" onChange={current.handleChangeProductId} placeholder={headDetail.products_id} />
                                        </div>
                                        <div className="form-group">
                                            <h4>เลขที่ PO :</h4>
                                            <input type="text" className="form-control" onChange={current.handleChangePo} placeholder={headDetail.po_number} />
                                        </div>
                                        <div className="form-group">
                                            <h4>วันที่รับของ :</h4>
                                            <input type="date" class="form-control" onChange={current.handleChangeReceived} defaultValue={headDetail.received_at} />
                                        </div>
                                        <div className="row">
                                            <button type="submit" class="btn btn-secondary ml-auto mb-5">ยืนยัน</button>
                                        </div>
                                    </form>
                                    {/*  */}

                                </div>
                            </>
                        )
                    }

                    // ANOTHER ROLE 
                    return (
                        <>
                            <Link to={`/boq/line_item/${tcorp_id}`}><i className="IconClosePage fas fa-times"></i></Link>
                            <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }} >
                                <h1>แก้ไขสินค้า: {headDetail.name}</h1>

                                {/* TEAM PM */}
                                <form>
                                    <h1>ทีม PM</h1>
                                    <div className="form-group">
                                        <h4>รหัสสินค้า:</h4>
                                        <h4 className="form-control">{headDetail.products_id}</h4>
                                    </div>
                                    <div className="form-group">
                                        <h4>รายละเอียดสินค้า : </h4>
                                        <h4 className="form-control">{headDetail.description}</h4>
                                    </div>
                                    <div className="form-group">
                                        <h4>จำนวนของ :</h4>
                                        <h4 className="form-control ">{headDetail.qty}</h4>
                                    </div>
                                </form>
                                {/*  */}
                                <div className="my-5"></div>
                                {/* TEAM STOCK */}
                                <form>
                                    <h1>ทีม Stock</h1>
                                    <div className="form-group">
                                        <h4>รหัสสินค้า:</h4>
                                        <h4 className="form-control">{headDetail.products_id}</h4>
                                    </div>
                                    <div className="form-group">
                                        <h4>จองของแล้ว :</h4>
                                        <h4 className="form-control">{headDetail.stock_qty}</h4>
                                    </div>
                                    <div className="form-group">
                                        <h4>จัดเก็บลง Stock :</h4>
                                            {current.state.statusOrder.map(function (statusOrder) {
                                                if (statusOrder.id === headDetail.status_orders_id) return <h4 className="form-control">{statusOrder.status}</h4>
                                                return null;
                                            })}
                                    </div>
                                </form>
                                {/*  */}
                                <div className="my-5"></div>
                                {/* TEAM PO */}
                                <form>
                                    <h1>ทีม PO</h1>
                                    <div className="form-group">
                                        <h4>รหัสสินค้า:</h4>
                                        <h4 className="form-control">{headDetail.products_id}</h4>
                                    </div>
                                    <div className="form-group">
                                        <h4>เลขที่ PO :</h4>
                                        <h4 className="form-control">{headDetail.po_number}</h4>
                                    </div>
                                    <div className="form-group">
                                        <h4>วันที่รับของ :</h4>
                                        <h4 className="form-control mb-5">{headDetail.received_at}</h4>
                                    </div>
                                </form>
                                {/*  */}
                            </div>
                        </>
                    )
                })}
            </div>
        );
    }

}

export default EditBoq;