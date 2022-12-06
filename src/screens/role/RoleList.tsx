import {
  List,
  Datagrid,
  NumberField,
  EditButton,
  ReferenceField,
  DateField,
  TextField,
} from "react-admin";

const RoleList = () => (
  <List>
    <Datagrid>
      <NumberField source="id" />
      <TextField source="name" />
      <EditButton />
    </Datagrid>
  </List>
);

export default RoleList;
