export const validateFields = (body, requiredFields) => {
  const dataError = [];
  requiredFields.forEach(f => {
    if (body[f] == undefined) dataError.push(`${f}`);
  })
  if (dataError.length) {
    const error = new Error(`Required fields are missing: ${dataError.join(", ")}`);
    error.name = 'ValidationError';
    throw error;
  }
}