module.exports = {
  root: true,
  extends: 'react-app',
  "plugins": [
    // ...
    "react-hooks",
    "prettier"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "prettier/prettier": "error"
  }
};
