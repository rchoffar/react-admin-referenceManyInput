import React from "react";
import {
  SimpleForm,
  TextInput,
  required,
  NumberInput,
  Edit,
  SelectInput,
  TabbedForm,
  FormTab,
  NumberField,
  BooleanField,
  CreateButton,
  Datagrid,
  ReferenceManyField,
  TextField,
  EditButton,
  BooleanInput,
  SimpleFormIterator,
  useEditContext,
} from "react-admin";

const RoleEdit = () => {
  const { record } = useEditContext();
  return (
    <Edit>
      <TabbedForm>
        <FormTab label="summary">
          <NumberInput source="id" disabled />
          <TextInput source="name" validate={[required()]} />
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

export default RoleEdit;
