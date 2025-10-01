import React, { useState } from "react";
import Header from "@base-components/Header";
import PageContainer from "../../page-container";
import { Toaster } from "@components/ui/toaster";
import { useTypedSelector } from "@redux/rootReducer";
import SearchBar from "@base-components/SearchBar";
import Footer from "@base-components/Footer";

const BrowseApp: React.FC = () => {
  const userType = useTypedSelector((state) => state.App.sessionInfo.userType);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="mx-auto">
      <Header />
      <SearchBar
        onSearch={(searchQuery) => {
          console.log(searchQuery);
          setSearchQuery(searchQuery);
        }}
      />
      <div className="h-full w-full flex font-[Poppins] bg-muted">
        {userType === "employer" ? (
          <main className="h-full w-full">
            <Toaster />
            <PageContainer />
          </main>
        ) : (
          <main className="container mx-auto h-full w-full">
            <Toaster />
            <PageContainer />
          </main>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BrowseApp;
