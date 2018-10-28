import React from 'react'
import { View } from 'react-native';

function IF (props) {
  return (
      props.what ? props.children : null
  )
}

export default IF;