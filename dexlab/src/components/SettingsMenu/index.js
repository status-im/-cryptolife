import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Text
} from 'react-native';
import CONF from '../../config';

const styles = StyleSheet.create({
  listContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rowContainer: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    color: CONF.theme.textC,
    fontSize: 16,
    alignSelf: 'center',
  },
  rowIcon: {
    height: 15,
    width: 15,
  },
});

export default class Menu extends Component {

  renderOption = (option, index) => {
    if (option.swipeToDelete) {
      const swipeoutButtons = [
        {
          onPress: option.onDeletePress,
          text: 'Delete',
          type: 'delete',
        },
      ];

      return (
          <TouchableWithoutFeedback
            onPress={option.onPress}
            style={styles.rowContainer}
          >
            <Text style={styles.rowText}>{option.title}</Text>
          </TouchableWithoutFeedback>
      );
    }

    return (
      <TouchableOpacity
        onPress={option.onPress}
        key={index}
        style={styles.rowContainer}
      >
        <Text style={styles.rowText}>{option.title}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <ScrollView containerStyle={styles.listContainer}>
        {this.props.options.map(this.renderOption)}
      </ScrollView>
    );
  }
}
