import React from 'react';

import NavSidebar from '../../navbar/navSidebar'
import NavTopbar from '../../navbar/navTopbar'
import ComponentProjectTopic from '../component-project-topic'
import TableTasksStatus from '../project-task/table-tasks'

class ProjectTask extends React.Component {
    render() {
        return (
            <div className="d-flex" id="wrapper">
                {/* #sidebar-wrapper  */}
                <div><NavSidebar /></div>
                {/* Sidebar  */}

                {/* Page Content  */}
                <div id="page-content-wrapper">
                    <div><NavTopbar /></div>

                    {/* Content  */}
                    <div className="container-fluid">
                        <div><ComponentProjectTopic /></div>
                        <div className="row">
                            <div className="col-12">
                                <div><TableTasksStatus /></div>
                            </div>
                        </div>
                    </div>
                    {/* /#Content  */}
                </div>
                {/* /#page-content-wrapper  */}

            </div>
            // /#wrapper 
        );
    }

}

export default ProjectTask;