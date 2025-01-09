import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Login from "./src/components/Login";
import Account from "./src/components/Account";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";

import "./global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import * as React from "react";

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <View>
        {session && session.user ? (
          <Account key={session.user.id} session={session} />
        ) : (
          <Login />
        )}
      </View>
    </ThemeProvider>
  );
}
