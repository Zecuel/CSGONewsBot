class Validator {
  static validateArguments(args) {
    if (args === undefined || args.length === 0) {
      return false;
    }

    for (const arg of args) {
      if (!arg) {
        return false;
      }
    }

    return true;
  }
}

module.exports = Validator;
