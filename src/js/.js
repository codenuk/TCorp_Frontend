import React from 'react';
import { Route } from 'react-router-dom'

import Signin from './components/login/signin'
import Register from './components/login/register'
import Forgotpass from './components/login/forgot'
import ProjectOverview from './components/projects-managment'
import Archive from './components/archive'
import UsersProfile from './components/user-setting'
import EditProfile from './components/user-setting/edit-profile'
import AdminEditUsersProfile from './components/user-setting/admin'
import UsersManagement from './components/user-managment'
import Products from './components/products'
import EditProduct from './components/products/edit-product'
import CreateProduct from './components/products/create-product'
import Category from './components/category'
import EditCategory from './components/category/edit-category'
import CreateProject from './components/projects-managment/create-projecrt'
import EditProject from './components/projects-managment/edit-project'
import ProjectTask2 from './components/agenda/project-task2'
import Boq from './components/agenda/boq'
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
                <Route exact path="/create-product" component={CreateProduct} />
                <Route exact path="/edit-product/:product_id" component={EditProduct} />

                {/* CATEGORT PAGE */}
                <Route exact path="/category" component={Category} />
                <Route exact path="/edit-category/:product_category_id" component={EditCategory} />

                {/* TASK PAGE */}
                {/*<Route path="/project-task/:tcorp_id" component={ProjectTask2}/>*/}
                {/*<Route path="/project-task/:tcorp_id" render={(matchProps) => <ProjectTask2 {...matchProps} {...this.props}/>}/>*/}
                <Route path="/project-task/:tcorp_id" component={(props) => (
                    <ProjectTask2 timestamp={new Date().toString()} {...props} />
                )} />

                {/* BOQ PAGE */}
                <Route exact path="/boq/:tcorp_id/:boq_id" component={Boq} />

                {/* DOCUMENT PAGE */}
                <Route exact path="/document/:tcorp_id" component={Document} />

                {/* ARCHIVE PAGE */}
                <Route exact path="/archive" component={Archive} />

            </div>
        );
    }

}

export default FrontEnd;
