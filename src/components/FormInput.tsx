import React from "react";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";

interface FormInputProps {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
}

// React.ForwardRefExoticComponent<
// TextInputProps & React.RefAttributes<TextInput>
// >;

const FormInput = ({ id, label, children, error }: FormInputProps) => {
  return (
    <>
      <Label nativeID={id} style={{ marginLeft: 5 }}>
        {label}
      </Label>
      {children}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </>
  );
};

export default FormInput;
