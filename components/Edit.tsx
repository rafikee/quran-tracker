// Edit.tsx
import { View, TouchableOpacity, ScrollView } from "react-native";
import {
  ListItem,
  Text,
  SocialIcon,
  Icon,
  Overlay,
  ButtonGroup,
  Button,
} from "@rneui/themed";
import React, { useEffect, useState } from "react";
import {
  getData,
  setData,
  Chapter,
  getLang,
  updateFormat,
  getFormat,
} from "./storageutil";
import InputComponent from "./Input";
import { appStyles, iconSizes, colors } from "../assets/styles";

interface TrackerProps {
  refreshData: boolean;
}

const Edit: React.FC<TrackerProps> = ({ refreshData }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [arabicTrue, setArabicTrue] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModify, setShowModify] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(0);
  const [updatePage, setUpdatePage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getData();
        setChapters(result);
        const lang = await getLang();
        setArabicTrue(lang);
        const format = await getFormat();
        setSelectedFormat(format);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data :(...", error);
      }
    };
    fetchData();
  }, [refreshData, updatePage]);

  if (isLoading) {
    // Display loading indicator while data is being fetched
    return (
      <View style={appStyles.container}>
        <SocialIcon loading iconSize={iconSizes.loadingIconSize} />
      </View>
    );
  }

  const handleChapterClick = async (id: number) => {
    const updatedChapters = chapters.map((chapter) =>
      chapter.id === id
        ? {
            ...chapter,
            review: chapter.review ? false : true,
          }
        : chapter
    );
    await setData(updatedChapters, setChapters);
  };

  // When the user clicks the modify button, show the Overlay
  const handleModify = () => {
    setShowModify(true);
  };

  // Handle clicking the save button
  const handleSave = async () => {
    setUpdatePage(!updatePage);
    setShowModify(false); // Hide the Overlay when clicking outside
  };

  // Handle changing the selection
  const buttonChange = async (id: number) => {
    await updateFormat(id);
    setSelectedFormat(id);
  };

  const renderChapters = () => {
    if (!chapters) {
      return (
        <View style={appStyles.container}>
          <Text style={appStyles.infoText}>This should not show up.</Text>
        </View>
      );
    } else if (chapters.length === 0) {
      return (
        <View style={appStyles.container}>
          <Text style={appStyles.infoText}>
            Please click the
            <Text style={{ fontWeight: "bold" }}> Settings icon </Text>above and
            add items to your list.
          </Text>
        </View>
      );
    }
    return chapters.map((chapter) => (
      <TouchableOpacity
        onPress={() => handleChapterClick(chapter.id)}
        key={chapter.id}
        style={appStyles.chapter}
        activeOpacity={colors.buttonClick}
      >
        <ListItem.Content
          style={[
            appStyles.chapterContainer,
            appStyles.shadow,
            { backgroundColor: chapter.review ? colors.good : colors.neutral },
          ]}
        >
          <View style={appStyles.chapterDate}>
            <Text>{chapter.review ? "In Tracker" : "Not Memorized"}</Text>
            <ListItem.Title style={appStyles.chapterTitle}>
              <Text>{arabicTrue ? chapter.name : chapter.transliteration}</Text>
            </ListItem.Title>
          </View>
        </ListItem.Content>
      </TouchableOpacity>
    ));
  };

  const renderHeader = () => {
    return (
      <View style={appStyles.headerContainer}>
        <View style={[appStyles.header, appStyles.shadow]}>
          <View style={appStyles.container}>{renderSettingsButton()}</View>
          <View style={appStyles.container}>
            <Text style={appStyles.headerTitle}>Edit</Text>
          </View>
          <View style={appStyles.headerEmptySpace}></View>
        </View>
      </View>
    );
  };

  const renderSettingsButton = () => {
    return (
      <Button onPress={handleModify} type="clear">
        <Icon
          name="settings"
          color={colors.light}
          size={iconSizes.headerIconSize}
        />
      </Button>
    );
  };

  const renderSettingsMenu = () => {
    return (
      <View style={appStyles.spacer}>
        <Text style={appStyles.headingText}>Select a format for tracking</Text>
        <ButtonGroup
          buttons={["Surah", "Juz", "Custom"]}
          selectedIndex={selectedFormat}
          textStyle={appStyles.buttonGroupText}
          onPress={(value) => {
            buttonChange(value);
          }}
          containerStyle={appStyles.buttonSelector}
          selectedButtonStyle={{ backgroundColor: colors.dark }}
          selectedTextStyle={{ color: colors.light }}
        />

        <View style={appStyles.spacer}>{renderSettingsContent()}</View>
        <View style={{ alignItems: "center" }}>
          {selectedFormat !== 2 && (
            // We will show a different done button in Custom formatting
            <Button
              containerStyle={appStyles.doneButtonContainer}
              color={colors.dark}
              onPress={handleSave}
              radius="sm"
            >
              Done
            </Button>
          )}
          <Text style={{ fontStyle: "italic" }}>
            *The data is saved independently for each format
          </Text>
        </View>
      </View>
    );
  };

  const renderSettingsContent = () => {
    if (selectedFormat === 0) {
      return (
        <Text style={appStyles.settingsText}>
          Track your review progress by each Surah
        </Text>
      );
    } else if (selectedFormat === 1) {
      return (
        <Text style={appStyles.settingsText}>
          Track your review progress by each Juz
        </Text>
      );
    } else {
      return (
        <View>
          <Text style={[appStyles.settingsText, { paddingBottom: 20 }]}>
            Create your own custom list below
          </Text>

          <InputComponent onDone={handleSave} />
        </View>
      );
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      <ScrollView style={appStyles.spacer}>{renderChapters()}</ScrollView>
      <Overlay
        isVisible={showModify}
        overlayStyle={appStyles.settingsContainer}
      >
        {renderSettingsMenu()}
      </Overlay>
    </View>
  );
};

export default Edit;
