import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import VideoDetails from "./pages/VideoDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-950">
        <Navbar />

        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/video/:id" element={<VideoDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;
