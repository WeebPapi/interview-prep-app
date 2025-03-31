import React from "react"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import {
  Control,
  Controller,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form"

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: "text" | "placeholder" | "password" | "file"
}

const CustomFormField: React.FC<CustomFormFieldProps<T>> = ({
  name,
  control,
  placeholder,
  label,
  type = "text",
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <Input
              className="input"
              placeholder={placeholder}
              type={type}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
