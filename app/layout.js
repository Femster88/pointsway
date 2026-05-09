export const metadata = {
  title: "PointsWay — Points & Miles Travel Optimizer",
  description: "Find the best flight and hotel award redemptions with your credit card points and miles. Free tool — no account needed.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>",
  },
  openGraph: {
    title: "PointsWay — Points & Miles Travel Optimizer",
    description: "Find the best flight and hotel award redemptions with your points and miles. Free, no account needed.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}