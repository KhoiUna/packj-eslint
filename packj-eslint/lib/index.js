/**
 * @fileoverview Audit packages
 * @author Khoi Nguyen
 */
"use strict";

const audit = require("./rules/audit");

module.exports = {
  meta: {
    name: "eslint-plugin-packj",
    version: "0.0.0",
  },
  rules: {
    audit,
  },
};
