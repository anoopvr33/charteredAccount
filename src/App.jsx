import "./App.css";
import { Routes, Route } from "react-router-dom";
import ImageUpload from "./components/ImageUpload";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<ImageUpload />}></Route>
      </Routes>
    </div>
  );
}

export default App;
