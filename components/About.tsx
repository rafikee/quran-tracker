// About.tsx
import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Slider, Icon } from "@rneui/themed";
import { resetData, updateDays } from "./storageutil";

const About: React.FC = () => {
  const [orangeValue, setOrangeValue] = useState(7);
  const [redValue, setRedValue] = useState(14);
  return (
    <ScrollView>
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Muraja3a is a simple Quran review tracker{"\n"}
        </Text>
        <Text style={{ fontSize: 16, paddingHorizontal: 20 }}>
          While memorizing Quran is very important we should not forget to
          revise what we already know. Use this app to keep yourself accountable
          and review often.{"\n"}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          How do I use it?{"\n"}
        </Text>
        <Text style={{ fontSize: 16, paddingHorizontal: 20 }}>
          Start by going to the Edit tab and add each Surah want to review
          regularly. Simply click on a Surah to add it and click again to remove
          it from the tracker.
          {"\n"}
          {"\n"}
          Then in the Tracker tab click on a Surah when you finishing reviewing
          it each day. This will update the last reviewed date to the current
          day.
          {"\n"}
          {"\n"}
          You can also click on the date itself to correct it to a previous day.
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Color Coding{"\n"}
        </Text>
        <Text style={{ fontSize: 16, paddingHorizontal: 20 }}>
          As long as you keep up with your revisions each Surah will remain
          green. If you start to slack off they will turn to orange and
          eventually to red.
          {"\n"}
          {"\n"}
          Cutomize how many days it takes to go from green to orange to red
          below. Please keep the orange value lower than the red value. We'll
          fix this potential bug soon.
        </Text>
        <View style={[styles.contentView]}>
          <Text style={{ paddingTop: 20, fontSize: 16 }}>
            Surah will become <Text style={{ fontWeight: "bold" }}>orange</Text>{" "}
            after <Text style={{ fontWeight: "bold" }}>{orangeValue}</Text> days
          </Text>
          <Slider
            value={orangeValue}
            onValueChange={setOrangeValue}
            maximumValue={40}
            minimumValue={1}
            step={1}
            allowTouchTrack
            minimumTrackTintColor="orange"
            trackStyle={{ height: 5, backgroundColor: "transparent" }}
            thumbStyle={{
              height: 20,
              width: 20,
              backgroundColor: "transparent",
            }}
            thumbProps={{
              children: (
                <Icon
                  name="circle"
                  type="font-awesome"
                  size={8}
                  reverse
                  containerStyle={{ bottom: 8, right: 8 }}
                  //color={color()}
                />
              ),
            }}
          />
          <Text style={{ paddingTop: 20, fontSize: 16 }}>
            Surah will become <Text style={{ fontWeight: "bold" }}>red</Text>{" "}
            after <Text style={{ fontWeight: "bold" }}>{redValue}</Text> days
          </Text>
          <Slider
            value={redValue}
            onValueChange={setRedValue}
            maximumValue={60}
            minimumValue={1}
            step={1}
            allowTouchTrack
            minimumTrackTintColor="red"
            trackStyle={{ height: 5, backgroundColor: "transparent" }}
            thumbStyle={{
              height: 20,
              width: 20,
              backgroundColor: "transparent",
            }}
            thumbProps={{
              children: (
                <Icon
                  name="circle"
                  type="font-awesome"
                  size={8}
                  reverse
                  containerStyle={{ bottom: 8, right: 8 }}
                />
              ),
            }}
          />
          <Text style={{ fontSize: 16 }}>
            Make sure to click <Text style={{ fontWeight: "bold" }}>Save</Text>{" "}
            when done
          </Text>
        </View>
        <Button
          color={"#a5b984"}
          onPress={() => {
            updateDays({ orange: orangeValue, red: redValue });
          }}
          buttonStyle={{
            borderRadius: 9,
            marginTop: 8,
            marginBottom: 8,
            marginHorizontal: 80,
          }}
        >
          Save
        </Button>
        <Text style={{ fontSize: 16 }}>
          {"\n"}If you want to start all over click the{" "}
          <Text style={{ fontWeight: "bold" }}>red</Text> button
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

export default About;
