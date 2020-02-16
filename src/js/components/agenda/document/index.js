import React from 'react';

import NavSidebar from '../../navbar/navSidebar'
import NavTopbar from '../../navbar/navTopbar'
import ComponentProjectTopic from '../component-project-topic2'
import ListDocumenr from './listDocument'

class Boq extends React.Component {
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
                        <div><ComponentProjectTopic tcorp_id={this.props.match.params.tcorp_id}/></div>
                        <div className="row">
                            <div className="col-12 mt-2">
                                <div><ListDocumenr tcorp_id={this.props.match.params.tcorp_id}/></div>
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

export default Boq;