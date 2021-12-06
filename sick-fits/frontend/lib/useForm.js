import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);
  const initailValues = Object.values(initial).join();
  useEffect(() => {
    // This function runs when the things we are watching change
    setInputs(initial);
  }, [initailValues]);

  function handleChange(e) {
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    setInputs({
      // copy the existing state
      ...inputs,
      [name]: value,
    });
  }
  function resetForm() {
    setInputs(initial);
  }
  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
