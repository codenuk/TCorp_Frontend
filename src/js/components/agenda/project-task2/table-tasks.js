import React from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Redirect } from 'react-router-dom'

import { API_URL_DATABASE } from '../../../config_database.js';

const moment = require('moment');
class TableTasksStatus extends React.Component {
    // Define State and Props
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            users: [],
            taskStatuses: [],
            userInfo: [],
            isTokenValid: true,
            dragFromRow: 0,
            dropToRow: 0,
            tcorp_id: this.props.tcorp_id //THIS IS NOT NEEDED, WILL RECEIVE IS ENOUGH
        }

        this.onTaskChange = this.onTaskChange.bind(this);
        this.dragHandler = this.dragHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.dragAndDropHandler = this.dragAndDropHandler.bind(this);
        this.createNewRowTaskByButton = this.createNewRowTaskByButton.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.onConfirmTask = this.onConfirmTask.bind(this);

    }

    // Get Data
    getData(tcorp_id) {
        return new Promise((resolve, reject) => {
            // Get JWT from localStorage
            var token_auth = localStorage.getItem('token_auth');
            var decoded = jwt_decode(token_auth);
            var username = decoded.username;

            // Get data from database
            axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${tcorp_id}/tasks`, { headers: { 'x-access-token': token_auth } })
                .then(tasks => {
                    axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/users/`, { headers: { 'x-access-token': token_auth } })
                        .then(users => {
                            axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/tasks_status/`, { headers: { 'x-access-token': token_auth } })
                                .then(taskStatuses => {
                                    axios.get(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/users/${username}`, { headers: { 'x-access-token': token_auth } })
                                        .then(userInfo => {
                                            tasks = tasks.data;
                                            for (var i = 0; i < tasks.length; i++) {
                                                tasks[i].updated_at = moment(tasks[i].updated_at).utcOffset('+0000').format('YYYY-MM-DD HH:mm:ss');
                                            }
                                            users = users.data;
                                            taskStatuses = taskStatuses.data;
                                            userInfo = userInfo.data;

                                            resolve({ tasks: tasks, users: users, taskStatuses: taskStatuses, userInfo: userInfo });
                                        });
                                });
                        });
                }).catch(reject);
        });
    }

    // componentDidMount
    componentDidMount() {
        // console.log(`This is TABLE TASK tcorp_id: ${JSON.stringify(this.props)}`);
        var current = this;
        this.getData(this.props.tcorp_id).then(function (data) {
            var { users, tasks, taskStatuses, userInfo } = data; //https://dev.to/sarah_chima/object-destructuring-in-es6-3fm
            current.setState({ users: users, tasks: tasks, taskStatuses: taskStatuses, userInfo: userInfo, isTokenValid: true });
        }).catch(function (err) {
            console.log(err);
            current.setState({ isTokenValid: false });
        });
        this.setState({ tcorp_id: this.props.tcorp_id });

    }

    // componentWillReceiveProps
    componentWillReceiveProps(nextProps) {
        //console.log(`NEXT PROP IN TABLETASK ${JSON.stringify(nextProps)}`);
        var current = this;
        this.getData(nextProps.tcorp_id).then(function (data) {
            var { users, tasks, taskStatuses, userInfo } = data; //https://dev.to/sarah_chima/object-destructuring-in-es6-3fm
            current.setState({ users: users, tasks: tasks, taskStatuses: taskStatuses, userInfo: userInfo, isTokenValid: true });
        }).catch(function (err) {
            console.log(err);
            current.setState({ isTokenValid: false });
        });
        this.setState({ tcorp_id: nextProps.tcorp_id });
    }


    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    //     taken from: Underscore.js https://underscorejs.org/#debounce
    debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    }

    onConfirmTask(event) {
        if (window.confirm('คุณต้องการเปลี่ยนสถานนี้หรือไม่ ?')) {
            let tableRowNode = event.target.parentNode.parentNode;
            let seq_no = tableRowNode.id.split("-")[1];
            axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.tcorp_id}/tasks/${seq_no}`,
                { 'confirm_task': 1 },
                { headers: { 'x-access-token': localStorage.getItem('token_auth') } })
                .then(res => {
                    this.state.tasks[seq_no]['confirm_task'] = 1;
                    this.setState({ tasks: this.state.tasks, isFinish: true });
                }).catch(function (err) {
                    console.log(err);
                })
        }
    }

    // 1. PUT task 
    // 2. Update state of 'tasks' of 'seq_no' in the node's 'id' BY reading <tr> tablerow
    //      if (updated not have id) : this function will insert datat to table `task` 
    onTaskChange(event) {
        // Check if id matches the Regex, and Capture Group 1 (the sequence number)
        // Split "-" for seed (the sequence number)
        // console.log("onTaskChange")
        let tableRowNode = event.target.parentNode.parentNode;
        let seq_no = tableRowNode.id.split("-")[1];
        if (seq_no) {
            // Get all Input Parameters: description, assigned_to_id|firstname, deadline, task_status_id|status
            // NOTE: NEED TO REMOVE EXTRA INFO EXCEPT FOR ID!!
            let inputs = {
                'task-description': 'description', //mapping of className -> database fields
                'task-assigned-to': 'assigned_to_id',
                'task-deadline': 'deadline',
                'task-status': 'task_status_id'
            }
            // console.log("nuk >>>>>>>>>>>", inputs)
            Object.keys(inputs).map(function (key, index) {
                // console.log(event.target.classList)
                if (event.target.classList.contains(key)) {
                    // this.state.tasks[seq_no][inputs[key]] = event.target.value;
                    // console.log({ [inputs[key]]: `${event.target.value}` });
                    // console.log({ [`${inputs[key]}`]: event.target.value});

                    if (key === "task-deadline") {
                        // console.log("IN", event.target.value)
                        if (event.target.value.length <= 10) {
                            this.state.tasks[seq_no][inputs[key]] = event.target.value;
                            // console.log("IN IN", event.target.value)
                            this.debounce(axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.tcorp_id}/tasks/${seq_no}`,
                                { [`${inputs[key]}`]: event.target.value },
                                { headers: { 'x-access-token': localStorage.getItem('token_auth') } })
                                .then(async res => {
                                    if (inputs[key] === "task_status_id") {
                                        this.state.tasks[seq_no]['updated_at'] = res.data.updated_at;
                                        // console.log("res.data.updated_at", res.data.updated_at)
                                        this.setState({ tasks: this.state.tasks });
                                    }
                                    this.setState({ isFinish: true });
                                }).catch(function (err) {
                                    console.log(err);
                                }), 1000);
                        }
                        if(event.target.value.length >= 11) {
                            this.debounce(axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.tcorp_id}/tasks/${seq_no}`,
                                { [`${inputs[key]}`]: this.state.tasks[seq_no][inputs[key]] },
                                { headers: { 'x-access-token': localStorage.getItem('token_auth') } })
                                .then(async res => {
                                    if (inputs[key] === "task_status_id") {
                                        this.state.tasks[seq_no]['updated_at'] = res.data.updated_at;
                                        // console.log("res.data.updated_at", res.data.updated_at)
                                        this.setState({ tasks: this.state.tasks });
                                    }
                                    this.setState({ isFinish: true });
                                }).catch(function (err) {
                                    console.log(err);
                                }), 1000);
                        }
                    }
                    else{
                        this.state.tasks[seq_no][inputs[key]] = event.target.value;
                        this.debounce(axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.tcorp_id}/tasks/${seq_no}`,
                            { [`${inputs[key]}`]: event.target.value },
                            { headers: { 'x-access-token': localStorage.getItem('token_auth') } })
                            .then(async res => {
                                if (inputs[key] === "task_status_id") {
                                    this.state.tasks[seq_no]['updated_at'] = res.data.updated_at;
                                    // console.log("res.data.updated_at", res.data.updated_at)
                                    this.setState({ tasks: this.state.tasks });
                                }
                                this.setState({ isFinish: true });
                            }).catch(function (err) {
                                console.log(err);
                            }), 1000);
                    }
                    /*this.debounce(axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.tcorp_id}/tasks/${seq_no}`, 
                        { `${inputs[key]}`: `${event.target.value}`}, 
                        { headers: {'x-access-token': localStorage.getItem('token_auth')}})
                    , 1000); // debounce an async function (not await return) 1 s */
                }
            }, this); //bind map to this
            this.setState({ tasks: this.state.tasks });
        }
    }

    // dragHandler
    async dragHandler(ev) {
        await this.setState({ dragFromRow: ev.target.parentElement.rowIndex });
    }

    // allowDropHandler
    async allowDropHandler(ev) {
        await ev.preventDefault();
    }

    // dropHandler
    async dropHandler(ev) {
        ev.preventDefault();
        await this.setState({
            dropToRow: ev.currentTarget.rowIndex
        });
        if (this.state.dragFromRow !== this.state.dropToRow && this.state.dropToRow !== undefined) {
            await this.dragAndDropHandler();
        }
    }

    async dragAndDropHandler() {
        // console.log("dragAndDropHandler", this.state.tasks)
        var dragIndex = this.state.dragFromRow - 1;
        var dropIndex = this.state.dropToRow - 1;
        let bufferTask = { ...this.state.tasks[dragIndex] };

        // Remove 1 element from dragIndex
        this.state.tasks.splice(dragIndex, 1);

        // Remove 0, and Insert bufferTask to dropIndex
        this.state.tasks.splice(dropIndex, 0, bufferTask)

        var groupNo = 0;
        for (var i = 0; i < this.state.tasks.length; i++) {
            this.state.tasks[i]['seq_no'] = i;
            // console.log("is_header", this.state.tasks[i]['is_header']);
            if (this.state.tasks[i]['is_header'] === 1) {
                groupNo += 1;
            }
            // console.log(">>>>", this.state.tasks[i])
            this.state.tasks[i]['group_no'] = groupNo;
            var newTask = {
                "seq_no": this.state.tasks[i]['seq_no'],
                "group_no": this.state.tasks[i]['group_no'],
                "task_status_id": this.state.tasks[i]['task_status_id'],
                "assigned_to_id": this.state.tasks[i]['assigned_to_id'],
                "description": this.state.tasks[i]['description'],
                "deadline": "2019-08-14",
                "updated_at": this.state.tasks[i]['updated_at'],
                "tcorp_id": this.props.tcorp_id,
                "is_header": this.state.tasks[i]['is_header'],
                "ui_group_task": "down",
                "confirm_task": this.state.tasks[i]['confirm_task'],
                "action": "dragAndDropHandler"
            };
            // console.log("newTask", this.state.tasks[i]['seq_no'], this.state.tasks[i]['description'], this.state.tasks[i]['confirm_task'], this.state.tasks[i]['task_status_id']);
            // Update Task follow to seq_no
            axios.put(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.tcorp_id}/tasks/${this.state.tasks[i]['seq_no']}`,
                newTask,
                { headers: { 'x-access-token': localStorage.getItem('token_auth') } });
        }
        // console.log("this.state.tasks", this.state.tasks)
        this.setState({ tasks: this.state.tasks })
    }

    deleteTask(ev) {
        var tableRowNode = ev.currentTarget.parentNode.parentNode;
        var seqNoTask = tableRowNode.id.split("-")[1];

        var token_auth = localStorage.getItem('token_auth');
        axios.delete(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/${this.props.tcorp_id}/tasks/${seqNoTask}   
            `, { headers: { 'x-access-token': token_auth } })
            .then(res => {
                //console.log("After Delete>>", seqNoTask, this.state.tasks[i]['seq_no'], this.state.tasks[i]['description']);
                // Delete Task from seqNo
                this.state.tasks.splice(seqNoTask, 1);
                this.state.tasks.map(function (task, index) {
                    if (index >= seqNoTask) {
                        this.state.tasks[index].seq_no -= 1;
                    }
                }, this);
                this.setState({ tasks: this.state.tasks })
            })
    }

    generateTableRow(task, isHeader = false) {
        // console.log("> task >", task)
        // console.log("> this.state.userInfo.id", this.state.userInfo)
        if (this.state.userInfo[0].name === "Admin" || this.state.userInfo[0].name === "Project Management") {
            // Permission for 'Admin' && 'Project Management'
            return (
                <tr key={isHeader ? `task-head-${task.group_no}.${task.seq_no}` : `task-${task.seq_no}`} id={isHeader ? `task-head-${task.seq_no}` : `task-${task.seq_no}`} onDrop={this.dropHandler} onDragOver={this.allowDropHandler} >
                    {/* Grip Icon */}
                    <td draggable="true" onDragStart={this.dragHandler}><i className="fas fa-grip-vertical icon"></i></td>
                    {/* Grouping Arrow */}
                    <td>{isHeader ? (<i className={`fas fa-caret-${task.ui_group_task} icon-movement`} onClick={this.sectionCollapse} ></i>) : null}</td>

                    {/* Task Descriptions */}
                    {isHeader ? (
                        <td colSpan="7">
                            <p style={{ margin: 0 }}>{task.description}</p>
                            {/* { console.log("task.updated_at", task.updated_at, task.description, task.status)} */}
                        </td>) : (
                            <>
                                <td>{task.confirm_task ? <p style={{ margin: 0 }}>{task.description}</p> :
                                    <input type="text" className="form-control input-task task-description" onChange={this.onTaskChange} value={task.description} />}</td>
                                <td>
                                    {task.confirm_task ? <p style={{ margin: 0 }}>{task.firstname}</p> :
                                        <select className="form-control form-control-lg task-assigned-to" onChange={this.onTaskChange} value={task.assigned_to_id}>
                                            {this.state.users.map(function (user, i) {
                                                return <option key={user.id} value={user.id}>{user.firstname}</option>;
                                            })}
                                        </select>
                                    }
                                </td>

                                {/* DEADLINE */}
                                {/* { console.log("task.updated_at", task.updated_at, task.description, task.status)} */}
                                {/* { console.log("task.deadline", task.deadline, task.description, task.status, task.updated_at, moment(task.updated_at).utcOffset('+0000').format('YYYY-MM-DD HH:mm:ss'))} */}
                                <td>
                                    {task.confirm_task ? <p style={{ margin: 0 }}>{task.deadline.substring(0, 10)}</p> :
                                        <input type="date" onChange={this.onTaskChange} className="form-control input-task task-deadline" name="bday" value={task.deadline != null ? task.deadline.substring(0, 10) : "2019-08-14T00:00:00.000Z"} />
                                    }
                                </td>

                                {/* UPDATED_AT is still not full!! */}
                                <td><p className="form-control input-task task-updated-at" style={{ margin: 0 }}>{task.updated_at != null ? moment(task.updated_at).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss') : moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss')}</p> </td>

                                <td>
                                    {task.confirm_task ? <p style={{ margin: 0 }}>{task.status}</p> :
                                        <select className="form-control form-control-lg task-status" onChange={(e) => { if (window.confirm('คุณต้องการเปลี่ยนสถานนี้หรือไม่ ?')) this.onTaskChange(e) }} value={task.task_status_id}>
                                            {this.state.taskStatuses.map(function (status, i) {
                                                return <option key={status.id} value={status.id}>{status.status}</option>;
                                            })}
                                        </select>
                                    }
                                </td>
                                <td>
                                    {task.confirm_task ? <button className="btn btn-success">ยืนยันสถานะ</button> :
                                        task.task_status_id === 2 ? <button className="btn btn-warning" onClick={this.onConfirmTask}>รอยืนยัน</button> : <button className="btn btn-warning">รอยืนยัน</button>}
                                </td>
                                <td><button onClick={(e) => { if (window.confirm('คุณต้องการลบ Task นี้หรือไม่ ?')) this.deleteTask(e) }} className="btn"><i className="fas fa-trash icon" style={{ fontSize: "1rem" }}></i></button></td>
                            </>

                        )}
                </tr>
            )
        }
        else {
            // Permission follow to assigned
            return (
                <tr key={isHeader ? `task-head-${task.group_no}.${task.seq_no}` : `task-${task.seq_no}`} id={isHeader ? `task-head-${task.seq_no}` : `task-${task.seq_no}`} onDrop={this.dropHandler} onDragOver={this.allowDropHandler} >
                    {/* Grip Icon */}
                    <td><i className="fas fa-grip-vertical icon"></i></td>

                    {/* Grouping Arrow */}
                    <td>{isHeader ? (<i className={`fas fa-caret-${task.ui_group_task} icon-movement`} onClick={this.sectionCollapse} ></i>) : null}</td>

                    {/* Task Descriptions */}
                    {isHeader ? (
                        <td colSpan="7">
                            <p style={{ margin: 0 }}>{task.description}</p>
                        </td>) : (
                            <>
                                <td><p style={{ margin: 0 }}>{task.description} </p></td>
                                <td><p style={{ margin: 0 }}>{task.firstname}</p></td>

                                {/* DEADLINE */}
                                <td><p style={{ margin: 0 }}>{task.deadline != null ? task.deadline.substring(0, 10) : "2019-08-14T00:00:00.000Z"}</p></td>

                                {/* UPDATED_AT is still not full!! */}
                                <td><p style={{ margin: 0 }}>{task.updated_at != null ? moment(task.updated_at).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss') : moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss')}</p> </td>

                                <td>
                                    {task.firstname === this.state.userInfo[0].firstname ?
                                        <select className="form-control form-control-lg task-status" onChange={(e) => { if (window.confirm('คุณต้องการเปลี่ยนสถานนี้หรือไม่ ?')) this.onTaskChange(e) }} value={task.task_status_id}>
                                            {this.state.taskStatuses.map(function (status, i) {
                                                return <option key={status.id} value={status.id}>{status.status}</option>;
                                            })}
                                        </select>
                                        : <p style={{ margin: 0 }}>{task.status}</p>
                                    }
                                </td>
                                <td>
                                    {task.confirm_task ? <button className="btn btn-success">ยืนยันสถานะ</button> : <button className="btn btn-warning">รอยืนยัน</button>}
                                </td>
                            </>

                        )}
                </tr>
            )
        }
    }


    generateProjectTasks() {
        let table = []
        // var prevTaskGroupId = -1;
        // console.log(`This is TABLE TASK id: ${this.props.id}`);
        // console.log(this.state.tasks);
        // console.log('THIS IS FROM OUTSIDE');
        var current = this;
        this.state.tasks.map(function (task, index) {
            if (task.is_header === 1) {
                table.push(current.generateTableRow(task, true));
            }
            else {
                table.push(current.generateTableRow(task, false));
            }
        });
        return table;
    }

    // Create New Row (Task), but don't INSERT to database
    // It will INSERT when change the new TextBox.
    async createNewRowTaskByButton() {
        // TASK: group_no, seq_no, ui_group_task, description, assigned_to_id, deadline, updated_at, task_status_id
        // await console.log("THIS IS BEFROE createNewRowTaskByButton", this.state.tasks);

        // Get the last Group Number
        let lastGroupNo = this.state.tasks[this.state.tasks.length - 1].group_no;
        this.state.tasks.push({
            'seq_no': this.state.tasks.length,
            'group_no': lastGroupNo,
            'ui_group_task': "down",
            'description': "",
            'assigned_to_id': 1,
            'deadline': moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss'),
            'updated_at': moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss'),
            'task_status_id': 0,
            'tcorp_id': this.props.tcorp_id,
            'is_header': 0
        });
        this.setState({ tasks: this.state.tasks });

        /*assigned_to_id: 4                                --- Set default = 0 ---
        customer_id: 1
        deadline: "2019-01-10T11:11:11.000Z"               --- Set default = "" ---
        description: "ยื่นเสนอราคา"                          --- Set default = "" ---
        end_contract_date: "2019-08-14T00:00:00.000Z" 
        firstname: "Tonia"                                 --- Set default = "" ---
        group_no: 1                                        --- Set default = lastGroup ---
        is_header: 0
        name_th: "Nondisp apophyseal fx r femr, 7thF"
        seq_no: 2                                          --- Set default = lastTask ---
        status: "Finished"                                 --- Set default = "Wait" ---
        task_status_id: 2                                  --- Set default = 0 ---
        tcorp_id: "T1901"
        ui_group_task: "down"
        updated_at: "2019-01-01T01:15:47.000Z"             --- Set default = "" ---
        value: 940502 */

        // Insert Task
        axios.post(`http://vanilla-erp.com:${API_URL_DATABASE}/api/v1/projects/tasks`, this.state.tasks[this.state.tasks.length - 1], { headers: { "x-access-token": localStorage.getItem('token_auth') } });
    }

    generateButtonTask() {
        // console.log(" generateButtonTask >>", this.state.userInfo)
        var current = this;
        if (current.state.userInfo.length !== 0) {
            if (current.state.userInfo[0].name === "Admin" || current.state.userInfo[0].name === "Project Management") {
                return (
                    <> <button onClick={current.createNewRowTaskByButton} className="btn btn-primary">เพิ่ม Task</button> </>
                )
            }
        }

    }


    render() {
        if (!this.state.isTokenValid) {
            return <Redirect to='/' />
        }
        return (
            <div className="row">
                <div className="row-top-h2">
                    <div className="col-12" style={{ marginTop: "1rem" }}>
                        {this.generateButtonTask()}
                    </div>
                </div>
                <table id="display-table">
                    <thead>
                        <tr style={{ fontSize: "1.4rem" }}>
                            <th>&nbsp; </th>
                            <th>&nbsp;&nbsp;</th>
                            <th>ภารกิจ</th>
                            <th>ผู้รับผิดชอบ</th>
                            <th>กำหนดส่ง</th>
                            <th>อัพเดตเมื่อ</th>
                            <th>สถานะ</th>
                            <th>ยืนยันสถานะ</th>
                            <th></th>
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
