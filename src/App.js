import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Landingpage from "./LandingPage";
import FileManagerPage from "./Filemanager";

const App = () => {
  return (
    <>
      <div className="App">

        <Routes>
          <Route path="/*" element={<Landingpage />} />
          <Route path="/filemanager" element={<FileManagerPage />} />
        </Routes>

      </div>
    </>
  )
}

export default App