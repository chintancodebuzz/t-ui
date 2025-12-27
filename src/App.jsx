import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store/store"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import ProductDetail from "./pages/ProductDetail"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
