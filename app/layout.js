import "./globals.css";

export const metadata = {
  title: "Сервис To-Do",
  description: "To-Do для Яндекс Практикума"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
