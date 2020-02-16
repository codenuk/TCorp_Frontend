import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom'

class TableTasksStatus extends React.Component {

    state = {
        tasks: [],
        users: [],
        taskStatuses: [],
        isTokenValid: true,
    }

    async getData() {
        console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var tasks = await axios.get(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.tcorp_id}/tasks`, { headers: { 'x-access-token': token_auth } })
        var users = await axios.get(`http://vanilla-erp.com:10000/api/v1/users/`, { headers: {'x-access-token': token_auth}})
        var taskStatuses = await axios.get(`http://vanilla-erp.com:10000/api/v1/tasks_status/`, { headers: {'x-access-token': token_auth}})
        tasks = tasks.data;
        users = users.data;
        taskStatuses = taskStatuses.data;
        console.log("THIS IS FROM GET DATA tasks", tasks);
        console.log("THIS IS FROM GET DATA users", users);
        console.log("THIS IS FROM GET DATA users", taskStatuses);
        return await {tasks:tasks, users:users, taskStatuses:taskStatuses};
    }

    /*
    .then(res => {
        const tasks = res.data;
        this.setState({ tasks: tasks, isTokenValid: true });
    })
    .catch(function (err) {
        current.setState({ isTokenValid: false });
    });

    .then(res => {
        const users = res.data;
        console.log(users);
        this.setState({ users: users, isTokenValid: true });
    })
    .catch(function(err){
        current.setState({isTokenValid: false});
    });*/

    componentDidMount() {
        console.log(`This is TABLE TASK id: ${JSON.stringify(this.props)}`);
        var current = this;
        this.getData().then(function(data){
            var {users, tasks, taskStatuses} = data; //https://dev.to/sarah_chima/object-destructuring-in-es6-3fm
            console.log("COMPONENTDIDMOUNT users", users);
            console.log("COMPONENTDIMOUNT tasks", tasks);
            current.setState({ users:users , tasks: tasks, taskStatuses:taskStatuses, isTokenValid: true });
        }).catch(function(err) {
            console.log(err);
            current.setState({isTokenValid: false});
        });

    }

    generateTableRow(task, isHeader=false){
        return (
            <tr ondrop="drop(event)" ondragover="allowDrop(event)">
                {/* Grip Icon */}
                <td draggable="true" ondragstart="drag(event)"><i className="fas fa-grip-vertical icon"></i></td>

                {/* Grouping Arrow */}
                <td>{isHeader ? (<i className="fas fa-caret-down icon-movement" onclick="myFunction(event)"></i>) : null}</td>

                {/* Task Descriptions */}
                <td colspan="5">
                    <input type="text" className="form-control input-task" onkeyup="createNewRow(event)" onchange="saveValueAuto(event)" value={task.task_header} id={`HEAD ${task.seq_no}`} />
                </td>
            </tr>
        )
    }

    generateProjectTasks() {

        let table = []
        var prevTaskGroupId = -1;
        console.log('THIS IS FROM OUTSIDE');
        console.log(this.state.users);
        var current = this;
        this.state.tasks.map(function (task) {
            if (task.task_group_id !== prevTaskGroupId){
                prevTaskGroupId = task.task_group_id;
                table.push(current.generateTableRow(task, true))
            }
            table.push(
                <tr ondrop="drop(event)" ondragover="allowDrop(event)">
                    <td draggable="true" ondragstart="drag(event)">
                        <i className="fas fa-grip-vertical icon"></i>
                    </td>
                    <td></td>
                    <td><input type="text" className="" onkeyup="createNewRow(event)" onchange="saveValueAuto()" value={task.description} id={task.seq_no} /></td>
                    <td>
                        <select className="form-control form-control-lg">
                            {current.state.users.map(function(user, i){
                                if(task.firstname === user.firstname) return <option selected="selected" key={i}>{user.firstname}</option>;
                                return <option key={i}>{user.firstname}</option>;
                            })}
                        </select>
                    </td>

                    <td><input type="date" className="" name="bday" value={task.deadline.substring(0,10)} /></td>

                    {/* UPDATED_AT is still not full!! */}
                    <td><input type="date" className="" name="bday" value={task.deadline.substring(0,10)} /></td>

                    <td> 
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {task.status}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {current.state.taskStatuses.map(function(status, i){
                                return <button className="dropdown-item" to="#">{status.status}</button>;
                                })}
                            </div>
                        </div>
                    </td>
                </tr>
            )
            return null; 
        });
        return table
    }


    render() {
        if (!this.state.isTokenValid){
            return <Redirect to='/' />
        }

        return (
            <div className="row">
                <table id="display-table">
                    <thead>
                        <tr>
                            <th>&nbsp; </th>
                            <th>&nbsp;&nbsp;</th>
                            <th>ภารกิจ</th>
                            <th>ผู้รับผิดชอบ</th>
                            <th>กำหนดส่ง</th>
                            <th>อัพเดตเมื่อ</th>
                            <th>สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.generateProjectTasks()}
                        <div className="mb-5"></div>
                    </tbody>
                </table>
            </div>
        );
    }

}

export default TableTasksStatus;
