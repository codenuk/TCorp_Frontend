import React from 'react';
import { Link } from 'react-router-dom'

import '../../../css/_list_Category.css';

class ListCategory extends React.Component {

    // FilterSelection First Column
    filterSelection(c) {
        var x, i;
        x = document.getElementsByClassName("filterDiv");
        if (c === "all") c = "";
        for (i = 0; i < x.length; i++) {
            this.w3RemoveClass(x[i], "show")
            if (x[i].className.indexOf(c) > -1) 
                this.w3AddClass(x[i], "show") 
            ;
        }
    };

    w3AddClass(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            if (arr1.indexOf(arr2[i]) === -1) { element.className += " " + arr2[i]; }
        }
    };

    w3RemoveClass(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            while (arr1.indexOf(arr2[i]) > -1) {
                arr1.splice(arr1.indexOf(arr2[i]), 1);
            }
        }
        element.className = arr1.join(" ");
    }

    filterSelection2(c) {
        var x, i;
        x = document.getElementsByClassName("filterDiv2");
        if (c === "all") c = "";
        for (i = 0; i < x.length; i++) {
            this.w3RemoveClass2(x[i], "show") ;
            if (x[i].className.indexOf(c) > -1) { this.w3AddClass2(x[i], "show") };
        }
    }

    w3AddClass2(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            if (arr1.indexOf(arr2[i]) === -1) { element.className += " " + arr2[i]; }
        }
    }

    w3RemoveClass2(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
            while (arr1.indexOf(arr2[i]) > -1) {
                arr1.splice(arr1.indexOf(arr2[i]), 1);
            }
        }
        element.className = arr1.join(" ");
    }

    render() {
        return (
            <div>
                <h3>รายการหมวดหมู่สินค้า</h3>
                <div className="row">
                    {/* Fisrt Column  */}
                    <div className="col-xxl-4 col-xl-6 border pb-4 pl-4" style={{ fontSize: "1.4rem" }}>
                        {/* Actual search box  */}
                        <div className="form-group has-search d-inline " >
                            <span className="fa fa-search form-control-feedback mt-2"></span>
                            <input type="text" className="form-control w-75 d-inline my-2" placeholder="Search" />

                            <button className="btn btn-secondary mx-1 " type="button" data-toggle="modal"
                                data-target="#myModal">
                                <i className="fas fa-plus"></i>
                            </button>
                            <button className="btn btn-secondary mx-1 " type="button">
                                <i className="fas fa-minus"></i>
                            </button>
                        </div>
                        {/* End search  */}

                        <div className="list-group">
                            <Link to="#" className="list-group-item list-group-item-action border-0"
                                onclick={this.filterSelection('wire')}>สายไฟ</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0"
                                onclick={this.filterSelection('harddisk')}>ฮาสดิส</Link>

                        </div>
                    </div>
                    {/* End First Column  */}

                    {/* <!-- Second Column --> */}
                    <div className="col-xxl-4 col-xl-6 border pb-4 pl-4" style={{ fontSize: "1.4rem" }}>
                        {/* <!-- Actual search box --> */}
                        <div className="form-group has-search d-inline ">
                            <span className="fa fa-search form-control-feedback mt-2"></span>
                            <input type="text" className="form-control w-75 d-inline my-2" placeholder="Search" />

                            <button className="btn btn-secondary mx-1 " type="button" data-toggle="modal"
                                data-target="#myModal">
                                <i className="fas fa-plus"></i>
                            </button>
                            <button className="btn btn-secondary mx-1 " type="button">
                                <i className="fas fa-minus"></i>
                            </button>
                        </div>
                        {/* <!-- End search --> */}

                        <div className="list-group">
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv wire" onclick={this.filterSelection2('wire1')}>สายไฟ1</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv wire" onclick={this.filterSelection2('wire2')}>สายไฟ2</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv wire" onclick={this.filterSelection2('wire3')}>สายไฟ3</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv harddisk" onclick="filterSelection2('harddisk1')">ฮาสดิส1</Link>
                        </div>
                    </div>
                    {/* <!-- End Second Column --></div> */}

                    {/* <!-- Third Column --> */}
                    <div className="col-xxl-4 col-xl-6 border pb-4 pl-4" style={{ fontSize: "1.4rem" }}>
                        {/* <!-- Actual search box --> */}
                        <div className="form-group has-search d-inline ">
                            <span className="fa fa-search form-control-feedback mt-2"></span>
                            <input type="text" className="form-control w-75 d-inline my-2" placeholder="Search" />

                            <button className="btn btn-secondary mx-1 " type="button" data-toggle="modal"
                                data-target="#myModal">
                                <i className="fas fa-plus"></i>
                            </button>
                            <button className="btn btn-secondary mx-1 " type="button">
                                <i className="fas fa-minus"></i>
                            </button>
                        </div>
                        {/* <!-- End search --> */}

                        <div className="list-group">
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv2 wire1">wire1/1</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv2 wire1">wire1/2</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv2 wire1">wire1/3</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv2 wire2">wire2/1</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv2 wire3">wire3/2</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv2 wire3">wire3/3</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv2 harddisk1">harddisk1/1</Link>
                            <Link to="#" className="list-group-item list-group-item-action border-0 filterDiv2 harddisk1">harddisk1/2</Link>
                        </div>
                    </div>
                    {/* <!-- End Third Column --> */}
                </div>
            </div>
        );
    }
}

export default ListCategory;