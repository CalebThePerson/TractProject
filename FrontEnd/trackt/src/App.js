import logo from './logo.svg';
import Home from './pages/Home'
import {Route, Routes, Navigate} from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path={"*"} element={<Navigate to="/Home"/>}/>
        <Route path={"/Home"} element={<Home />}/>

        {/* <Route path={"/LoginPage"} element={</>}/> */}
      </Routes>
    </div>
  );
}

export default App;
