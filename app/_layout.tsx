import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import * as SystemUI from "expo-system-ui";
import React, { useEffect } from "react";
import { THEME_COLORS } from "../constants/theme";
import { HabitsProvider } from "../providers/HabitsProvider";
import { NotesProvider } from "../providers/NotesProvider";
import { TasksProvider } from "../providers/TasksProvider";

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: THEME_COLORS.background,
    card: THEME_COLORS.surface,
  },
};

export default function Layout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(THEME_COLORS.background);
  }, []);

  return (
    <ThemeProvider value={navigationTheme}>
      <TasksProvider>
        <NotesProvider>
          <HabitsProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: THEME_COLORS.background },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="new-task"
                options={{
                  presentation: "transparentModal",
                  animation: "slide_from_bottom",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="habits"
                options={{
                  presentation: "transparentModal",
                  animation: "slide_from_bottom",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="new-habit"
                options={{
                  presentation: "transparentModal",
                  animation: "slide_from_bottom",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="note/[id]"
                options={{
                  animation: "slide_from_right",
                  contentStyle: { backgroundColor: THEME_COLORS.background },
                }}
              />
            </Stack>
          </HabitsProvider>
        </NotesProvider>
      </TasksProvider>
    </ThemeProvider>
  );
}
