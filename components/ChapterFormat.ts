export const getChapterColor = (date: Date | string): string => {
  if (date === "Not reviewed") {
    return "#eaddcf";
  }

  const d = new Date(date);
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  if (d < fourteenDaysAgo) {
    return "#d5b5c4";
  } else {
    return "#c9d5b5";
  }
};

export const getFormattedDate = (date: Date | string): string => {
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
