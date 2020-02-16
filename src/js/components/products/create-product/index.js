import React from 'react';

import NavSidebar from '../../navbar/navSidebar'
import NavTopbar from '../../navbar/navTopbar'
import ComponentAddProduct from './create-products';

class CreateProduct extends React.Component {
    render() {
        return (
            <div className="d-flex" id="wrapper">
                
                <div><NavSidebar /></div>
                {/* Sidebar  */}
                
                {/*  Page Content  */}
                <div id="page-content-wrapper">
                    <div><NavTopbar /></div>

                    {/*  Content  */}
                    <div className="container-fluid">

                        <div className=""> 
                            <div><ComponentAddProduct /></div>
                        </div>

                    </div>
                    {/*  /#Content  */}
                </div>
                {/*  /#page-content-wrapper  */}
                
            </div>
        );
     }
}

export default CreateProduct;