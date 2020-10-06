// import React, {useState} from 'react';
// import {TouchableOpacity} from 'react-native';
// import CustomModal from './CustomModal';
//
// export default ({icon, children}) => {
//   const [visible, setVisible] = useState(false);
//   console.log('still');
//   return (
//     <>
//       <TouchableOpacity
//         onPress={() => {
//           setVisible(true);
//         }}>
//         {icon}
//       </TouchableOpacity>
//       <CustomModal
//         animation="slide"
//         visible={visible}
//         mode="overFullScreen"
//         boxBackgroundColor="lightyellow"
//         transparentContainer={true}
//         bottomHalf={true}
//         outsideClick={() => {
//           setVisible(false);
//         }}>
//         {children}
//       </CustomModal>
//     </>
//   );
// };
