import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
} from 'react-native';
import CONF from '../../config';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 0,
    paddingVertical: 15,
  },
  text: {
    backgroundColor: 'transparent',
    color: '#000000',
    fontSize: 18,
  },
});

export default class SecondaryButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
  };

  static defaultProps = {
    disabled: false,
    isLoading: false,
  };

  render() {
    return (
      <TouchableHighlight
        activeOpacity={0.8}
        onPress={this.props.onPress}
        disabled={this.props.disabled}
        style={{
          opacity: this.props.disabled ? 0.5 : 1,
        }}
      >
        <View style={styles.container}>
          {this.props.isLoading ? (
            <ActivityIndicator color={CONF.theme.primaryC} />
          ) : (
            <Text style={styles.text}>{this.props.text}</Text>
          )}
        </View>
      </TouchableHighlight>
    );
  }
}
