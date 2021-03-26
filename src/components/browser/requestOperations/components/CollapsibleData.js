import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import RequestItem from './RequestItem';

export default ({title, hidden, content}) => {
  const [show, setShow] = useState(false);
  return (
    <TouchableOpacity onPress={() => setShow(!show)}>
      {show ? (
        <RequestItem title={title} content={content} />
      ) : (
        <RequestItem title={title} content={hidden} />
      )}
    </TouchableOpacity>
  );
};
