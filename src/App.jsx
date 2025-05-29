import "./styles/reset.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Recommend from "./pages/recommend";
import Details from "./pages/details";
import CustomLayout from "./components/layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CustomLayout>
              <Home />
            </CustomLayout>
          }
        />
        <Route
          path="/recommend"
          element={
            <CustomLayout>
              <Recommend />
            </CustomLayout>
          }
        ></Route>
        <Route
          path="/details/:id"
          element={
            <CustomLayout>
              <Details />
            </CustomLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
