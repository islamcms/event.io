import React from 'react';
import { Image } from 'react-native';

export default Avatar = ({ rounded = true, user, size, style }) => {
  const imgSource =
    user.picture ||
    `https://fakeimg.pl/${size}x${size}/333/?text=${user.username[0].toUpperCase()}&font=noto`;

  const radius = rounded ? 100 : 10;
  return (
    <Image
      width={size}
      height={size}
      style={[{ width: size, height: size, borderRadius: radius }, style]}
      source={{ uri: imgSource }}
    />
  );
};
