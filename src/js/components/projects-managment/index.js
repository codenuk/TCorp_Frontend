import React from 'react';

import NavSidebar from '../navbar/navSidebar'
import NavTopbar from '../navbar/navTopbar'
import ComponentProjectCards from './project_card';
import ComponentProjectOverview from './project_overview';

class ProjectOverview extends React.Component {
    render() {
	console.log('hello!!');
        console.log(`This is tcorp_id: ${JSON.stringify(this.props)}`);
        return (
            <div className="d-flex" id="wrapper">
                
                <div><NavSidebar /></div>
                {/* Sidebar  */}

                {/*  Page Content  */}
                <div id="page-content-wrapper">
                    <div><NavTopbar /></div>

                    {/*  Content  */}
                    <div className="container-fluid">
                        <div><ComponentProjectOverview /></div>
                        {/* <div className="">  */}
                            <ComponentProjectCards />
                        {/* </div> */}

                    </div>
                    {/*  /#Content  */}
                </div>
                {/*  /#page-content-wrapper  */}
                
            </div>
        );
     }
}

export default ProjectOverview;
