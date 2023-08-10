import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <SocialIcon loading iconSize={100} />
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
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text style={{ fontSize: 16 }}>This should not show up.</Text>
        </View>
      );
    } else if (chapters.length === 0) {
      return (
        <Text style={{ alignSelf: "center", padding: 20 }}>
          Please click{" "}
          <Text style={{ fontWeight: "bold" }}>Change the format </Text>above
          and add items to your list.
        </Text>
      );
    }
    return chapters.map((chapter) => (
      <TouchableOpacity
        onPress={() => handleChapterClick(chapter.id)}
        key={chapter.id}
        style={styles.button}
        activeOpacity={0.4}
      >
        <ListItem.Content
          style={{
            backgroundColor: chapter.review ? "#c9d5b5" : "#eaddcf",
            borderRadius: 9,
            padding: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <View style={styles.titleContainer}>
            <Text>{chapter.review ? "In Tracker" : "Not Memorized"}</Text>
            <ListItem.Title style={styles.title}>
              <Text>{arabicTrue ? chapter.name : chapter.transliteration}</Text>
            </ListItem.Title>
          </View>
        </ListItem.Content>
      </TouchableOpacity>
    ));
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          overflow: "hidden",
          paddingBottom: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "black",
            borderBottomWidth: 0.5,
            backgroundColor: "#8c7851",
            maxHeight: 40,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {renderSettingsButton()}
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Chapters
            </Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
      </View>
    );
  };

  const renderSettingsButton = () => {
    return (
      <Button
        onPress={handleModify}
        containerStyle={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 5,
          minHeight: 50,
        }}
        color={"#8c7851"}
        type="clear"
      >
        <Icon name="settings" color="white" size={25} />
      </Button>
    );
  };

  const renderContent = () => {
    if (selectedFormat === 0) {
      return (
        <Text
          style={{
            alignSelf: "center",
            fontSize: 16,
            paddingBottom: 5,
          }}
        >
          Track your review progress by each Surah
        </Text>
      );
    } else if (selectedFormat === 1) {
      return (
        <Text
          style={{
            alignSelf: "center",
            fontSize: 16,
            paddingBottom: 5,
          }}
        >
          Track your review progress by each Juz
        </Text>
      );
    } else {
      return (
        <View>
          <Text
            style={{
              alignSelf: "center",
              paddingBottom: 20,
              fontSize: 16,
            }}
          >
            Create your own custom list below
          </Text>
          <InputComponent onDone={handleSave} />
        </View>
      );
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          backgroundColor: "#8c7851",
        }}
      ></SafeAreaView>
      {renderHeader()}
      <ScrollView>{renderChapters()}</ScrollView>
      <Overlay
        isVisible={showModify}
        overlayStyle={{
          minHeight: 200,
          maxHeight: 700,
          width: 350,
          borderRadius: 9,
          backgroundColor: "#f9f4ef",
        }}
      >
        <View>
          <Text
            style={{
              alignSelf: "center",
              paddingTop: 10,
              paddingHorizontal: 10,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Select a format for tracking
          </Text>
          <ButtonGroup
            buttons={["Surah", "Juz", "Custom"]}
            selectedIndex={selectedFormat}
            textStyle={{ fontSize: 16, color: "#8c7851" }}
            onPress={(value) => {
              buttonChange(value);
            }}
            containerStyle={{
              marginTop: 10,
              width: 220,
              alignSelf: "center",
              backgroundColor: "#f9f4ef",
            }}
            selectedButtonStyle={{ backgroundColor: "#8c7851" }}
            selectedTextStyle={{ color: "#f9f4ef" }}
          />

          <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
            {renderContent()}
          </View>
          {selectedFormat !== 2 && ( // We will show a different done button in Custom formatting
            <Button
              containerStyle={{
                paddingVertical: 10,
                alignSelf: "center",
              }}
              buttonStyle={{ width: 75 }}
              color={"#8c7851"}
              radius={"sm"}
              onPress={handleSave}
            >
              Done
            </Button>
          )}
          <Text
            style={{
              alignSelf: "center",
              fontSize: 14,
              fontStyle: "italic",
              paddingTop: 5,
            }}
          >
            *The data is saved independently for each format{"\n"}
          </Text>
        </View>
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
    alignItems: "center",
  },
});

export default Edit;
