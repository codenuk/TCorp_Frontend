import React from 'react';

import ComponentUserManagementTopic from './user-managment-topic'
import ComponentUserManagement from './user-managment'
import NavSidebar from '../navbar/navSidebar'
import NavTopbar from '../navbar/navTopbar'

class UserManagement extends React.Component {
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
                        <div><ComponentUserManagementTopic /></div>
                        <div className="row">
                            <div className="col-12">
                                <div><ComponentUserManagement /></div>
                            </div>
                        </div>
                    </div>
                    {/*  /#Content  */}
                </div>
                {/*  /#page-content-wrapper  */}

            </div>
        )
    };
}


export default UserManagement;