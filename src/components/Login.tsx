import { useState } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import { supabase } from "../../lib/supabase";
import { useForm, Controller } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

import * as React from "react";
import FormInput from "./FormInput";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

type FormData = {
  email: string;
  password: string;
};

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signInWithEmail(data: FormData) {
    setLoading(true);
    setLoginError(false);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    console.log(error);

    if (error) setLoginError(true);
    if (!error) {
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Name"
              id="name"
              error={errors.email ? errors.email.message : undefined}
            >
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="email@address.com"
                autoCapitalize={"none"}
              />
            </FormInput>
          )}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Password"
              id="password"
              error={errors.password ? errors.password.message : undefined}
            >
              <Input
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize={"none"}
              />
            </FormInput>
          )}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button disabled={loading} onPress={handleSubmit(signInWithEmail)}>
          <Text>Sign in</Text>
        </Button>
        {loginError && (
          <Text style={{ color: "red" }}>Incorrect login details</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
