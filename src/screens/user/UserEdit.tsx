import React from "react";
import {
  SimpleForm,
  TextInput,
  required,
  ReferenceInput,
  SelectInput,
  Edit,
  NumberInput,
  SelectArrayInput,
  useEditContext,
} from "react-admin";
import { ReferenceManyToManyInput } from "@react-admin/ra-relationships";

const UserEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput source="id" disabled />
        <TextInput source="email" validate={[required()]} />
        <ReferenceInput source="clanId" reference="clan">
          <SelectInput parse={(value) => Number(value)} optionText="name" />
        </ReferenceInput>
        <ReferenceManyToManyInput
          source="id"
          reference="role"
          through="userRole"
          using="userId,roleId"
        >
          <SelectArrayInput label="Role" optionText="name" />
        </ReferenceManyToManyInput>
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;
