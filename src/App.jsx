import './App.css'
import { store } from './store.js'
import { Provider } from 'react-redux'
import Login from './Login.jsx'

function App() {
  return (
    <Provider store={store}>
      <div className="App">
      <Login>
      </Login>
      </div>
    </Provider>
  )
}

export default App
