// About.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, ButtonGroup } from "@rneui/themed";
import { updateDays, updateLang, getDays, getLang } from "./storageutil";

const About: React.FC = () => {
  const [orangeValue, setOrangeValue] = useState(7);
  const [redValue, setRedValue] = useState(14);
  const [selectedLanguage, setSelectedLanguage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result_days = await getDays();
        setOrangeValue(result_days.orange);
        setRedValue(result_days.red);
        const lang = await getLang();
        setSelectedLanguage(lang ? 0 : 1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleIncreaseOrange = () => {
    if (orangeValue < redValue) {
      setOrangeValue(orangeValue + 1);
      updateDays({ orange: orangeValue, red: redValue });
    }
  };

  const handleDecreaseOrange = () => {
    if (orangeValue > 1) {
      setOrangeValue(orangeValue - 1);
      updateDays({ orange: orangeValue, red: redValue });
    }
  };

  const handleIncreaseRed = () => {
    if (redValue < 60) {
      setRedValue(redValue + 1);
      updateDays({ orange: orangeValue, red: redValue });
    }
  };

  const handleDecreaseRed = () => {
    if (redValue > orangeValue) {
      setRedValue(redValue - 1);
      updateDays({ orange: orangeValue, red: redValue });
    }
  };

  return (
    <ScrollView>
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text
          style={{ fontSize: 16, paddingHorizontal: 20, fontWeight: "bold" }}
        >
          <Text style={{ fontStyle: "italic" }}>Muraja3a</Text> means review
          {"\n"}
        </Text>
        <Text style={{ fontSize: 16, paddingHorizontal: 20 }}>
          Quran memorization is a rewarding practice, but it’s important to also
          review what we’ve memorized. This app is a simple way to keep track of
          your Quran review.{"\n"}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          How do I use it?{"\n"}
        </Text>
        <Text style={{ fontSize: 16, paddingHorizontal: 20 }}>
          In the <Text style={{ fontWeight: "bold" }}>Edit</Text> tab, tap on
          each Surah you want to review regularly. This adds it to the Tracker.
          Tap again if you want to remove it.
          {"\n"}
          {"\n"}
          After you review a Surah, go into the{" "}
          <Text style={{ fontWeight: "bold" }}>Tracker</Text> tab and tap the
          Surah. This updates the last review to the current date. Tap the date
          if you want to correct it to a custom date.{"\n"}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Color Coding{"\n"}
        </Text>
        <Text style={{ fontSize: 16, paddingHorizontal: 20 }}>
          In the <Text style={{ fontWeight: "bold" }}>Tracker</Text>, Surahs
          will remain{" "}
          <Text style={{ fontWeight: "bold", color: "green" }}>green</Text> as
          long as you review them regularly. If you start to slack off, they
          will turn{" "}
          <Text style={{ fontWeight: "bold", color: "orange" }}>orange</Text>{" "}
          and eventually to{" "}
          <Text style={{ fontWeight: "bold", color: "red" }}>red</Text>.
        </Text>
      </View>
      <View
        style={{
          height: 3,
          backgroundColor: "#8c7851",
          marginVertical: 20,
        }}
      />
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 16,
          marginHorizontal: 20,
        }}
      >
        Customize the color coding based on your Quran review plan.
        {"\n"}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Button
          title="-"
          titleStyle={{ color: "white", fontSize: 20, fontWeight: "bold" }}
          onPress={handleDecreaseOrange}
          buttonStyle={{
            borderRadius: 9,
            marginLeft: 20,
            minWidth: 40,
            maxWidth: 40,
          }}
          color={"orange"}
        />
        <Button
          title="+"
          titleStyle={{ color: "white", fontSize: 20, fontWeight: "bold" }}
          onPress={handleIncreaseOrange}
          color={"orange"}
          buttonStyle={{
            borderRadius: 9,
            marginLeft: 5,
            minWidth: 40,
            maxWidth: 40,
          }}
        />
        <Text style={{ marginHorizontal: 10, fontSize: 16 }}>
          Surah turns <Text style={{ fontWeight: "bold" }}>orange</Text> after{" "}
          <Text style={{ fontWeight: "bold" }}>
            {orangeValue} {orangeValue > 1 ? "days" : "day"}
          </Text>
        </Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <Button
          title="-"
          titleStyle={{ color: "white", fontSize: 20, fontWeight: "bold" }}
          onPress={handleDecreaseRed}
          buttonStyle={{
            borderRadius: 9,
            marginLeft: 20,
            minWidth: 40,
            maxWidth: 40,
          }}
          color={"red"}
        />
        <Button
          title="+"
          titleStyle={{ color: "white", fontSize: 20, fontWeight: "bold" }}
          onPress={handleIncreaseRed}
          color={"red"}
          buttonStyle={{
            borderRadius: 9,
            marginLeft: 5,
            minWidth: 40,
            maxWidth: 40,
          }}
        />
        <Text style={{ marginHorizontal: 10, fontSize: 16 }}>
          Surah turns <Text style={{ fontWeight: "bold" }}>red</Text> after{" "}
          <Text style={{ fontWeight: "bold" }}>
            {redValue} {redValue > 1 ? "days" : "day"}
          </Text>
        </Text>
      </View>
      <View style={{ margin: 15 }}>
        <Text style={{ fontStyle: "italic" }}>
          *Note that you cannot set the orange value greater than the red value.
        </Text>
      </View>
      <View
        style={{
          height: 3,
          backgroundColor: "#8c7851",
          marginVertical: 10,
        }}
      />
      <View>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
            marginHorizontal: 20,
          }}
        >
          Display langauge for Surah names
        </Text>
        <ButtonGroup
          buttons={["Arabic", "English"]}
          selectedIndex={selectedLanguage}
          textStyle={{ fontSize: 16, color: "#8c7851" }}
          onPress={(value) => {
            setSelectedLanguage(value);
            updateLang(value === 0 ? true : false);
          }}
          containerStyle={{
            marginTop: 20,
            maxWidth: 200,
            alignSelf: "center",
            backgroundColor: "#f9f4ef",
          }}
          selectedButtonStyle={{ backgroundColor: "#8c7851" }}
          selectedTextStyle={{ color: "#f9f4ef" }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentView: {
    padding: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "stretch",
  },
});

// Commented out reset button for now
/*
<View
        style={{
          height: 5,
          backgroundColor: "#8c7851",
          marginVertical: 10,
        }}
      />
      <Text style={{ fontSize: 16, textAlign: "center" }}>
        {"\n"}If you want to start all over click the{" "}
        <Text style={{ fontWeight: "bold" }}>red</Text> button
      </Text>
      <Button
        color={"#ffbaba"}
        onPress={resetData}
        buttonStyle={{
          borderRadius: 9,
          marginTop: 8,
          marginBottom: 8,
          marginHorizontal: 80,
        }}
      >
        <Text style={{ fontSize: 20 }}>Reset all Surahs</Text>
      </Button>
      */

export default About;
