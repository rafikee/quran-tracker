import AsyncStorage from "@react-native-async-storage/async-storage";
import allChapters from "../assets/chapters.json";
import allJuz from "../assets/juzs.json";

const STORAGE_KEY = "chapters"; // the key for the active dataset
const STORAGE_KEY_JUZ = "juz";
const STORAGE_KEY_SURAH = "surahs";
const STORAGE_KEY_CUSTOM = "custom";
const STORAGE_DAYS_KEY = "days";
const STORAGE_LANG_KEY = "lang";
const STORAGE_FORMAT_KEY = "format";

export interface Chapter {
  id: number; // unique id and also how chapters are sorted
  name: string; // name of chapter
  review: boolean; // whether or not chapter is in tracker
  date: Date | string; // date of last review
  transliteration: string | null; // name of chapter in English, if custom it will be a copy of name
  total_verses: number | null; // total number of verses in chapter, null for custom and juz
  type: string | null; // irrelevant for custom and juz, "Meccan" or "Medinan" for surahs
}

// other components use this to get the number of days for each color setting
export interface days {
  orange: number;
  red: number;
}

// Clear data for testing
export const clearData = async () => {
  AsyncStorage.clear();
};

// Get chapter data from asyncsotarge
export const getData = async (): Promise<Chapter[]> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedData !== null) {
      return JSON.parse(storedData);
    } else {
      const defaultData = resetData();
      return defaultData;
    }
  } catch (error) {
    console.log("Error retrieving data:", error);
  }
  return [];
};

// Set chapter data to async storage
// Stores it twice, once in data and once in the respective format
export const setData = async (
  data: Chapter[],
  setChapters: (chapters: Chapter[]) => void
): Promise<void> => {
  try {
    const format = await getFormat();
    if (format == 0) {
      await AsyncStorage.setItem(STORAGE_KEY_SURAH, JSON.stringify(data));
    } else if (format == 1) {
      await AsyncStorage.setItem(STORAGE_KEY_JUZ, JSON.stringify(data));
    } else {
      await AsyncStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(data));
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setChapters(data);
  } catch (error) {
    console.log("Error saving data:", error);
  }
};

// Get custom data from async storage
export const getCustomData = async (): Promise<Chapter[]> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY_CUSTOM);
    if (storedData !== null) {
      return JSON.parse(storedData);
    } else {
      console.log("No data found, resetting custom data");
      const defaultData = [
        {
          id: 1,
          name: "Add entry",
          review: false,
          date: "Not reviewed",
          transliteration: "Add entry",
          total_verses: null,
          type: null,
        },
      ];
      return defaultData;
    }
  } catch (error) {
    console.log("Error retrieving data:", error);
  }
  return [];
};

// set custom data when a user uses the custom setting
export const setCustomData = async (data: Chapter[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(data));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.log("Error saving data:", error);
  }
};

// reset data for a variaty of reasons, it depends on the format
export const resetData = async (): Promise<Chapter[]> => {
  const format = await getFormat();
  let data;
  if (format === 0) {
    data = allChapters;
  } else if (format === 1) {
    data = allJuz;
  } else {
    data = [
      {
        id: 1,
        name: "Add entry",
        review: false,
        date: "Not reviewed",
        transliteration: "Add entry",
        total_verses: null,
        type: null,
      },
    ];
  }
  const defaultChapters = data.map((chapter: any) => ({
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

///// Get and set color coding
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

///// Get and set language
export const updateLang = async (data: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_LANG_KEY, JSON.stringify(data));
  } catch (error) {
    data = true;
    await AsyncStorage.setItem(STORAGE_LANG_KEY, JSON.stringify(data));
    console.log("Error saving data:", error);
  }
};

export const getLang = async (): Promise<boolean> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_LANG_KEY);
    if (storedData !== null) {
      return JSON.parse(storedData);
    } else {
      return true;
    }
  } catch (error) {
    console.log("Error retrieving data:", error);
    return true;
  }
};

///// When a user changes the format we need to update it in the async storage
export const updateFormat = async (data: number): Promise<boolean> => {
  try {
    const oldFormat = await getFormat();
    await AsyncStorage.setItem(STORAGE_FORMAT_KEY, JSON.stringify(data));
    const good = await updateDataset(await oldFormat);
    if (good) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error changing format:", error);
    return false;
  }
};

export const getFormat = async (): Promise<number> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_FORMAT_KEY);
    if (storedData !== null) {
      return JSON.parse(storedData);
    } else {
      return 0;
    }
  } catch (error) {
    console.log("Error retrieving data:", error);
    return 0;
  }
};

///// Update the main dataset when the user changes the format
// 0: surah, 1: juz, 2: custom
export const updateDataset = async (oldFormat: number): Promise<boolean> => {
  try {
    const data = await getData(); // get the current dataset
    const newFormat = await getFormat(); // get the new format
    if (oldFormat === 0) {
      // if format was surahs
      await AsyncStorage.setItem(STORAGE_KEY_SURAH, JSON.stringify(data));
    } else if (oldFormat === 1) {
      // if format was juzs
      await AsyncStorage.setItem(STORAGE_KEY_JUZ, JSON.stringify(data));
    } else if (oldFormat === 2) {
      // if format was juzs
      await AsyncStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(data));
    } else {
      console.log("Error updating dataset");
    }

    if (newFormat === 0) {
      // if format is surahs
      const newData = await AsyncStorage.getItem(STORAGE_KEY_SURAH);
      if (newData !== null) {
        await AsyncStorage.setItem(STORAGE_KEY, newData);
      } else {
        resetData();
      }
    } else if (newFormat === 1) {
      // if format is juzs
      const newData = await AsyncStorage.getItem(STORAGE_KEY_JUZ);
      if (newData !== null) {
        await AsyncStorage.setItem(STORAGE_KEY, newData);
      } else {
        resetData();
      }
    } else if (newFormat === 2) {
      // if format is custom
      const newData = await AsyncStorage.getItem(STORAGE_KEY_CUSTOM);
      if (newData !== null) {
        await AsyncStorage.setItem(STORAGE_KEY, newData);
      } else {
        resetData();
        console.log("User has no custom list data, start from scratch...");
        return true;
      }
    } else {
      console.log("Error updating dataset");
      return false;
    }
    return true;
  } catch (error) {
    console.log("Error updating dataset:", error);
    return false;
  }
};
