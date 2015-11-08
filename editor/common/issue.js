'use strict';

/**
 * Represents an error, a warning or an info depending on the severity.
 */
exports.Issue = class {
  /**
   * ctor.
   * @param  {IssueSeverity} issueSeverity
   * @param  {[type]} message
   * @param  {[type]} exception - (optional) thrown exception
   */
  constructor(issueSeverity, message, exception) {
    this.issueSeverity = issueSeverity;
    this.message = message;
    this.exception = exception;
  }
};

exports.IssueSeverity = {
  INFO: 0,
  WARNING: 1,
  ERROR: 2
};
