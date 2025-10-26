import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export function useThemeColor() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  return { colors, isDark: colorScheme === 'dark' };
}