import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { BrowserRouter, Route, Routes } from 'react-router'
import Dashboard from './pages/Dashboard.jsx'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import PathNotFound from './pages/PathNotFound.jsx'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/' element={<Dashboard />} />
          <Route path='*' element={<PathNotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
