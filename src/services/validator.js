class Validator {
  static isCleanString(name) {
    return !/\s|[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(name);
  }
}

export default Validator;
