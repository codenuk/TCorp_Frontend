import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios';

class CreateProductBoq extends React.Component {

    state = {
        products_id: '', 
        qty: '',
        status_orders_id: 1, //Must have
        bill_of_quantity_id: this.props.location.state.bill_of_quantity_id, //Must have
        isFinish: false
    }

    handleChangeProductsId = event => {
        this.setState({ products_id: event.target.value });
    }

    handleChangeQty = event => {
        this.setState({ qty: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        console.log("handleSubmit")

        const create = {
            "products_id": this.state.products_id,
            "qty": this.state.qty,
            "status_orders_id": this.state.status_orders_id,
            "bill_of_quantity_id": this.state.bill_of_quantity_id
        };
        console.log(":: project", create)

        axios.post(`http://vanilla-erp.com:10000/api/v1/boqs/line_item`, create, {headers: {"x-access-token": localStorage.getItem('token_auth')}})
            .then(res => {
                console.log(">>>>>>>>>>>this post",res);
                console.log("bill_of_quantity_id",this.state.bill_of_quantity_id)
                this.setState({isFinish: true});
            }).catch(function(err) {
                console.log(err);
                this.setState({isFinish: false});
            })
    }

    render() {
        console.log(`This is tcorp_id: ${JSON.stringify(this.props)}`);
        console.log(`This is tcorp_id: ${this.props.location.state.tcorp_id}`);

        var tcorp_id = this.props.location.state.tcorp_id;
        if (this.state.isFinish === true ){
            return <Redirect to={`/boq/${tcorp_id}/1`}/> 
        }
        return (
            <div>
                <>
                    <Link to={`/boq/${tcorp_id}/1`}><i className="IconClosePage fas fa-times"></i></Link>
                    <div className="container" style={{ paddingTop: "50px", paddingRight: "15%" }} >
                        <h1>เพิ่มสินค้า:</h1>

                        {/* TEAM PM */}
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <h4>เลขที่สินค้า:</h4>
                                <input type="text" className="form-control" onChange={this.handleChangeProductsId} placeholder="" required/>
                            </div>
                            <div className="form-group">
                                <h4>จำนวน : </h4>
                                <input type="text" className="form-control" onChange={this.handleChangeQty} placeholder="" required/>
                            </div>
                            <div className="row">
                                <button type="submit" class="btn btn-secondary ml-auto mr-0">ยืนยัน</button>
                            </div>
                        </form>
                        {/*  */}

                    </div>
                </>
            </div>
        );
    }

}

export default CreateProductBoq;