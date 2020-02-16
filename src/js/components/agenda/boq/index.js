import React from 'react';

import NavSidebar from '../../navbar/navSidebar'
import NavTopbar from '../../navbar/navTopbar'
import ComponentProjectTopic from '../component-project-topic2'
import ListBoq from './list-boq'
// import ListBoq2 from './list-boq2'

class Boq extends React.Component {
    render() {
        console.log(`This is tcorp_id: ${JSON.stringify(this.props)}`);
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
                        <div><ComponentProjectTopic tcorp_id={this.props.match.params.tcorp_id} boq_id={this.props.match.params.boq_id}/></div>
                        <div className="row">
                            <div className="col-12 mt-2">
                                <div><ListBoq tcorp_id={this.props.match.params.tcorp_id} boq_id={this.props.match.params.boq_id}/></div>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="col-12 mt-2">
                                <div><ListBoq2 tcorp_id={this.props.match.params.tcorp_id} boq_id={this.props.match.params.boq_id}/></div>
                            </div>
                        </div> */}
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
