import { type PropsWithChildren } from "react";
import Header from "./header";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-gradient-to-br from-background to-muted">
      {/* header  */}
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8">{children}</main>
      <footer className="border-t backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className=" container mx-auto px-4 py-10 text-center text-gray-400">
            <p>
                ®All right reserved to © SHUVO MD RABIUL AWAL
            </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
