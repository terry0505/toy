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
