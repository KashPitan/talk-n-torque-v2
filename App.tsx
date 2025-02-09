import "./gesture-handler";
import { useState, useEffect } from "react";
import * as React from "react";
import { View, Platform } from "react-native";

import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";

import {
  NavigationContainer,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

import Login from "./src/components/Login";
import Home from "./src/screens/Home";
// import Account from "./src/components/Account";

import "./global.css";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {
    regular: {
      fontFamily: "lato",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "lato",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "lato",
      fontWeight: "300",
    },
    heavy: {
      fontFamily: "lato",
      fontWeight: "100",
    },
  },
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: {
    regular: {
      fontFamily: "lato",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "lato",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "lato",
      fontWeight: "300",
    },
    heavy: {
      fontFamily: "lato",
      fontWeight: "100",
    },
  },
};

const Stack = createStackNavigator();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      // SplashScreen.hideAsync();
    });
  }, []);

  const [session, setSession] = useState<Session | null>(null);
  const [initialRouteName, setInitialRouteName] = useState<"Home" | "Login">(
    "Login"
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      console.log("test");
      setInitialRouteName("Home");
    }
  }, [session]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <NavigationContainer>
        {/* <View>
          {session && session.user ? (
            <Account key={session.user.id} session={session} />
          ) : (
            <Login />
          )}
        </View> */}
        <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
