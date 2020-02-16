import React from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
//import { Redirect } from 'react-router-dom'

import '../../../css/_progressbar.css'
import '../../../css/tasks.css'

class ComponentProjectTopic extends React.Component {

    state = {
        headDetail: []
    }

    async getData() {
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var headDetail = await axios.get(`http://vanilla-erp.com:10000/api/v1/projects/T1901`, { headers: { 'x-access-token': token_auth } })
        headDetail = headDetail.data;
        console.log("THIS IS FROM GET DATA head Detail", headDetail);
        return await { headDetail: headDetail };
    }

    componentDidMount() {
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

    render() {
        return (
            <div className="row">
                {this.state.headDetail.map(function (headDetail, i) {
                    return(
                        <div className="col-12">
                            <h4 className="T-Corporation-CoLt">T Corporation Co., Ltd</h4>
                            <h2 className="Projects">{`${headDetail.tcorp_id}: ${headDetail.name_th}`} </h2>
                            <h4>โครงการ: {headDetail.description} </h4>
                            <h4>ลูกค้า: {headDetail.name} </h4>
                            <div className="row">
                                <div className="col-4">
                                    <h4>มูลค่างาน: {headDetail.value} บาท</h4>
                                </div>
                                <div className="col-4">
                                    <h4>ส่งมอบงานภายใน: {headDetail.end_contract_date} </h4>
                                </div>
                                <div className="col-4">
                                    <h4>สถานะ: ตามแผน</h4>
                                </div>
                            </div>
                        </div>
                    )
                })}

                <div className="col-12">
                    <button type="submit" className="btn btn-dark mr-1"><Link to="/project-task">โปรเจค</Link></button>
                    <button type="submit" className="btn btn-dark mr-1"><Link to="/boq">BOQ</Link> </button>
                    <button type="submit" onclick="window.location.href = '_drive.html';" className="btn btn-dark mr-1">เอกสาร</button>
                </div>

                <div className="col-12 my-3 px-5 mx-5">
                    <ul className="progressbar" style={{fontSize:"1.4rem"}}>
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
