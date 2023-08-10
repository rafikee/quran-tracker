// Tracker.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
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
import { appStyles, colors, iconSizes } from "../assets/styles";

interface TrackerProps {
  refreshData: boolean;
}

const Tracker: React.FC<TrackerProps> = ({ refreshData }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [previousChapters, setPreviousChapters] = useState<Chapter[][]>([]); // new state variable to keep track of previous states
  const [chapterColors, setChapterColors] = useState<days>({
    orange: 7,
    red: 14,
  });
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
        const result_days = await getDays();
        setChapterColors(result_days);
        const lang = await getLang();
        setChapterColors(result_days);
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
      <View style={appStyles.container}>
        <SocialIcon loading iconSize={iconSizes.loadingIconSize} />
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
        <View style={appStyles.container}>
          <Text style={appStyles.infoText}>
            Start in the <Text style={{ fontWeight: "bold" }}>Info</Text> tab to
            learn how this works.
          </Text>
        </View>
      );
    }
    const getChapterColor = (date: Date | string): string => {
      if (date === "Not reviewed") {
        return colors.neutral;
      }

      const longTimeAgo = new Date();
      const shortTimeAgo = new Date();
      longTimeAgo.setDate(longTimeAgo.getDate() - chapterColors.red);
      shortTimeAgo.setDate(shortTimeAgo.getDate() - chapterColors.orange);
      if (date < longTimeAgo) {
        return colors.longTimeAgo;
      } else if (date < shortTimeAgo) {
        return colors.shortTimeAgo;
      } else {
        return colors.good;
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
        style={appStyles.chapter}
        activeOpacity={colors.buttonClick}
      >
        <ListItem.Content
          style={[
            appStyles.chapterContainer,
            appStyles.shadow,
            { backgroundColor: getChapterColor(chapter.date) },
          ]}
        >
          <View style={appStyles.chapterDate}>
            <Button
              type="clear"
              size="sm"
              onPress={() => handleDateClick(chapter.id)}
            >
              {getFormattedDate(chapter.date)}
            </Button>
            <ListItem.Title style={appStyles.chapterTitle}>
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
          disabled={previousChapters.length < 2}
          type="clear"
          disabledStyle={{ opacity: 0.5 }}
        >
          <Icon
            name="undo"
            type="font-awesome"
            color={colors.light}
            size={iconSizes.headerIconSize}
          />
        </Button>
      );
    }
  };

  const renderHeader = () => {
    return (
      <View style={appStyles.headerContainer}>
        <View style={[appStyles.header, appStyles.shadow]}>
          <View style={appStyles.container}>{renderUndo()}</View>
          <View style={appStyles.container}>
            <Text style={appStyles.headerTitle}>Tracker</Text>
          </View>
          <View style={appStyles.headerEmptySpace}></View>
        </View>
      </View>
    );
  };

  const renderDatePicker = () => {
    return (
      <DateTimePickerModal
        isVisible={showDatePicker}
        display="inline"
        onConfirm={handleDateSelect}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      <ScrollView style={appStyles.spacer}>{renderChapters()}</ScrollView>
      {renderDatePicker()}
    </View>
  );
};

export default Tracker;
