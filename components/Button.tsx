import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';
import { colors } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    let buttonStyle: StyleProp<ViewStyle> = [styles.button];
    
    // Add variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = [...buttonStyle, styles.primaryButton];
        break;
      case 'secondary':
        buttonStyle = [...buttonStyle, styles.secondaryButton];
        break;
      case 'outline':
        buttonStyle = [...buttonStyle, styles.outlineButton];
        break;
      case 'text':
        buttonStyle = [...buttonStyle, styles.textButton];
        break;
    }
    
    // Add size styles
    switch (size) {
      case 'small':
        buttonStyle = [...buttonStyle, styles.smallButton];
        break;
      case 'large':
        buttonStyle = [...buttonStyle, styles.largeButton];
        break;
    }
    
    // Add disabled style
    if (disabled) {
      buttonStyle = [...buttonStyle, styles.disabledButton];
    }
    
    // Add full width style
    if (fullWidth) {
      buttonStyle = [...buttonStyle, styles.fullWidthButton];
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleArray: StyleProp<TextStyle> = [styles.buttonText];
    
    switch (variant) {
      case 'primary':
        textStyleArray = [...textStyleArray, styles.primaryButtonText];
        break;
      case 'secondary':
        textStyleArray = [...textStyleArray, styles.secondaryButtonText];
        break;
      case 'outline':
        textStyleArray = [...textStyleArray, styles.outlineButtonText];
        break;
      case 'text':
        textStyleArray = [...textStyleArray, styles.textButtonText];
        break;
    }
    
    if (disabled) {
      textStyleArray = [...textStyleArray, styles.disabledButtonText];
    }
    
    return textStyleArray;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? colors.white : colors.primary} 
          size="small" 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  fullWidthButton: {
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: colors.white,
  },
  outlineButtonText: {
    color: colors.primary,
  },
  textButtonText: {
    color: colors.primary,
  },
  disabledButtonText: {
    opacity: 0.8,
  },
});