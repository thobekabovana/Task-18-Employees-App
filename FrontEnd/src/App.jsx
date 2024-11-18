import { useState } from 'react';
import './App.css';
import AddForm from './Pages/AddForm';
// import { BrowserRouter  } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import List from './Pages/List';
import ViewEmployee from './Pages/View';
import Landing from './Pages/Landing';
import Layout from './Components/LayOut';
import Footer from './Components/Footer';
import Register from './Pages/SignUpPg';
import LogInPg from './Pages/LogInPg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Wrap routes that need the layout inside a Layout Route */}
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logIn" element={<LogInPg />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/addForm" element={<AddForm />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/view/:id" element={<ViewEmployee />} />
          <Route path="/list" element={<List />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
