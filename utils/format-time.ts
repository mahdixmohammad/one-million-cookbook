export function formatISOTime(isoString: string) {
  /* this is for after we have created a user in the dashboard and
    we generate lastLogin as this ISO string to signify
    the user has never logged in */
  if (isoString === "2025-01-01T00:00:00.000Z") return "مطلقًا";

  const formatter = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Baghdad",
  });

  // returns a string in the format 8/23/25, 2:58 AM
  return formatter.format(new Date(isoString));
}
