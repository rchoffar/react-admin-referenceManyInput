import React from "react";
import { Resource, Admin } from "react-admin";

import { dataProvider } from "./dataProvider";
import UserCreate from "./screens/user/UserCreate";
import UserEdit from "./screens/user/UserEdit";
import UserList from "./screens/user/UserList";
import RoleList from "./screens/role/RoleList";
import RoleCreate from "./screens/role/RoleCreate";
import RoleEdit from "./screens/role/RoleEdit";

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="user" list={UserList} create={UserCreate} edit={UserEdit} />
    <Resource name="role" list={RoleList} create={RoleCreate} edit={RoleEdit} />
  </Admin>
);

export default App;
