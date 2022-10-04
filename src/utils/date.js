export const toLocaleFormat = (date) => {
  const d = new Date(date);
  const chunks = [d.getDate(), d.getMonth() + 1, d.getFullYear()];

  return chunks
    .reverse()
    .map((chunk) => String(chunk).padStart(2, "0"))
    .join("-");
};

export const toCommentFormat = (date) => {
  return date.toLocaleString("ru", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
};
