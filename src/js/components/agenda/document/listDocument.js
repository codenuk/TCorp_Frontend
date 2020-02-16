import React from 'react';

class ListBoq extends React.Component {

    render() {
        
        return (
            <div>
                <div class="row">
                    <form action="/action_page.php">
                        <button className="btn btn-dark mr-1" type="submit">อัปโหลดไฟล์</button>
                        <input type="file" name="myFile" />
                    </form>
                    <table id="display-table">
                        <thead>
                            <tr style={{ fontSize: "1.4rem"}} className="mt-3">
                                <th>ชื่อไฟท์</th>
                                <th>เจ้าของไฟท์</th>
                                <th>อัพเดตเมื่อ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr onclick="window.location.href = 'pdf/test.pdf';" style={{ cursor: "pointer" }}>
                                <td><h4>ติดตั้งสายไฟ</h4></td>
                                <td><h4>Supagorn</h4></td>
                                <td><h4>2019-11-01</h4></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        );
    }

}

export default ListBoq;