import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import CONF from '../../config';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 4,
    paddingVertical: 15,
    backgroundColor: CONF.theme.primaryC,
    opacity: 1,
  },
  text: {
    color: '#000',
    fontSize: 18,
  },
});

class PrimaryButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled}
        activeOpacity={0.8}
        onPress={this.props.onPress}
        style={[
          styles.container,
          {
            backgroundColor: this.props.disabled
              ? '#BBD9F2'
              : CONF.theme.primaryC,
          },
        ]}
      >
        <Text style={styles.text}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}

export default PrimaryButton;
