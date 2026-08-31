import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <View>
        <Text style={[styles.title, { color: "gray" }]}>Hello, World!</Text>
        <Text style={styles.text}>Testando o StylesSheet do react native</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "red",
    fontSize: 40,
  },
  text: {
    color: "blue",
    fontSize: 20,
  },
});
