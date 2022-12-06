import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  NumberInput,
  ReferenceInput,
  SelectInput,
  AutocompleteInput,
} from "react-admin";

const RoleCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" validate={[required()]} />
      </SimpleForm>
    </Create>
  );
};

export default RoleCreate;
