import React from 'react';
import { Link } from 'react-router-dom'

import '../../../vendor/bootstrapv2/bootstrap.css';
import '../../../css/adjust_bootstrap.css';
import '../../../vendor/fontawesome-free/css/all.css';

class ComponentListProduct extends React.Component {

    createFakeData = () => {

        let table = []
        
        var myArray = [
            { project_id: "T1901", location: "งานจ้างเหมาติดตั้งอุปกรณ์ ในพื้นที่ บน.1.1", status: "info", progress: "50%", company: "TOT", color: "#e33232"},
            { project_id: "T1902", location: "งานจ้างเหมาติดตั้งอุปกรณ์ ในพื้นที่ บน.1.1", status: "warning", progress: "80%", company: "CAT", color: "#3cb371"},
            { project_id: "T1903", location: "งานจ้างเหมาติดตั้งอุปกรณ์ ในพื้นที่ บน.1.1", status: "success", progress: "100%", company: "TOT", color: "#ffa500"},
            { project_id: "T1904", location: "งานจ้างเหมาติดตั้งอุปกรณ์ ในพื้นที่ บน.1.1", status: "warning", progress: "80%", company: "TOT", color: "#e33232"},
            { project_id: "T1905", location: "งานจ้างเหมาติดตั้งอุปกรณ์ ในพื้นที่ บน.1.1", status: "success", progress: "100%", company: "CAT", color: "#ffa500"},
            { project_id: "T1906", location: "งานจ้างเหมาติดตั้งอุปกรณ์ ในพื้นที่ บน.1.1", status: "danger", progress: "10%", company: "TOT", color: "#e33232"},
        
        ];
        
        for (var i=0; i<myArray.length; i++) {
            var index_row = i + 1;
            table.push(

                <tr>
                    <td>{index_row}</td>
                    <td>H80Z4MABC</td>
                    <td>ETSI Service Shelf,48V/60V,4-Fan</td>
                    <td>สายไฟ</td>
                    <td>Yamazaki</td>
                    <td>
                        <Link to="#" className="btn btn-danger">ลบ</Link>
                        <Link to="edit-project-detail.html" className="btn btn-warning">แก้ไข</Link>
                    </td>
                </tr>

            )
            
        }
        return table
        
    }
    

    render() {

        return (
            
            
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
                            {this.createFakeData()}
                            <div className="mb-5"></div>
                        </tbody>
                    </table> 

                </div>
            
        )
    };
}


export default ComponentListProduct ;






