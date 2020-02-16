import React from 'react';

import '../../../css/bootstrap.css';
import '../../../css/adjust_bootstrap.css';
import '../../../vendor/fontawesome-free/css/all.css';
import '../../../css/mystyles.css';

class ComponentProjectOverview extends React.Component {

    render() {

        return (
            
                <div className="row">
                    <div className="col-12">
                        <h4 className="T-Corporation-CoLt">T Corporation Co., Ltd</h4>
                        <h2 className="Projects line_under_Projects">Projects</h2>
                        <i className="fas fa-sliders-h sizeIcon-12"></i><span className="Filter">Filter</span>
                        <i className="fas fa-sort-amount-down-alt sizeIcon-12" ></i><span className="Filter">Sort</span>
                    </div>
                </div>

        )
    };
}


export default ComponentProjectOverview ;






