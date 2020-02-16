import React from 'react';
import { Link } from 'react-router-dom'

import '../../../vendor/bootstrapv2/bootstrap.css';
import '../../../css/adjust_bootstrap.css';
import '../../../vendor/fontawesome-free/css/all.css';

class ComponentSearchProduct extends React.Component {
    

    render() {

        return (
            
            
                <div className="row py-3">

                    <div className="col-9">
                        <div className="dropdown">
                            <Link className="btn btn-secondary dropdown-toggle" to="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                ตัวกรอง
                            </Link>
                            
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <Link className="dropdown-item" to="#">หมวดหมู่</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <form className="">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="ค้นหา" />
                        </form>
                    </div>
                    
                </div>
            
        )
    };
}


export default ComponentSearchProduct ;

