import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import RequestItem from './RequestItem';

type Props = {
  title: string;
  hidden: string;
  content: string;
};
export default ({title, hidden, content}: Props) => {
  const [show, setShow] = useState(false);
  return (
    <TouchableOpacity activeOpacity={1} onPress={() => setShow(!show)}>
      {show ? (
        <RequestItem title={title} content={content} />
      ) : (
        <RequestItem title={title} content={hidden} />
      )}
    </TouchableOpacity>
  );
};
