import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom'
const moment = require('moment');

class TableTasksStatus extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tasks: [],
            users: [],
            taskStatuses: [],
            isTokenValid: true,
            dragFromRow: 0,
            dropToRow: 0,
            tcorp_id: this.props.tcorp_id //THIS IS NOT NEEDED, WILL RECEIVE IS ENOUGH
        }

        this.onTaskChange = this.onTaskChange.bind(this);
        this.sectionCollapse = this.sectionCollapse.bind(this);
        this.dragHandler = this.dragHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.dragAndDropHandler = this.dragAndDropHandler.bind(this);
        this.createNewRowTaskByButton = this.createNewRowTaskByButton.bind(this);
        
        this.deleteTask = this.deleteTask.bind(this);
        // this.createNewRowSectionByButton = this.createNewRowSectionByButton.bind(this);
    }

    async getData() {
        // console.log(`Sending with headers ${localStorage.getItem('token_auth')}`);
        var token_auth = localStorage.getItem('token_auth');
        var tasks = await axios.get(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.tcorp_id}/tasks`, { headers: { 'x-access-token': token_auth } })
        var users = await axios.get(`http://vanilla-erp.com:10000/api/v1/users/`, { headers: {'x-access-token': token_auth}})
        var taskStatuses = await axios.get(`http://vanilla-erp.com:10000/api/v1/tasks_status/`, { headers: {'x-access-token': token_auth}})
        tasks = tasks.data;
        users = users.data;
        taskStatuses = taskStatuses.data;
        // console.log("THIS IS FROM GET DATA tasks", tasks);
        // console.log("THIS IS FROM GET DATA users", users);
        // console.log("THIS IS FROM GET DATA users", taskStatuses);
        return await {tasks:tasks, users:users, taskStatuses:taskStatuses};
    }

    componentDidMount() {
        console.log(`This is TABLE TASK tcorp_id: ${JSON.stringify(this.props)}`);
        var current = this;
        this.getData().then(function(data){
            var {users, tasks, taskStatuses} = data; //https://dev.to/sarah_chima/object-destructuring-in-es6-3fm
            // console.log("COMPONENTDIDMOUNT users", users);
            // console.log("COMPONENTDIMOUNT tasks", tasks);
            // console.log("COMPONENTDIMOUNT tasks", tasks[0].is_header);
            current.setState({ users: users, tasks: tasks, taskStatuses:taskStatuses, isTokenValid: true });
        }).catch(function(err) {
            console.log(err);
            current.setState({isTokenValid: false});
        });
        this.setState({tcorp_id: this.props.tcorp_id});

    }
    componentWillReceiveProps(nextProps) {
        console.log(`NEXT PROP IN TABLETASK ${JSON.stringify(nextProps)}`);
        var current = this;
        this.getData().then(function(data){
            var {users, tasks, taskStatuses} = data; //https://dev.to/sarah_chima/object-destructuring-in-es6-3fm
            // console.log("COMPONENTDIDMOUNT users", users);
            // console.log("COMPONENTDIMOUNT tasks", tasks);
            // console.log("COMPONENTDIMOUNT tasks", tasks[0].is_header);
            current.setState({ users: users, tasks: tasks, taskStatuses:taskStatuses, isTokenValid: true });
        }).catch(function(err) {
            console.log(err);
            current.setState({isTokenValid: false});
        });

        this.setState({tcorp_id: this.props.tcorp_id});
    }


    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    //     taken from: Underscore.js https://underscorejs.org/#debounce
    debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    }

    // 1. PUT task_group
    // 2. Update state for all tasks with that header
    onTaskHeaderChange(event){
        console.log(event.target.value);
        console.log(event.target);
    }

    // 1. PUT task 
    // 2. Update state of 'tasks' of 'seq_no' in the node's 'id' BY reading <tr> tablerow
    //      if (updated not have id) : this function will insert datat to table `task` 
    onTaskChange(event){
        console.log("===== onTaskChange =====")
        console.log(event.target.value);
        console.log(event.target);
        console.log(event.target.parentNode.parentNode);
        let tableRowNode = event.target.parentNode.parentNode;
        console.log(tableRowNode.id)
        // Check if id matches the Regex, and Capture Group 1 (the sequence number)
        // Split "-" for seed (the sequence number)
        let seq_no = tableRowNode.id.split("-")[1];
        console.log("seq_no", seq_no);
        if (seq_no){
            // Get all Input Parameters: description, assigned_to_id|firstname, deadline, task_status_id|status
            // NOTE: NEED TO REMOVE EXTRA INFO EXCEPT FOR ID!!
            console.log("seq_no >", this.state.tasks[seq_no]);
            let inputs = {'task-description':'description', //mapping of className -> database fields
                          'task-assigned-to':'assigned_to_id',
                          'task-deadline':   'deadline',
                          'task-status':     'task_status_id'
            }
            Object.keys(inputs).map(function (key, index){
                // console.log(">DDD", event.target.classList)
                if(event.target.classList.contains(key)){
                    // console.log("DDDDD", inputs[key]);
                    this.state.tasks[seq_no][inputs[key]] = event.target.value;
                    console.log("><",{[inputs[key]]: `${event.target.value}`});
                    // console.log("><3",{ [`${inputs[key]}`]: event.target.value});

                    this.debounce( axios.put(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.tcorp_id}/tasks/${seq_no}`, 
                        { [`${inputs[key]}`]: event.target.value}, 
                        { headers: {'x-access-token': localStorage.getItem('token_auth')}})
                        .then(async res => {
                            console.log("onTaskChange >>>> ", inputs[key]);
                            if (inputs[key] === "task_status_id"){
                                this.state.tasks[seq_no]['updated_at'] = res.data.updated_at;
                                console.log("setState Onchange", this.state.tasks);
                                this.setState({ tasks: this.state.tasks});
                            }
                            this.setState({ isFinish: true});
                        }).catch(function (err) {
                            console.log("Error ", err);
                            // this.setState({ isFinish: false });
                        }), 1000); 
                    /*this.debounce(axios.put(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.tcorp_id}/tasks/${seq_no}`, 
                        { `${inputs[key]}`: `${event.target.value}`}, 
                        { headers: {'x-access-token': localStorage.getItem('token_auth')}})
                    , 1000); // debounce an async function (not await return) 1 s */
                }
            }, this); //bind map to this
            console.log("setState Onchange", this.state.tasks)
            this.setState({tasks: this.state.tasks});
        }
    }

    async dragHandler(ev) {
        await this.setState({
            dragFromRow: ev.target.parentElement.rowIndex
        });
        await console.log("dragFromRow", this.state.dragFromRow)
    }

    async allowDropHandler(ev) {
        await ev.preventDefault();
    }

    async dropHandler(ev) {
        ev.preventDefault();
        await this.setState({
            dropToRow: ev.currentTarget.rowIndex
        });
        if (this.state.dragFromRow !== this.state.dropToRow && this.state.dropToRow !== undefined) {
            console.log("this.state.dropToRow", this.state.dropToRow)
            await this.dragAndDropHandler();
        }
    }

    async dragAndDropHandler () {
        console.log("FUCTION dragAndDropHandler");
        // console.log(">>> #1", this.state.tasks);
        var dragIndex = this.state.dragFromRow - 1;
        var dropIndex = this.state.dropToRow - 1;
        let bufferTask = {...this.state.tasks[dragIndex]};

        // Remove 1 element from dragIndex
        this.state.tasks.splice(dragIndex, 1);

        // Remove 0, and Insert bufferTask to dropIndex
        this.state.tasks.splice(dropIndex, 0, bufferTask)

        var groupNo = 0;
        for (var i=0; i<this.state.tasks.length; i++) {
            this.state.tasks[i]['seq_no'] = i;
            // console.log("is_header", this.state.tasks[i]['is_header']);
            if (this.state.tasks[i]['is_header'] === 1) {
                groupNo += 1;
            }
            this.state.tasks[i]['group_no'] = groupNo;
            var newTask = {
                "seq_no": this.state.tasks[i]['seq_no'],
                "group_no": this.state.tasks[i]['group_no'],
                "task_status_id": this.state.tasks[i]['task_status_id'], 
                "assigned_to_id": this.state.tasks[i]['assigned_to_id'],
                "description": this.state.tasks[i]['description'],
                "deadline": "2019-08-14T00:00:00.000Z",
                "tcorp_id": this.props.tcorp_id,
                "is_header": this.state.tasks[i]['is_header'],
                "ui_group_task": "down"
            };
            console.log("newTask", this.state.tasks[i]['seq_no'], this.state.tasks[i]['description']);

            // Update Task follow to seq_no
            axios.put(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.tcorp_id}/tasks/${this.state.tasks[i]['seq_no']}`, 
                newTask, 
                { headers: {'x-access-token': localStorage.getItem('token_auth')}});    
        }
        this.setState({tasks: this.state.tasks})
        console.log(">>> #2", this.state.tasks);
    

    }

    sectionCollapse(ev) {
        /*// console.log("target.value", ev.target.value);
        console.log("target", ev.target);
        console.log("parentNode", ev.target.parentNode.parentNode);
        let tableRowNode = ev.target.parentNode.parentNode;
        console.log("tableRowNode", tableRowNode);
        // console.log("dd", /task-head-(\d)/.exec(tableRowNode.id));
        // Check if id matches the Regex, and Capture Group 1 (the sequence number)
        let seq_no = tableRowNode.id.split("-")[2];
        console.log("seq_no", seq_no, ev.target.className);
        if (seq_no){
            console.log(this.state.tasks[seq_no])
            var taskTable = document.getElementById("display-table");
            var taskRow = taskTable.getElementsByTagName("tr");

            for (var i=1; i<taskRow.length; i++) {
                var hearder = taskRow[i].childNodes[1].innerHTML;
                console.log("hearder >>>", i, hearder)
                if (i == seq_no) {
                    console.log("hearder >>> seleted", i, taskRow[i])
                    taskRow[i].cells[0].draggable = false;
                    taskRow[i].setAttribute("onDrop","");
                    taskRow[i].setAttribute("onDragOver","");
                }
                else if (i >= seq_no){
                    // Next Group
                    if (hearder === '<i class="fas fa-caret-right icon-movement"></i>'){
                        console.log(">>> break vertical", i)
                        break;
                    }
                    else if (hearder === '<i class="fas fa-caret-down icon-movement"></i>') {
                        console.log(">>> break down", i)
                        break;
                    }
                    // ev.target.parentElement.innerHTML = `<td><i class="fas fa-caret-down icon-movement" onClick={this.sectionCollapse} ></i></td>`
                    // console.log(">>>>>", ev.target.parentElement.innerHTML)
                    if (ev.target.classList[1] === 'fa-caret-down') {
                        taskRow[i].style.display = 'none';
                    }
                    else {
                        taskRow[i].style.display = '';
                        // ev.target.classList[1] = 'fa-caret-down'
                    }
                    
                }
            }
            if (ev.target.classList[1] === 'fa-caret-down') {
                ev.target.parentElement.innerHTML = '<i class="fas fa-caret-right icon-movement"></i>'
                
            }
            else {
                ev.target.parentElement.innerHTML = '<i class="fas fa-caret-down icon-movement"></i>'
            }
        }*/
    }

    async deleteTask(ev) {
        var tableRowNode = ev.currentTarget.parentNode.parentNode;
        var seqNoTask = tableRowNode.id.split("-")[1];

        var token_auth = localStorage.getItem('token_auth');
        await axios.delete(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.tcorp_id}/tasks/${seqNoTask}   
                `, { headers: { 'x-access-token': token_auth } })
                .then(res => {
                    //console.log("After Delete>>", seqNoTask, this.state.tasks[i]['seq_no'], this.state.tasks[i]['description']);
                    
                    // Delete Task from seqNo
                    console.log(`AFTER RES ${this.state.tasks}`);
                    this.state.tasks.splice(seqNoTask, 1);
                    this.state.tasks.map(function(task, index){
                        if(index >= seqNoTask) {
                            this.state.tasks[index].seq_no -= 1;
                        }
                    }, this);
                    console.log(">>>>>",  this.state.tasks );
                    
                    this.setState({tasks: this.state.tasks })
        

                })
                
        // Update 'seq_no' Task
        /*var chk_delete = false;
        for (var i=0; i<this.state.tasks.length; i++) {
            let bufferTaskSeq = Object.assign({}, this.state.tasks[i]);
            this.state.tasks[i]['seq_no'] = i;
            if (seq_no_task == i) {
                // Delete All Task of the Project
                console.log("Before Delete>>", seq_no_task, this.state.tasks[i]['seq_no'], this.state.tasks[i]['description']);
                await axios.delete(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.tcorp_id}/tasks/${seq_no_task}   
                `, { headers: { 'x-access-token': token_auth } })
                .then(res => {
                    console.log("After Delete>>", seq_no_task, this.state.tasks[i]['seq_no'], this.state.tasks[i]['description']);
                    chk_delete = true;
                })
            }
            else {
                // Update Task follow to seq_no
                var newTask = {
                    "seq_no": this.state.tasks[i]['seq_no'],
                    "group_no": this.state.tasks[i]['group_no'],
                    "task_status_id": this.state.tasks[i]['task_status_id'], 
                    "assigned_to_id": this.state.tasks[i]['assigned_to_id'],
                    "description": this.state.tasks[i]['description'],
                    "deadline": this.state.tasks[i]['deadline'],
                    "tcorp_id": this.props.tcorp_id,
                    "is_header": this.state.tasks[i]['is_header'],
                    "ui_group_task": "down"
                };
                if (chk_delete) {
                    newTask["seq_no"] = newTask["seq_no"] - 1;
                }
                console.log("bufferTaskSeq", bufferTaskSeq['seq_no'], "newTask", newTask["seq_no"], newTask["description"])
                await axios.put(`http://vanilla-erp.com:10000/api/v1/projects/${this.props.tcorp_id}/tasks/${bufferTaskSeq['seq_no']}`, 
                    newTask, 
                    { headers: {'x-access-token': localStorage.getItem('token_auth')}}); 
            }
            console.log("FINAL", bufferTaskSeq['seq_no'], bufferTaskSeq['description'])
        }*/
           
    }

    generateTableRow(task, isHeader=false) {
        return (
            // {if (generateTableRow ==)}
            // <tr key={isHeader ? `task-head-${task.group_no}.${task.seq_no}`:`task-${task.seq_no}`}  id={isHeader ? `task-head-${task.group_no}.${task.seq_no}`:`task-${task.seq_no}`} ondrop="drop(event)" ondragover="allowDrop(event)">
            <tr key={isHeader ? `task-head-${task.group_no}.${task.seq_no}`:`task-${task.seq_no}`}  id={isHeader ? `task-head-${task.seq_no}`:`task-${task.seq_no}`} onDrop={this.dropHandler} onDragOver={this.allowDropHandler}>
                {/* Grip Icon */}
                <td draggable="true" onDragStart={this.dragHandler}><i className="fas fa-grip-vertical icon"></i></td>

                {/* Grouping Arrow */}
                <td>{isHeader ? (<i className={`fas fa-caret-${task.ui_group_task} icon-movement`} onClick={this.sectionCollapse} ></i>) : null}</td>

                {/* Task Descriptions */}
                {/* {console.log("task.seq_no", task.seq_no, "task.description", task.description)} */}
                {isHeader ? (
                    <td colSpan="6">
                        <input type="text" className="form-control input-task task-header" onChange={this.onTaskHeaderChange} value={task.description} />
                    </td>) : (
                        
                    
                        <>
                    <td><input type="text" className="form-control input-task task-description" onChange={this.onTaskChange} value={task.description} /></td>
                    <td>
                        <select className="form-control form-control-lg task-assigned-to" onChange={this.onTaskChange} defaultValue={task.assigned_to_id}>
                            {this.state.users.map(function(user, i){
                                return <option key={user.id} value={user.id}>{user.firstname}</option>;
                            })}
                        </select>
                    </td>
                    
                    {/* DEADLINE */}
                    {/* { console.log("task.deadline", task.deadline)} */}
                    <td><input type="date" onChange={this.onTaskChange} className="form-control input-task task-deadline" name="bday" value={task.deadline != null ? task.deadline.substring(0,10) : "2019-08-14T00:00:00.000Z" }/></td>

                    {/* UPDATED_AT is still not full!! */}
                    <td><input type="text" className="form-control input-task task-updated-at" name="bday" value={task.updated_at != null ? moment(task.updated_at).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss') : moment().utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss')} disabled /></td>

                    <td> 
                        <select className="form-control form-control-lg task-status" onChange={this.onTaskChange} defaultValue={task.task_status_id}>
                            {this.state.taskStatuses.map(function(status, i){
                                return <option key={status.id} value={status.id}>{status.status}</option>;
                            })}
                        </select>
                    </td>
                    <td>
                        <button onClick={this.deleteTask} className="btn btn-danger">ลบ</button>
                    </td>
                        </>

                )}
             </tr>
        )
    }


    generateProjectTasks() {
        let table = []
        // var prevTaskGroupId = -1;
        // console.log(`This is TABLE TASK id: ${this.props.id}`);
        console.log('THIS IS FROM OUTSIDE');
        // console.log(this.state.tasks);
        var current = this;
        this.state.tasks.map(function (task, index) {
            // console.log("ddd task Before", task)
            if (task.is_header === 1){
                // console.log("task Header", task)
                table.push(current.generateTableRow(task, true));
            }
            else {
                // console.log("task", task['seq_no'], task['description'])
                table.push(current.generateTableRow(task, false));
            }
            // console.log(">>> table", table);
        });
        return table;
    }


    createNewRowSectionByButton() {

    }

    // Create New Row (Task), but don't INSERT to database
    // It will INSERT when change the new TextBox.
    async createNewRowTaskByButton() {
        // TASK: group_no, seq_no, ui_group_task, description, assigned_to_id, deadline, updated_at, task_status_id
        await console.log("THIS IS BEFROE createNewRowTaskByButton", this.state.tasks);

        // Get the last Group Number
        let lastGroupNo = this.state.tasks[this.state.tasks.length-1].group_no;
        this.state.tasks.push({'seq_no': this.state.tasks.length,
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

        await console.log("THIS IS createNewRowTaskByButton", this.state.tasks);
        this.setState({ tasks: this.state.tasks });
        // Insert Task
        axios.post(`http://vanilla-erp.com:10000/api/v1/projects/tasks`, this.state.tasks[this.state.tasks.length-1] , {headers: {"x-access-token": localStorage.getItem('token_auth')}});


    
    }

    generateButtonTask() {
        return(
            <>
                {/* <button onClick={this.createNewRowSectionByButton} className="btn btn-primary ml-3">เพิ่ม Section</button> */}
                <button onClick={this.createNewRowTaskByButton} className="btn btn-primary">เพิ่ม Task</button>
            </>
        )
    }


    render() {
        if (!this.state.isTokenValid){
            return <Redirect to='/' />
        }
        return (
            <div className="row">
                <div className="row-top-h2">
                    <div className="col-12">
                        {this.generateButtonTask()}
                    </div>
                </div>
                <table id="display-table">
                    <thead>
                        <tr style = {{ fontSize: "1.4rem"}}>
                            <th>&nbsp; </th>
                            <th>&nbsp;&nbsp;</th>
                            <th>ภารกิจ</th>
                            <th>ผู้รับผิดชอบ</th>
                            <th>กำหนดส่ง</th>
                            <th>อัพเดตเมื่อ</th>
                            <th>สถานะ</th>
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
