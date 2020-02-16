import React from 'react';

import Topic from './profile-topic'
import Detail from './profile-detail'
import NavSidebar from '../../navbar/navSidebar'
import NavTopbar from '../../navbar/navTopbar'

class ProfileTopic extends React.Component {
    
    render() {

        console.log(`This is tcorp_id: ${JSON.stringify(this.props)}`);
        console.log(`This is username: ${this.props.match.params.username}`);
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
                            <div><Detail username={this.props.match.params.username}/></div>
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






