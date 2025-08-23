// for example: 8/23/25, 2:58 AM
export const formatter = new Intl.DateTimeFormat("en-IQ", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Baghdad",
});
