'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Login, Password } from '../../lib/types';
import { getStyles } from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';
import renderSectionContent from './render-section-content';
import { TranslatedMessage } from '../i18n';
import SocialLoginErrors from '../social-login-errors';

export default React.createClass({
  displayName: 'LogInSection',

  mixins: [
    AsyncActionsMixin
  ],

  getInitialState() {
    return { displayErrors: false };
  },

  getAsyncActions() {
    return {
      logIn: this.props.logIn
    };
  },

  getType() {
    return t.struct({
      login: Login,
      password: Password
    });
  },

  getFields() {
    const e = this.props.errors.logIn;
    const { displayErrors } = this.state;
    const hasError = displayErrors && e && e.provider === 'classic';

    return {
      login: {
        placeholder: translate('log-in email placeholder'),
        type: 'text',
        help: <TranslatedMessage message='log-in email help text' />,
        hasError,
        error: hasError && <TranslatedMessage message='log-in invalid credentials error' />
      },
      password: {
        placeholder: translate('log-in password placeholder'),
        type: 'password',
        help: <TranslatedMessage message='log-in password help text' />,
        hasError
      }
    };
  },

  handleSubmit(value) {
    this.setState({ displayErrors: true });
    this.getAsyncAction('logIn')(value);
  },

  handleChange(changes) {
    this.setState({ displayErrors: false });
    let { login } = changes.value;
    if (login) {
      this.props.updateCurrentEmail(login);
    }
  },

  render() {
    let m;
    let d;
    if (this.state.logInState === 'pending') {
      m = translate('log-in button text when attempting login');
      d = true;
    } else {
      m = translate('log-in button text');
      d = false;
    }
    let content = renderSectionContent(this.props, {
      kind: 'compact',
      type: this.getType(),
      fields: this.getFields(),
      submitMessage: m,
      onSubmit: this.handleSubmit,
      onChange: this.handleChange,
      disabled: d,
      value: { login: this.props.currentEmail }
    });

    const styles = getStyles();

    return (
      <div>
        <SocialLoginErrors {...this.props} />
        {content}
        <div style={styles.stickySectionFooter}>
          <p style={styles.sectionText}>
            <TranslatedMessage tag='a' href='javascript: void 0;' onClick={this.props.activateResetPasswordSection} message='log-in forgot password link' />
          </p>
        </div>
      </div>
    );
  }
});
