import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios';

import '../../../css/_progressbar.css'
import '../../../css/tasks.css'

class ComponentProjectTopic extends React.Component {

    state = {
        headDetail: [],
        headBoqId: [],
        checkDelete: false,
    }

    async getData() {
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var headDetail = await axios.get(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.tcorp_id}`, { headers: { 'x-access-token': token_auth } })
        // var headBoqId = await axios.get(`http://vanilla-erp.com:10000/api/v1/boqs/${this.props.tcorp_id}`, { headers: { 'x-access-token': token_auth } })
        console.log("this.props.tcorp_id", this.props.tcorp_id)
        // http://vanilla-erp.com:10000/api/v1/boqs/T1234
        var headBoqId = 0
        await axios.get(`http://vanilla-erp.com:10000/api/v1/boqs/${this.props.tcorp_id}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(">>>>> headBoqId #1", res);
                headBoqId = res.data[0].id;
            })
        headDetail = headDetail.data;
        
        console.log(">>>>> headBoqId #2", headBoqId, this.props.tcorp_id);
        // console.log("THIS IS FROM GET DATA head Detail", headDetail);
        return await { headDetail: headDetail, headBoqId: headBoqId};
    }

    componentDidMount() {
        var current = this;
        this.getData().then(function (data) {
            var headDetail = data.headDetail;
            var headBoqId = data.headBoqId;
            console.log("COMPONENTDIDMOUNT head Detail", headDetail);
            current.setState({ headDetail: headDetail, isTokenValid: true , headBoqId: headBoqId});
            console.log("COMPONENTDIDMOUNT state", current.state);
        }).catch(function (err) {
            console.log(err);
            current.setState({ isTokenValid: false });
        });
    }

    componentWillReceiveProps(nextProps) {
        var current = this;
        this.getData().then(function (data) {
            var headDetail = data.headDetail;
            console.log("COMPONENTDIDMOUNT head Detail", headDetail);
            current.setState({ headDetail: headDetail, isTokenValid: true });
        }).catch(function (err) {
            console.log(err);
            current.setState({ isTokenValid: false });
        });

    }
    handleSubmit = () => {
        console.log("onClick")
        console.log("check prop tcorp", this.props.tcorp_id)
        var token_auth = localStorage.getItem('token_auth');
        console.log("check token ",token_auth)
        axios.delete(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.tcorp_id}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ checkDelete: true });
            })
    }

    render() {
        if (this.state.checkDelete === true) {
            return <Redirect to="/project-overview" />
        }

        function checkNanData(data) {
            if (data === "" || data === null) {
                var na = "N/A";
                return na;
            }
            return data;
        }

        function checkNullDate(data) {
            if (data === null) {
                var na = "N/A";
                return na;
            }
            return data.slice(0, 10);
        }

        return (
            <div className="row">
                {this.state.headDetail.map(function (headDetail) {
                    return (
                        <div className="col-12">
                            <h4 className="T-Corporation-CoLt">T Corporation Co., Ltd</h4>
                            <h2 className="Projects">{headDetail.tcorp_id}: {checkNanData(headDetail.name_th)} </h2>
                            <h4>โครงการ: {checkNanData(headDetail.description)} </h4>
                            <h4>ลูกค้า: {headDetail.name} </h4>
                            <div className="row">
                                <div className="col-4">
                                    <h4>มูลค่างาน: {headDetail.value.toLocaleString()} บาท</h4>
                                </div>
                                <div className="col-4">
                                    <h4>ส่งมอบงานภายใน: {checkNullDate(headDetail.end_contract_date)} </h4>
                                </div>
                                <div className="col-4">
                                    <h4>สถานะ: ตามแผน</h4>
                                </div>
                            </div>
                        </div>
                    )
                })}

                <Link to={`/project-task/${this.props.tcorp_id}`}><button type="submit" className="btn btn-dark mr-1">โปรเจค</button></Link>
                <Link to={`/boq/${this.props.tcorp_id}/${this.state.headBoqId}`}><button type="submit" className="btn btn-dark mr-1">BOQ</button></Link>
                <Link to={`/document/${this.props.tcorp_id}`}><button type="submit" className="btn btn-dark mr-1">เอกสาร</button></Link>

                <div className="ml-auto mr-1">
                    <Link to={`/edit-project/${this.props.tcorp_id}`}><button type="submit" className="btn btn-dark mr-1">แก้ไข</button></Link>
                    <Link onClick={this.handleSubmit}><button type="submit" className="btn btn-dark mr-1">ลบ</button></Link>
                </div>

                <div className="col-12 my-3 px-5 mx-5">
                    <ul className="progressbar" style={{ fontSize: "1.4rem" }}>
                        <li className="active ">เปิด BOQ</li>
                        <li>Check Stock</li>
                        <li>เปิด PO</li>
                        <li>จัดเก็บลง Stock</li>
                        <li>พร้อมส่งสินค้า</li>
                        <li>ส่งสินค้า</li>
                    </ul>
                </div>

            </div>
        );
    }

}

export default ComponentProjectTopic;
