// Tracker.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, StyleSheet, View } from "react-native";
import { ListItem, Overlay, Button, Text, SocialIcon } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  getData,
  setData,
  Chapter,
  getDays,
  days,
  getLang,
} from "./storageutil";

interface TrackerProps {
  refreshData: boolean;
}

const Tracker: React.FC<TrackerProps> = ({ refreshData }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [colors, setColors] = useState<days>({ orange: 7, red: 14 });
  const [arabicTrue, setArabicTrue] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getData();
        setChapters(result);
        const result_days = await getDays();
        setColors(result_days);
        const lang = await getLang();
        setColors(result_days);
        setArabicTrue(lang);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  if (isLoading) {
    // Display loading indicator while data is being fetched
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <SocialIcon loading iconSize={100} />
      </View>
    );
  }

  const handleChapterClick = async (id: number) => {
    const currentDate = new Date();
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === id ? { ...chapter, date: currentDate } : chapter
    );
    await setData(updatedChapters, setChapters);
  };

  const handleDateClick = (id: number) => {
    setSelectedChapterId(id);
    setShowDatePicker(true);
  };

  const handleDateSelect = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      if (selectedChapterId !== null) {
        const updatedChapters = chapters.map((chapter) =>
          chapter.id === selectedChapterId ? { ...chapter, date } : chapter
        );
        setData(updatedChapters, setChapters);
      }
    }
  };

  const toggleOverlay = () => {
    setShowDatePicker(!showDatePicker);
  };

  const renderChapters = () => {
    if (chapters.filter((chapter) => chapter.review).length === 0) {
      return (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text style={{ fontSize: 16 }}>
            Start in the Info tab to learn how this works.
          </Text>
        </View>
      );
    }
    const getChapterColor = (date: Date | string): string => {
      if (date === "Not reviewed") {
        return "#eaddcf";
      }
      const d = new Date(date);

      const longTimeAgo = new Date();
      const shortTimeAgo = new Date();
      longTimeAgo.setDate(longTimeAgo.getDate() - colors.red);
      shortTimeAgo.setDate(shortTimeAgo.getDate() - colors.orange);
      if (d < longTimeAgo) {
        return "#ffbaba";
      } else if (d < shortTimeAgo) {
        return "#FFD3A3";
      } else {
        return "#c9d5b5";
      }
    };

    const getFormattedDate = (date: Date | string): string => {
      if (!date) {
        return "Not reviewed";
      }

      if (date === "Not reviewed") {
        return "Not reviewed";
      }
      const d = new Date(date);
      const options = {
        month: "short",
        day: "2-digit",
        year: "numeric",
      } as const;
      return d.toLocaleDateString("en-US", options);
    };

    const reviewedChapters = chapters.filter((chapter) => chapter.review);
    return reviewedChapters.map((chapter) => (
      <TouchableOpacity
        onPress={() => handleChapterClick(chapter.id)}
        key={chapter.id}
        style={styles.button}
        activeOpacity={0.4}
      >
        <ListItem.Content
          style={{
            backgroundColor: getChapterColor(chapter.date),
            borderRadius: 9,
            padding: 8,
          }}
        >
          <View style={styles.titleContainer}>
            <Button
              type="clear"
              size="sm"
              onPress={() => handleDateClick(chapter.id)}
            >
              {getFormattedDate(chapter.date)}
            </Button>
            <ListItem.Title style={styles.title}>
              <Text>{arabicTrue ? chapter.name : chapter.transliteration}</Text>
            </ListItem.Title>
          </View>
        </ListItem.Content>
      </TouchableOpacity>
    ));
  };

  const renderCalendar = () => {
    return (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="inline"
        onChange={handleDateSelect}
        maximumDate={new Date()}
        accentColor="#8c7851"
      />
    );
  };

  return (
    <View>
      <ScrollView style={{ paddingTop: 8 }}>{renderChapters()}</ScrollView>
      <Overlay
        isVisible={showDatePicker}
        onBackdropPress={toggleOverlay}
        overlayStyle={{ borderRadius: 20 }}
      >
        {renderCalendar()}
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 9,
  },
  title: {
    flex: 1,
    textAlign: "right",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%",
  },
});

export default Tracker;
