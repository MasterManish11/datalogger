import Navbar from "./components/Navbar";
import "./globals.css";
import { ToastContainer } from './nexttostify'
import 'react-toastify/dist/ReactToastify.css';
import { Inter } from "next/font/google";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DataLogger",
  description: "Monitoring Energymeter and reporting app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="winter">
      <body className={inter.className}>
      <ToastContainer />
        <div>
        </div>
        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
