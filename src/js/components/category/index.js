import React from 'react';

import NavSidebar from '../navbar/navSidebar'
import NavTopbar from '../navbar/navTopbar'
import ListCategoty from './category'

class Category extends React.Component {
    
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
                    
                        <div><ListCategoty /></div>

                    </div>
                    {/*  /#Content  */}
                </div>
                {/*  /#page-content-wrapper  */}
                
            </div>
        );
     }
}

export default Category;