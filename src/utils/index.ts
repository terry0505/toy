export function getProvider(id: string | undefined): string {
  switch (id) {
    case "password":
      return "General";
    case "google.com":
      return "Google";
    case "github.com":
      return "Github";
    case "facebook.com":
      return "Facebook";
    default:
      return "없음";
  }
}

export function formatDate(timestamp, type = "-") {
  if (type == "-") {
    return new Date(timestamp * 1000).toISOString().slice(0, 10);
  }
  if (type == ".") {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  }
}

export function formatTextWithLine(text) {
  return text.replace(/\n/g, "<br />");
}
