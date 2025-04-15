import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Always render a Slot to ensure there's a navigator on first render
  if (!loaded) {
    return <Slot />;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="charity/[id]" 
        options={{ 
          title: "Charity Details",
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="donate/[type]" 
        options={{ 
          title: "Make a Donation",
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="payment" 
        options={{ 
          title: "Payment",
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="donation-success" 
        options={{ 
          headerShown: false,
          animation: 'fade',
        }} 
      />
      <Stack.Screen 
        name="blood-request/[id]" 
        options={{ 
          title: "Blood Request",
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="create-blood-request" 
        options={{ 
          title: "Create Blood Request",
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="add-charity" 
        options={{ 
          title: "Add Charity",
          animation: 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="kyc-verification" 
        options={{ 
          title: "KYC Verification",
          animation: 'slide_from_right',
        }} 
      />
    </Stack>
  );
}