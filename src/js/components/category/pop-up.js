import React from 'react';

class PopUp extends React.Component {
    
    render() {
        return (
            <div className="modal fade" id="myModal">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content p-3">
        
                        {/*  Modal Header  */}
                        <div className="modal-header">
                            <h4 className="modal-title">เพิ่มหมวดหมู่สินค้า</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
        
                        {/*  Modal body  */}
                        <div className="modal-body">
                            <form>
                                <div className="input-group mb-3 pd-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-0 bg-white">ชื่อหมวดหมู่: </span>
                                    </div>
                                    <input type="text" className="form-control" />
                                    <div className="input-group-append">
                                        <button className="btn btn-secondary px-3" type="submit">ยืนยัน</button>
                                    </div>
                                </div>
                            </form>
        
                            {/*  Modal footer  */}
                            <div className="modal-footer pr-0 pb-0">
                                <button type="button" className="btn btn-secondary"
                                    data-dismiss="modal">Close</button>
                            </div>
        
                        </div>
                    </div>
                </div>
            </div>
        );
     }
}

export default PopUp;