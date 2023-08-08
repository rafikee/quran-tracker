// Tracker.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, StyleSheet, View } from "react-native";
import { ListItem, Button, Text, SocialIcon, Icon } from "@rneui/themed";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
  const [previousChapters, setPreviousChapters] = useState<Chapter[][]>([]); // new state variable to keep track of previous states
  const [colors, setColors] = useState<days>({ orange: 7, red: 14 });
  const [arabicTrue, setArabicTrue] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getData();
        setChapters(result);
        setPreviousChapters([result]);
        /* Can turn this in the future if we want to allow undoing even if editing the chapters
        only initialize previous state if it hasn't been initialized yet
        if (previousChapters.length === 0) {
          setPreviousChapters([result]);
        }*/
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
    setPreviousChapters([...previousChapters, updatedChapters]); // push current state onto previous states
    await setData(updatedChapters, setChapters);
  };

  const handleChapterReset = async (id: number) => {
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === id ? { ...chapter, date: "Not reviewed" } : chapter
    );
    setPreviousChapters([...previousChapters, updatedChapters]); // push current state onto previous states
    await setData(updatedChapters, setChapters);
  };

  const handleDateClick = (id: number) => {
    setSelectedChapterId(id);
    setShowDatePicker(true);
  };

  const handleDateSelect = async (date: Date) => {
    setShowDatePicker(false);
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === selectedChapterId ? { ...chapter, date } : chapter
    );
    setPreviousChapters([...previousChapters, updatedChapters]); // push current state onto previous states
    await setData(updatedChapters, setChapters);
  };

  const handleUndo = () => {
    if (previousChapters.length > 1) {
      // only undo if there are previous states
      const previousState = previousChapters[previousChapters.length - 2]; // get previous state
      setPreviousChapters(previousChapters.slice(0, -1)); // remove current state from previous states
      setData(previousState, setChapters);
    }
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

      const longTimeAgo = new Date();
      const shortTimeAgo = new Date();
      longTimeAgo.setDate(longTimeAgo.getDate() - colors.red);
      shortTimeAgo.setDate(shortTimeAgo.getDate() - colors.orange);
      if (date < longTimeAgo) {
        return "#ffbaba";
      } else if (date < shortTimeAgo) {
        return "#FFD3A3";
      } else {
        return "#c9d5b5";
      }
    };

    const getFormattedDate = (date: Date | string): string => {
      if (!date || date === "Not reviewed") {
        return "Not reviewed";
      }

      const d = new Date(date);

      const options = {
        month: "short",
        day: "2-digit",
        year: "numeric",
      } as const;
      return d.toLocaleString("en-US", options);
    };

    const reviewedChapters = chapters
      .filter((chapter) => chapter.review) // we only want the chapters that are being reviewed
      .sort((a, b) => a.id - b.id); // sort by the id field
    return reviewedChapters.map((chapter) => (
      <TouchableOpacity
        onPress={() => handleChapterClick(chapter.id)}
        onLongPress={() => handleChapterReset(chapter.id)}
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

  const renderUndo = () => {
    if (chapters.filter((chapter) => chapter.review).length > 0) {
      return (
        <Button
          onPress={handleUndo}
          radius={"sm"}
          containerStyle={{
            marginHorizontal: 40,
            marginVertical: 5,
            maxWidth: 50,
          }}
          color={"#8c7851"}
          disabled={previousChapters.length < 2}
        >
          <Icon name="undo" color={"white"} />
        </Button>
      );
    }
  };

  return (
    <View>
      <ScrollView style={{ paddingTop: 8 }}>{renderChapters()}</ScrollView>
      {renderUndo()}
      <DateTimePickerModal
        isVisible={showDatePicker}
        display="inline"
        onConfirm={handleDateSelect}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
        accentColor="#8c7851"
        buttonTextColorIOS="#8c7851"
      />
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
