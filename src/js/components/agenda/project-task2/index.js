import React from 'react';

import NavSidebar from '../../navbar/navSidebar'
import NavTopbar from '../../navbar/navTopbar'
import ComponentProjectTopic from '../component-project-topic2'
import TableTasksStatus from './table-tasks'

class ProjectTask extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tcorp_id: this.props.match.params.tcorp_id
        }
    }
    componentDidMount(){
        console.log(`This is tcorp_id: ${JSON.stringify(this.props)}`);
        this.setState({tcorp_id: this.props.match.params.tcorp_id});
    }
    componentWillReceiveProps(nextProps) {
        console.log(`I am receiving next props`, nextProps);
        this.setState({tcorp_id: this.props.match.params.tcorp_id});
    }
    
    render() {
        console.log(`ASPDIOPQWDLKJADS ${this.props.match.params.tcorp_id}`);
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
                        <div><ComponentProjectTopic tcorp_id={this.props.match.params.tcorp_id} id={this.props.location.id}/></div>
                        <div className="row">
                            <div className="col-12">
                                <div><TableTasksStatus timestamp={this.props.timestamp} tcorp_id={this.props.match.params.tcorp_id} id={this.props.location.id}/></div>
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
