import React from 'react';

import Topic from './profile-topic'
import Detail from './profile-detail'
import NavSidebar from '../navbar/navSidebar'
import NavTopbar from '../navbar/navTopbar'

class ProfileTopic extends React.Component {
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
                        <div><Topic /></div>

                        <div className=""> 
                            <div><Detail /></div>
                        </div>

                    </div>
                    {/*  /#Content  */}
                </div>
                {/*  /#page-content-wrapper  */}
                
            </div>
        )
    };
}


export default ProfileTopic ;






