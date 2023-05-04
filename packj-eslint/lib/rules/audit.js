"use strict";

const { default: auditPackage } = require("../../packj/audit/main");
const { readFileSync } = require("node:fs");
const os = require("node:os");

module.exports = {
  meta: {
    docs: {
      description:
        "ESLint plugin to flag malicious/vulnerable open-source dependencies.",
      category: "Best Practices",
      recommended: false,
    },
    messages: {
      auditMessage: "Found risks in package: {{ packageName }}",
      noRiskMessage: "No risks found",
    },
    schema: [],
    type: "suggestion",
  },

  create: (context) => {
    return {
      ImportDeclaration: function (node) {
        const packageName = node.source.value;

        const fileText = readFileSync(os.homedir() + "/.packj.creds", "utf8");
        const accessToken = JSON.parse(fileText).token.access_token;

        const response = auditPackage(
          "packj-npm",
          "cli",
          "npm",
          packageName,
          "",
          accessToken
        );
        const risks = response.packages[0].risks;

        const messageId = risks === null ? "noRiskMessage" : "auditMessage";

        context.report({
          node,
          messageId,
          data: {
            packageName,
          },
        });
      },
    };
  },
};
