import React from 'react';
import { Route } from 'react-router-dom'

import Signin from './components/login/signin'
import Register from './components/login/register'
import Forgotpass from './components/login/forgot'
import ProjectOverview from './components/projects-managment'
import UsersProfile from './components/user-setting'
import EditProfile from './components/user-setting/edit-profile'
import AdminEditUsersProfile from './components/user-setting/admin'
import UsersManagement from './components/user-managment'
import Products from './components/products'
import Category from './components/category'
import CreateProject from './components/projects-managment/create-projecrt'
import EditProject from './components/projects-managment/edit-project'
import ProjectTask2 from './components/agenda/project-task2'
import Boq from './components/agenda/boq'
import EditProductBoq from './components/agenda/boq/edit-product-boq'
import CreateProductBoq from './components/agenda/boq/create-product-boq'
import Document from './components/agenda/document'

class FrontEnd extends React.Component {
    render() {
        return (
            <div>
                {/* SINGIN PAGE */}
                <Route exact path="/" component={Signin} />
                <Route exact path="/register-page" component={Register} />
                <Route exact path="/forgot-page" component={Forgotpass} />

                {/* PROJECT PAGE */}
                <Route exact path="/project-overview" component={ProjectOverview} />
                <Route exact path="/create-project" component={CreateProject} />
                <Route path="/edit-project/:tcorp_id" component={EditProject} />

                {/* USER PAGE */}
                <Route path="/users-profile/:username" component={UsersProfile} />
                <Route path="/edit-users-profile" component={EditProfile} />

                {/* USER MANAGMENT PAGE */}
                <Route exact path="/users_management" component={UsersManagement} />
                <Route path="/admin-users-profile/:username" component={AdminEditUsersProfile} />

                {/* PRODUCT PAGE */}
                <Route exact path="/products" component={Products} />
                <Route exact path="/category" component={Category} />

                {/* TASK PAGE */}
                {/*<Route path="/project-task/:tcorp_id" component={ProjectTask2}/>*/}
                <Route path="/project-task/:tcorp_id" render={(matchProps) => <ProjectTask2 {...matchProps} {...this.props}/>}/>

                {/* BOQ PAGE */}
                <Route exact path="/boq/:tcorp_id/:boq_id" component={Boq} />
                <Route exact path="/boq/:tcorp_id/:boq_id/create" component={CreateProductBoq} />
                <Route exact path="/edit-boq/:tcorp_id/:boq_id/:products_id" component={EditProductBoq} />

                {/* DOCUMENT PAGE */}
                <Route exact path="/document/:tcorp_id" component={Document} />

            </div>
        );
    }
    
}

export default FrontEnd;
