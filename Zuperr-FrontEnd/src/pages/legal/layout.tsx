import React from "react";
import Header from "@base-components/Header";
import { SidebarProvider, SidebarTrigger } from "@components/ui/sidebar";
import { Toaster } from "@components/ui/toaster";
import { useTypedSelector } from "@redux/rootReducer";
import SearchBar from "@base-components/SearchBar";
import Footer from "@base-components/Footer";
import { useScrollToTop } from "@src/hooks/useScrollToTop";

export default function LegalLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  useScrollToTop();
  const sessionInfo = useTypedSelector((state) => state.App.sessionInfo);
  const userType = useTypedSelector((state) => state.App.sessionInfo.userType);

  return sessionInfo?.sessionLoggedIn ? (
    <div className="mx-auto">
      <Header />
      <SearchBar />
      <div className="h-full w-full flex font-[Poppins]">
        {userType === "employer" ? (
          <SidebarProvider>
            <main className="h-full w-full">
              <Toaster />
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
        ) : (
          <>
            <main className="container mx-auto h-full w-full">
              <Toaster />
              {children}
            </main>
          </>
        )}
      </div>
      <Footer />
    </div>
  ) : (
    <>{children}</>
  );
}
