export const metadata = { title: "Gujarat Geothermal", description: "Demo map" };
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="h-14 border-b bg-white flex items-center px-4 gap-3">
          <img src="/logo.png" alt="Tech-Terra" className="h-7 w-auto" />
          <div className="font-semibold tracking-wide">TECH-TERRA • Natural Energy</div>
        </header>
        {children}
      </body>
    </html>
  );
}
