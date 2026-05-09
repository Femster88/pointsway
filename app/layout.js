export const metadata = {
  title: "PointsWay — Points & Miles Travel Optimizer",
  description: "Find the best flight and hotel award redemptions with your credit card points and miles. Free tool — no account needed.",
  metadataBase: new URL("https://pointswayapp.com"),
  openGraph: {
    title: "PointsWay — Points & Miles Travel Optimizer",
    description: "Find the best flight and hotel award redemptions with your points and miles. Free, no account needed.",
    url: "https://pointswayapp.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PointsWay — Points & Miles Travel Optimizer",
    description: "Find the best flight and hotel award redemptions with your points and miles. Free, no account needed.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
