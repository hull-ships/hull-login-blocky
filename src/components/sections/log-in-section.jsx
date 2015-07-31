'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Login, Password } from '../../lib/types';
import { getStyles } from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';
import renderSectionContent from './render-section-content';
import { TranslatedMessage } from '../i18n';

export default React.createClass({
  displayName: 'LogInSection',

  mixins: [
    AsyncActionsMixin
  ],

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
    const hasError = e && e.provider === 'classic';

    return {
      login: {
        placeholder: translate('log-in email placeholder'),
        type: 'text',
        help: <TranslatedMessage message='log-in email help text' />,
        hasError
      },
      password: {
        placeholder: translate('log-in password placeholder'),
        type: 'password',
        help: <TranslatedMessage tag='a' href='javascript: void 0;' onClick={this.props.activateResetPasswordSection} message='log-in forgot password link' />,
        hasError
      }
    };
  },

  handleSubmit(value) {
    this.getAsyncAction('logIn')(value);
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
      disabled: d
    });

    return (
      <div>
        {content}
      </div>
    );
  }
});
