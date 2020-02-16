import React from 'react';

import NavSidebar from '../navbar/navSidebar'
import NavTopbar from '../navbar/navTopbar'
import ComponentCreateProduct from './create-products';
import ComponentSearchProduct from './search-products';
import ComponentListProducts from './list-products';

class Products extends React.Component {
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
                        <div><ComponentCreateProduct /></div>
                        <br />

                        <div className=""> 
                            <div><ComponentSearchProduct /></div>
                            <div><ComponentListProducts /></div>
                        </div>

                    </div>
                    {/*  /#Content  */}
                </div>
                {/*  /#page-content-wrapper  */}
                
            </div>
        );
     }
}

export default Products;