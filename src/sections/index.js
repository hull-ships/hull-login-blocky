import React from 'react';
import { Sections, Components } from 'hull-login';
import Centerer from '../components/centerer';

let { TranslatedMessage } = Components;

const sectionFooter = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  textAlign: 'center',
  padding: 30
};

function renderSection() {
  const styles = this.getStyles();

  return (
    <div>
      {this.renderHeader(styles)}
      <Centerer style={{ padding: '30px 60px' }}>
        {this.renderContent(styles)}
      </Centerer>
      {this.renderFooter(styles)}
    </div>
  );
}

class logIn extends Sections.logIn {
  renderHeader() {}
  getStyles() {
    return {
      ...super.getStyles(),
      sectionFooter
    };
  }
  render() {
    return renderSection.call(this);
  }
}


class signUp extends Sections.signUp {
  renderHeader() {}
  getStyles() {
    return {
      ...super.getStyles(),
      sectionFooter
    };
  }
  render() {
    return renderSection.call(this);
  }
}


class resetPassword extends Sections.resetPassword {
  renderHeader() {}
  renderFooter(styles) {
    return <div style={sectionFooter}>
      <p style={styles.sectionText}>
        <TranslatedMessage tag='a'
          href='#'
          onClick={this.props.activateLogInSection}
          message='reset password switch to log-in link' />
      </p>
    </div>;
  }
  render() {
    return renderSection.call(this);
  }
}


class showProfile extends Sections.showProfile {
  renderHeader() {}
  renderFooter(styles) {
    return <div style={sectionFooter}>
      <p style={styles.sectionText}>
        <TranslatedMessage tag='a'
          href='#'
          onClick={this.props.activateEditProfileSection}
          message='view profile switch to edit profile link' />
      </p>
    </div>;
  }
  render() {
    return renderSection.call(this);
  }
}


class editProfile extends Sections.editProfile {
  renderHeader() {}
  renderFooter(styles) {
    let message;
    let handleClick;
    if (this.props.formIsSubmitted || !this.props.hasForm) {
      message = 'edit profile cancel button';
      handleClick = this.props.activateShowProfileSection;
    } else {
      message = 'edit profile cancel button when profile incomplete';
      handleClick = this.props.hideDialog;
    }
    return <div style={sectionFooter}>
      <p style={styles.sectionText}>
        <a href='javascript: void 0;' onClick={handleClick}>
          <TranslatedMessage tag='p' style={styles.sectionText} message={message} />
        </a>
      </p>
    </div>;
  }
  render() {
    return renderSection.call(this);
  }
}


class thanks extends Sections.thanks {
  renderHeader() {}
  render() {
    return renderSection.call(this);
  }
}

export default {
  logIn,
  signUp,
  resetPassword,
  showProfile,
  editProfile,
  thanks
};
