'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Email } from '../../lib/types';
import Form from '../form';
import { getStyles } from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';
import { TranslatedMessage } from '../i18n';

export default React.createClass({
  displayName: 'ResetPasswordSection',

  mixins: [
    AsyncActionsMixin
  ],

  getInitialState() {
    return { displayErrors: false };
  },

  getAsyncActions() {
    return {
      resetPassword: this.props.resetPassword
    };
  },

  getType() {
    return t.struct({
      email: Email
    });
  },

  getFields() {
    let hasError = this.state.displayErrors && this.props.errors.resetPassword != null;
    let help = (this.state.resetPasswordState === 'done') && <TranslatedMessage message='reset password message when completed reset' />;
    let errorMessage = this.props.errors.resetPassword && this.props.errors.resetPassword.message;

    return {
      email: {
        placeholder: translate('reset password email placeholder'),
        type: 'email',
        hasError,
        error: hasError && <TranslatedMessage message={errorMessage} />,
        help
      }
    };
  },

  handleSubmit(value) {
    this.setState({ displayErrors: true });
    this.getAsyncAction('resetPassword')(value.email);
  },

  handleChange(changes) {
    let { email } = changes.value;
    if (email) {
      this.props.updateCurrentEmail(email);
    }
    this.setState({ displayErrors: false });
  },

  render() {
    let m;
    let d;

    if (this.state.resetPasswordState === 'done') {
      m = translate('reset password button text when completed reset');
      d = true;
    } else if (this.state.resetPasswordState === 'pending') {
      m = translate('reset password button text when attempting reset');
      d = true;
    } else {
      m = translate('reset password button text');
      d = false;
    }

    const styles = getStyles();

    return (
      <div>
        <Form kind='compact'
          type={this.getType()}
          value={{ email: this.props.currentEmail }}
          fields={this.getFields()}
          submitMessage={m}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          disabled={d}
          autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically} />

        <div style={styles.stickySectionFooter}>
          <p style={styles.sectionText}>
            <TranslatedMessage tag='a'
              href='#'
              onClick={this.props.activateLogInSection}
              message='reset password switch to log-in link' />
          </p>
        </div>
      </div>
    );
  }
});
