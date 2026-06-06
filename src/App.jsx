import './App.css'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter, Route, Routes } from 'react-router'
import Dashboard from './Dashboard'
import SignUp from './SignUp'
import Login from './Login'
import RutaNoEncontrada from './pathNotFound'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/' element={<Dashboard />} />
          <Route path='*' element={<pathNotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
