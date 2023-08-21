import LogSnag from "logsnag";

export const logsnag = new LogSnag({
  token: process.env.LOGSNAG_API_KEY!,
  project: "uploadfly",
});
