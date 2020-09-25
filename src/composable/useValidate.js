import { computed } from '@vue/composition-api';

export const validateFields = ({ fields, errors }) => {
  if (!(fields || errors)) {
    return true;
  }
  const hasInvalidField = Object.keys(fields).some(
    field =>
      fields[field] &&
      (fields[field].invalid || fields[field].invalid === null),
  );
  const result = !(hasInvalidField || errors.any());
  return result;
};

export default function useValidate($validator) {
  const isFormValid = computed(() => {
    const { errors, flags } = $validator;
    return validateFields({
      errors,
      fields: flags,
    });
  });

  return {
    isFormValid,
  };
}
