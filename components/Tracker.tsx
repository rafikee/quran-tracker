// Tracker.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, StyleSheet, View } from "react-native";
import { ListItem, Overlay, Button, Text } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getData, setData, Chapter } from "./storageutil";
import { getChapterColor, getFormattedDate } from "./ChapterFormat";

interface TrackerProps {
  refreshData: boolean;
}

const Tracker: React.FC<TrackerProps> = ({ refreshData }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData();
        setChapters(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );

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
            Please go to the Edit tab and add Surahs to review.
          </Text>
        </View>
      );
    }
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
              <Text>{chapter.name}</Text>
            </ListItem.Title>
          </View>
        </ListItem.Content>
      </TouchableOpacity>
    ));
  };

  const renderCalendar = () => {
    return (
      <View style={styles.modalContainer}>
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="inline"
          onChange={handleDateSelect}
          maximumDate={new Date()}
        />
      </View>
    );
  };

  return (
    <View>
      <ScrollView style={{ paddingTop: 8 }}>{renderChapters()}</ScrollView>
      <Overlay isVisible={showDatePicker} onBackdropPress={toggleOverlay}>
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
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%",
  },
});

export default Tracker;
