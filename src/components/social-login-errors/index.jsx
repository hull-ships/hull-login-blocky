import React from 'react';
import { TranslatedMessage, hasTranslation } from '../i18n';
import { getStyles } from './styles';


export default React.createClass({
  displayName: 'SocialLoginErrors',

  getErrorMessage() {
    let error = this.props.errors.signUp || this.props.errors.logIn;
    if (error && error.provider && error.provider !== 'classic') {
      let { reason, message } = error;
      if (reason) {
        let msg = 'social-login error ' + reason;
        if (hasTranslation(msg)) {
          return <TranslatedMessage message={msg} variables={error} />;
        } else {
          return message || reason;
        }
      } else {
        return message;
      }
    }
  },

  render() {
    let styles = getStyles();
    let errorMessage = this.getErrorMessage();
    if (errorMessage) {
      return <div style={styles.socialLoginErrors}>{errorMessage}</div>;
    } else {
      return <span />;
    }

  }
})
