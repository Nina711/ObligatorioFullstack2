import { Provider } from 'react-redux'
import Dashboard from './Dashboard'
import { store } from './store/store.js'
import { BrowserRouter, Route, Routes } from 'react-router'
import RutaNoEncontrada from './RutaNoEncontrada'
import Login from './Login'

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
            <Route path='/login' element={<Login />} />
            
            <Route path='/dashboard' element={<Dashboard />}/>
            <Route path='/' element={<Dashboard />}/>


            <Route path='*' element={<RutaNoEncontrada/>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App