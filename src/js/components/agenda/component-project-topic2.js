import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios';

import '../../../css/_progressbar.css'
import '../../../css/tasks.css'

import { API_URL_DATABASE } from '../../config_database.js';

class ComponentProjectTopic extends React.Component {

    state = {
        headDetail: [],
        headBoqId: [],
        checkDelete: false,


    }

    getData(tcorp_id) {
        return new Promise((resolve, reject) => {
            var token_auth = localStorage.getItem('token_auth');
            console.log("I am getting data. this.props.tcorp_id", tcorp_id)
            
            axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${tcorp_id}`, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                var headDetail = res.data; 
                axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/${tcorp_id}`, { headers: { 'x-access-token': token_auth } })
                .then(res => {
                    // console.log(">>>>> headBoqId #1", res);
                    var headBoqId = res.data[0].id;
                    resolve({ headDetail: headDetail, headBoqId: headBoqId}); 

                })
		.catch(reject);
            })
	    .catch(reject);
            // var headBoqId = await axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/${this.props.tcorp_id}`, { headers: { 'x-access-token': token_auth } })
            // http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/boqs/T1234
                       // console.log(">>>>> headBoqId #2", headBoqId, this.props.tcorp_id);
        });
    }

    componentDidMount() {
        var current = this;
        this.getData(this.props.tcorp_id).then(function (data) {
            var headDetail = data.headDetail;
            var headBoqId = data.headBoqId;
            console.log("COMPONENTDIDMOUNT head Detail", headDetail);
            current.setState({ headDetail: headDetail, isTokenValid: true , headBoqId: headBoqId});
            // console.log("COMPONENTDIDMOUNT state", current.state);
        }).catch(function (err) {
            console.log(err);
            current.setState({ isTokenValid: false });
        });
    }

    componentWillReceiveProps(nextProps) {
        var current = this;
        // console.log("Compoent project topic is receving next props!!", nextProps);
        this.getData(nextProps.tcorp_id).then(function (data) {
            var headDetail = data.headDetail;
            // console.log("Componentprojectopic2 COMPONENTDIDMOUNT head Detail", headDetail);
            current.setState({ headDetail: headDetail, isTokenValid: true });
        }).catch(function (err) {
            console.log(err);
            current.setState({ isTokenValid: false });
        });

    }

    handleCheck() {
        if (window.confirm('คุณต้องการเปลี่ยนสถานนี้หรือไม่ ?')) {
            alert("SSS")
        }
    }

    render() {
        // console.log("Component Project TOpic Rendering", this.props.tcorp_id);
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

        function checkNanDataPrice(data) {
            if (data === "") {
                var na = "N/A";
                return na;
            }
            var x = data.toString().indexOf('.');
            var y = data.toString().length;
            // console.log("dot price", x)
            // console.log("dot 2", y)
            if(x === -1){
                return data + ".00";
            }
            if(y-x === 2){
                return data + "0";
            }
            return data;
        }

        function diffTime(date) {
            var dateNow = new Date();
            var dateEnd = new Date(date);
            var diff = (dateEnd - dateNow) / (1000 * 3600 * 24);
            var x = Math.floor(diff);
            return x;
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
                            <h4>ประเภทงาน: {headDetail.type} </h4>
                            <h4>เซ็นสัญญาวันที่:  </h4>
                            <h4>เลขที่สัญญา: {headDetail.contract_id} </h4>
                            <div className="row">
                                <div className="col-4">
                                    <h4>มูลค่างาน: {checkNanDataPrice(headDetail.value.toLocaleString())} บาท</h4>
                                </div>
                                <div className="col-4">
                                    <h4>ส่งมอบงานภายใน: {checkNullDate(headDetail.end_contract_date)} (เหลืออีก {diffTime(headDetail.end_contract_date)} วัน) </h4>
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
                {/* <Link to={`/document/${this.props.tcorp_id}`}><button type="submit" className="btn btn-dark mr-1">เอกสาร</button></Link> */}

                <div className="ml-auto mr-1">
                    <Link to={`/edit-project/${this.props.tcorp_id}`}><button type="submit" className="btn btn-dark mr-1">แก้ไข</button></Link>
                </div>
            </div>
        );
    }

}

export default ComponentProjectTopic;
