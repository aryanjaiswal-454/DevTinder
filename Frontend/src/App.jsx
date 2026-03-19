import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Body.jsx"
import Login from "./Login.jsx"
import Profile from "./Profile.jsx"
import appStore from "./utils/appStore.js";
import { Provider } from "react-redux";
function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App;