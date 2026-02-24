class Validator {
  static isCleanString(name) {
    return !/\s|[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(name);
  }

  static isNumeric(value) {
    return /^[0-9]+$/.test(value);
  }
}

export default Validator;
