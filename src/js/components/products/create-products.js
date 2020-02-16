import React from 'react';
import { Link } from 'react-router-dom'

import '../../../vendor/bootstrapv2/bootstrap.css';
import '../../../css/adjust_bootstrap.css';
import '../../../vendor/fontawesome-free/css/all.css';
import '../../../css/mystyles.css';

class ComponentCreateProduct extends React.Component {
    

    render() {

        return (
            
            <div>
               <div className="row">
                    <div className="col-6">
                        <h3 className="d-inline">สินค้า</h3>
                    </div>
                    <div className="col-6 text-right">
                        <button type="button" className="btn btn-secondary mb-2"><Link to="/category" className='text-white-50'>หมวดหมู่สินค้า</Link></button>
                    </div>
                </div>
                <div className="Createproducts">
                    <div className="card-header">
                        <h4>เพิ่มสินค้า:</h4>
                    </div>
                    <div className="card-body p-4">
                        <form>
                            <div className="form-group row">
                                <label for="staticEmail" className="col-sm-2 col-form-label-lg">รหัสสินค้า</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputPassword" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="inputPassword" className="col-sm-2 col-form-label-lg">รายละเอียดสินค้า</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputPassword" /> 
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="inputPassword" className="col-sm-2 col-form-label-lg">หมวดหมู่สินค้า</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputPassword" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="inputPassword" className="col-sm-2 col-form-label-lg">ยี่ห้อ</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputPassword" />
                                </div>
                            </div>
                            <div className="text-right mb-3">
                            <button type="button" className="btn btn-warning ">บันทึก</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    };
}


export default ComponentCreateProduct ;






