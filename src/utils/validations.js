/**
 * Utility object for field validations.
 * @namespace validations
 */
const validations = {
  /**
   * Field validation rules.
   * @memberof validations
   * @property {object} email - Validation rules for the email field.
   * @property {boolean} email.required - Indicates if the email field is required.
   * @property {RegExp} email.pattern - Regular expression pattern to validate the email field.
   */
  fields: {
    email: {
      required: true,
      // This pattern allows letters, numbers, dots, underscores, percentages, pluses, and dashes
      // in the username part, and supports domains with multiple subparts.
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
  },

  /**
   * Validates a field value based on the specified validation rules.
   * @memberof validations
   * @param {string} field - The name of the field to validate.
   * @param {string} value - The value of the field to validate.
   * @returns {boolean} - Indicates if the field value is valid.
   */
  validate(field, value) {
    return this.fields[field] ? this.fields[field].pattern.test(value) : false;
  },
};

export default validations;
