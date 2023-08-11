// Tracker.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ListItem,
  Button,
  Text,
  Icon,
  SocialIcon,
  Overlay,
} from "@rneui/themed";
// Import components from other files
import {
  getData,
  setData,
  Chapter,
  getDays,
  days,
  getLang,
} from "./storageutil";
import { appStyles, colors, iconSizes } from "../assets/styles";
import { BottomSheet } from "@rneui/base";

// this variable is passed from App.tsx to force a refresh of the data when it changes
interface TrackerProps {
  refreshData: boolean;
}

const Tracker: React.FC<TrackerProps> = ({ refreshData }) => {
  // List of chapters objects that we display
  const [chapters, setChapters] = useState<Chapter[]>([]);
  // List of previous chapters lists we use for undo
  const [previousChapters, setPreviousChapters] = useState<Chapter[][]>([]); // new state variable to keep track of previous states
  // Variable we use to keep track when chapters change colors
  const [chapterColors, setChapterColors] = useState<days>({
    orange: 7,
    red: 14,
  });
  // Use Arabic or english, when using custom this doesn't matter
  const [arabicTrue, setArabicTrue] = useState<boolean>(true);
  // Loading indicator is shown when we switch between tabs
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // we used this to keep track of which chapter we are updating
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );

  // When refreshdData is toggled load from storage
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

  // when a user clicks on a chapter updates the date for that chapter
  const handleChapterClick = async (id: number) => {
    const currentDate = new Date();
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === id ? { ...chapter, date: currentDate } : chapter
    );
    setPreviousChapters([...previousChapters, updatedChapters]); // push current state onto previous states for undo
    await setData(updatedChapters, setChapters);
  };

  // when a user holds on a chapter it swithces back to Not Reviewed
  const handleChapterReset = async (id: number) => {
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === id ? { ...chapter, date: "Not reviewed" } : chapter
    );
    setPreviousChapters([...previousChapters, updatedChapters]); // push current state onto previous states for undo
    await setData(updatedChapters, setChapters);
  };

  // opens up the calendar modal
  const handleDateClick = (id: number) => {
    setSelectedChapterId(id);
    setShowDatePicker(true);
  };

  // When a user selects a date from the calendar modal apply a new date to the chapter
  const handleDateSelect = async (date: Date) => {
    setShowDatePicker(false);
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === selectedChapterId ? { ...chapter, date } : chapter
    );
    setPreviousChapters([...previousChapters, updatedChapters]); // push current state onto previous states for undo
    await setData(updatedChapters, setChapters);
  };

  // when the user presses undo, only allow undo if there are previous states
  const handleUndo = () => {
    if (previousChapters.length > 1) {
      // only undo if there are previous states
      const previousState = previousChapters[previousChapters.length - 2]; // get previous state
      setPreviousChapters(previousChapters.slice(0, -1)); // remove current state from previous states
      setData(previousState, setChapters);
    }
  };

  // Render the chapters
  const renderChapters = () => {
    // if there are no chapters display a message
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
    // calculate chapter color
    const getChapterColor = (date: Date | string): string => {
      if (date === "Not reviewed") {
        return colors.neutral;
      }
      const d = new Date(date);

      const longTimeAgo = new Date();
      const shortTimeAgo = new Date();
      longTimeAgo.setDate(longTimeAgo.getDate() - chapterColors.red);
      shortTimeAgo.setDate(shortTimeAgo.getDate() - chapterColors.orange);
      if (d < longTimeAgo) {
        return colors.longTimeAgo;
      } else if (d < shortTimeAgo) {
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
    // render the list of chapters
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
            {/* Chapter Date */}
            <Button
              type="clear"
              size="sm"
              onPress={() => handleDateClick(chapter.id)}
            >
              {getFormattedDate(chapter.date)}
            </Button>
            {/* Chapter name */}
            <ListItem.Title style={appStyles.chapterTitle}>
              <Text>{arabicTrue ? chapter.name : chapter.transliteration}</Text>
            </ListItem.Title>
          </View>
        </ListItem.Content>
      </TouchableOpacity>
    ));
  };

  // show the undo button if there are chapters
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

  // render the header on the page
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

  // render the calendar modal
  // we have one for ios and one for android
  const renderDatePicker = () => {
    if (Platform.OS !== "ios") {
      return (
        <View>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              maximumDate={new Date()}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                if (selectedDate && event.type != "dismissed") {
                  // if a user clicks cancel on android we don't do this
                  handleDateSelect(selectedDate); // Call the handleDateSelect function with the selected date
                } else {
                  setShowDatePicker(false);
                }
              }}
            />
          )}
        </View>
      );
    } else {
      return (
        <Overlay
          isVisible={showDatePicker}
          onBackdropPress={() => setShowDatePicker(false)}
        >
          <DateTimePicker
            value={new Date()}
            themeVariant="light"
            maximumDate={new Date()}
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                // if a user clicks cancel on android we don't do this
                handleDateSelect(selectedDate); // Call the handleDateSelect function with the selected date
              } else {
                setShowDatePicker(false);
              }
            }}
          />
        </Overlay>
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      <ScrollView style={appStyles.spacer}>
        {renderChapters()}
        <View style={appStyles.spacer}></View>
      </ScrollView>
      {renderDatePicker()}
    </View>
  );
};

export default Tracker;
