// About.tsx
import React from "react";
import { View } from "react-native";
import { Button, Text } from "@rneui/themed";
import { resetData } from "./storageutil";

const About: React.FC = () => {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 16 }}>
        Welcome to the Quran Memorization Tracker application.
      </Text>
      <Button
        color={"#f25042"}
        onPress={resetData}
        buttonStyle={{
          borderRadius: 9,
          marginTop: 8,
          marginBottom: 8,
          marginHorizontal: 80,
        }}
      >
        Reset all Surahs
      </Button>
    </View>
  );
};

export default About;
