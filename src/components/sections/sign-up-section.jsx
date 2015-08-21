'use strict';

import React from 'react';
import t from 'tcomb-form';
import { translate } from '../../lib/i18n';
import { Email, Password } from '../../lib/types';
import { getStyles } from './styles';
import AsyncActionsMixin from '../../mixins/async-actions';
import renderSectionContent from './render-section-content';
import { TranslatedMessage } from '../i18n';

export default React.createClass({
  displayName: 'SignUpSection',

  mixins: [
    AsyncActionsMixin
  ],

  getAsyncActions() {
    return {
      signUp: this.props.signUp
    };
  },

  getType() {
    return t.struct({
      email: Email,
      password: Password
    });
  },

  getFields() {
    let errors = (this.props.errors.signUp || {}).errors || {};

    return {
      email: {
        placeholder: translate('sign-up email placeholder'),
        type: 'email',
        help: <TranslatedMessage message='sign-up email help text' />,
        hasError: !!errors.email,
        error: errors.email && <TranslatedMessage message='sign-up email taken error' />
      },
      password: {
        placeholder: translate('sign-up password placeholder'),
        type: 'password',
        help: <TranslatedMessage message='sign-up password help text' />,
        hasError: !!errors.password,
        error: errors.password && <TranslatedMessage message='sign-up password too short error' />
      }
    };
  },

  handleSubmit(value) {
    this.getAsyncAction('signUp')(value);
  },

  render() {
    let m;
    let d;
    if (this.state.signUpState === 'pending') {
      m = translate('sign-up button text when attempting sign-up');
      d = true;
    } else {
      m = translate('sign-up button text');
      d = false;
    }

    let content = renderSectionContent(this.props, {
      kind: (this.props.shipSettings.show_classic_login_as_button) ? 'expand' : 'compact',
      type: this.getType(),
      fields: this.getFields(),
      submitMessage: m,
      onSubmit: this.handleSubmit,
      disabled: d
    });

    const styles = getStyles();

    return (
      <div>
        {content}

        <div style={styles.stickySectionFooter}>
          <TranslatedMessage tag='p'
            style={styles.sectionText}
            message="sign-up fine print"
            variables={{ organization: this.props.organization.name }} />
        </div>
      </div>
    );
  }
});
