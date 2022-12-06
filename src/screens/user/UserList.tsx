import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  NumberField,
  EditButton,
  ReferenceManyField,
  SingleFieldList,
  ChipField,
} from "react-admin";
import { ReferenceManyToManyField } from "@react-admin/ra-relationships";

const UserList = () => (
  <List>
    <Datagrid>
      <NumberField source="id" />
      <TextField source="email" />
      <ReferenceField source="clanId" reference="clan" label="Clan">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceManyToManyField
        label="Role"
        reference="role"
        through="userRole"
        using="userId,roleId"
      >
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceManyToManyField>
      <EditButton />
    </Datagrid>
  </List>
);

export default UserList;
