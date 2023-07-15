import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ListItem, Text, SocialIcon } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { getData, setData, Chapter, getLang } from "./storageutil";

interface TrackerProps {
  refreshData: boolean;
}

const Edit: React.FC<TrackerProps> = ({ refreshData }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [arabicTrue, setArabicTrue] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getData();
        setChapters(result);
        const lang = await getLang();
        setArabicTrue(lang);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data :(...", error);
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

  const renderChapters = () => {
    if (!chapters) {
      return (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text style={{ fontSize: 16 }}>This should not show up.</Text>
        </View>
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
  return (
    <View>
      <ScrollView style={{ paddingTop: 8 }}>{renderChapters()}</ScrollView>
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

export default Edit;
