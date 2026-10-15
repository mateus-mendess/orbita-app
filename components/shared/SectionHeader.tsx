import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { THEME_COLORS } from "../../constants/theme";

interface SectionHeaderProps {
  title: string;
  count?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  style?: object;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  count,
  icon,
  iconColor,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      {icon ? (
        <Ionicons
          name={icon}
          size={22}
          color={iconColor || THEME_COLORS.text}
          style={styles.icon}
        />
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {count !== undefined ? (
        <Text style={styles.count}>· {count}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    color: THEME_COLORS.text,
    fontSize: 20,
    fontWeight: "600",
  },
  count: {
    color: THEME_COLORS.textMuted,
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
});
