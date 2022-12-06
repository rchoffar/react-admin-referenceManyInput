import { ReferenceManyToManyInput } from "@react-admin/ra-relationships";
import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  ReferenceInput,
  SelectInput,
  SelectArrayInput,
} from "react-admin";

const UserCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="email" validate={[required()]} />
        <TextInput source="password" validate={[required()]} />
        <ReferenceInput source="clanId" reference="clan">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <ReferenceManyToManyInput
          source="id"
          reference="role"
          through="userRole"
          using="userId,roleId"
        >
          <SelectArrayInput
            label="Role"
            validate={required()}
            optionText="name"
            fullWidth
          />
        </ReferenceManyToManyInput>
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;
