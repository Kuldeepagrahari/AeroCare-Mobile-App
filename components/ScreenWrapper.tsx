import { View, StyleSheet } from 'react-native';

export default function ScreenWrapper({ children }:any) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,     // top space if needed
    paddingBottom: 80,  // enough space so tab bar doesn't overlap
    paddingHorizontal: 0,
  },
});
