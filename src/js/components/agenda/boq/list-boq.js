import React from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom'

class ListBoq extends React.Component {

    state = {
        headDetails: [],
        headDetailsBoqId: [],
        user_infoes: [],
        role_id: '',
        isTokenValid: '',
        tcorp_id: '',
        bill_of_quantity_id: '',
        count: true
    }

    async getData() {
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var headDetails = await axios.get(`http://vanilla-erp.com:10000/api/v1/boqs/line_item/${this.props.tcorp_id}`, { headers: { 'x-access-token': token_auth } })
        var headDetailsBoqId = await axios.get(`http://vanilla-erp.com:10000/api/v1/boqs/${this.props.tcorp_id}`, { headers: { 'x-access-token': token_auth } })
        headDetails = headDetails.data;
        headDetailsBoqId = headDetailsBoqId.data;
        console.log("THIS IS FROM GET DATA head Detail", headDetailsBoqId);
        return await { headDetails: headDetails };
    }

    componentDidMount() {
        var current = this;
        this.getData().then(function (data) {
            var headDetails = data.headDetails;
            var headDetailsBoqId = data.headDetailsBoqId;
            // console.log("COMPONENTDIDMOUNT head Detail >>", headDetails);
            current.setState({ headDetails: headDetails, isTokenValid: true, bill_of_quantity_id: current.props.boq_id });
        }).catch(function (err) {
            console.log(err);
            current.setState({ isTokenValid: false });
        });

        var token_auth = localStorage.getItem('token_auth');
        var decoded = jwt_decode(token_auth);
        var username = decoded.username;
        axios.get(`http://vanilla-erp.com:10000/api/v1/users/${username}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log("use info",res)
                const user_infoes = res.data;
                this.setState({ user_infoes: user_infoes, role_id: user_infoes[0].role_id});
            })
            .catch(function (err) {
                console.log(err)
            });
    }

    cutProductName(data){
        if(data === null){
            var na = "N/A";
            return na;
        }
        var cut = data.slice(0, 10)
        return cut;
    }

    cutProductDescription(data){
        if(data === null){
            var na = "N/A";
            return na;
        }
        var cut = data.slice(0, 30)
        return cut;
    }

    render() {
        var current = this;
        console.log(">>>>>>>>>>>>>", this.props.tcorp_id);
        console.log(">>>>>>>>udhfoisehosrgodrogdorgr>>>>>", this.state.bill_of_quantity_id);

        function checkLinkAddProduct(){
            if (current.state.role_id === 1 || current.state.role_id === 2 || current.state.role_id === 3) {
                current.state.count = false;
                return (
                    <Link to={{ pathname: `/boq/${current.props.tcorp_id}/${current.props.boq_id}/create`, state: { tcorp_id: current.props.tcorp_id, bill_of_quantity_id: current.state.bill_of_quantity_id } }}> <button type="submit" className="btn btn-dark mr-1"> เพิ่ม Product</button></Link>
                )
            }
        }

        return (
            <div>
                {checkLinkAddProduct()}

                <div className="row">
                    <table id="display-table">
                        <thead>
                            <tr style={{ fontSize: "1.4rem" }}>
                                <th>&nbsp; </th>
                                <th>โมเดล (Model)</th>
                                <th>รายละเอียด</th>
                                <th className="input-center">จำนวน (Qty.)</th>
                                <th className="input-center">Stock</th>
                                <th className="input-center">ต้องเปิด PO</th>
                                <th>วันที่รับของ</th>
                                <th>จัดเก็บลง Stock</th>
                                <th>วันที่ส่งของให้ลูกค้า</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.headDetails.map(function (headDetail) {
                                return (
                                    <tr>
                                        <>
                                            <td draggable="true" ondragstart="drag(event)">
                                                <i className="fas fa-grip-vertical icon"></i>
                                            </td>
                                            <td><h3 className="form-control input-task task-deadline">{current.cutProductName(headDetail.product_name)}</h3></td>
                                            <td><h3 className="form-control input-task task-deadline">{current.cutProductDescription(headDetail.description)}</h3></td>
                                            <td><h3 className="form-control input-task task-deadline input-center">{headDetail.qty}</h3></td>
                                            <td><h3 className="form-control input-task task-deadline table-col-width-short input-center">{headDetail.stock_qty}</h3></td>
                                            <td><h3 className="form-control input-task task-deadline input-center">{headDetail.purchase_orders_id}</h3></td>
                                            <td><h3 className="form-control input-task task-deadline">{headDetail.received_at}</h3></td>
                                            <td><h3 className="form-control input-task task-deadline input-center">{headDetail.status_orders_id}</h3></td>
                                            <td><h3 className="form-control input-task task-deadline">{headDetail.deadline_at}</h3></td>
                                            <td><Link to={`/edit-boq/${headDetail.tcorp_id}/${current.props.boq_id}/${headDetail.products_id}`}><button className="btn btn-dark ">แก้ไข</button></Link></td>
                                        </>
                                    </tr >
                                )
                            })}
                            <div className="mb-5"></div>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ListBoq;