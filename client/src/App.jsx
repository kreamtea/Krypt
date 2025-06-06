import { Navbar, Services, Footer, Transactions, Welcome } from "./components"

const App = () => {
  return (
    <div className="min-h-screen bg-[#0f0e13] overflow-hidden">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  )
}

export default App
