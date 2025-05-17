import { useState, useCallback } from 'react';

interface FormState {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ValidationRules {
  [key: string]: (value: string) => boolean;
}

export function useForm<T extends FormState>(
  initialState: T,
  validationRules?: ValidationRules
) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = useCallback((name: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    if (!validationRules) return true;

    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const value = values[key];
      const isValidField = validationRules[key](value);

      if (!isValidField) {
        newErrors[key] = `${key} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
  }, [initialState]);

  return {
    values,
    errors,
    handleChange,
    validate,
    reset,
  };
}