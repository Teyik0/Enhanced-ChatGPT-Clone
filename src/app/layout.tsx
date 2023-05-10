import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { SideBar, SessionProvider } from "@/components";
import { Providers } from "@/context/store";

export const metadata = {
  title: "Enhanced CHAT-GPT",
  description: "Enhanced CHAT-GPT",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="fr">
      <body>
        <SessionProvider session={session!}>
          <Providers>
            <div className="sm:flex">
              <SideBar />
              {children}
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
