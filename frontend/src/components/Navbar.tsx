import { NavLink } from "react-router-dom";
import { Home, Upload } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 shadow-md transition-all duration-300">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-red-500 tracking-tight cursor-pointer hover:opacity-90 transition-opacity">
          YouTube
        </span>
      </div>
      
      <div className="flex items-center bg-zinc-950/50 rounded-full p-1 border border-zinc-800">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`
          }
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/upload"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`
          }
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </NavLink>
      </div>
      
      <div className="w-20"></div> {/* Spacer for balance */}
    </nav>
  );
}


