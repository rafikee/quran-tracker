import AsyncStorage from "@react-native-async-storage/async-storage";
import allChapters from "../assets/chapters.json";

const STORAGE_KEY = "chapters";
const STORAGE_DAYS_KEY = "days";

export interface Chapter {
  id: number;
  name: string;
  review: boolean;
  date: Date | string;
  transliteration: string | null;
  total_verses: number | null;
  type: string | null;
}

export interface days {
  orange: number;
  red: number;
}

export const getData = async (): Promise<Chapter[]> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedData !== null) {
      return JSON.parse(storedData);
    } else {
      console.log("No data found, resetting data");
      const defaultData = resetData();
      return defaultData;
    }
  } catch (error) {
    console.log("Error retrieving data:", error);
  }
  return [];
};

export const setData = async (
  data: Chapter[],
  setChapters: (chapters: Chapter[]) => void
): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setChapters(data);
  } catch (error) {
    console.log("Error saving data:", error);
  }
};

export const resetData = async (): Promise<Chapter[]> => {
  const defaultChapters = allChapters.map((chapter) => ({
    id: chapter.id,
    name: chapter.name,
    review: chapter.review,
    date: chapter.date,
    transliteration: chapter.transliteration,
    total_verses: chapter.total_verses,
    type: chapter.type,
  }));
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultChapters));
    return defaultChapters;
  } catch (error) {
    console.log("Error resetting data:", error);
  }
  return [];
};

export const updateDays = async (data: days): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_DAYS_KEY, JSON.stringify(data));
  } catch (error) {
    data = { orange: 7, red: 14 };
    await AsyncStorage.setItem(STORAGE_DAYS_KEY, JSON.stringify(data));
    console.log("Error saving data:", error);
  }
};

export const getDays = async (): Promise<days> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_DAYS_KEY);
    if (storedData !== null) {
      return JSON.parse(storedData);
    } else {
      return { orange: 7, red: 14 };
    }
  } catch (error) {
    console.log("Error retrieving data:", error);
    return { orange: 7, red: 14 };
  }
};
