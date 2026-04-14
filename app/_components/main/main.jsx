import Footer from '@/components/footer/Footer'

export function Main({ children }) {
  return (
    <div className="grid grid-flow-row grid-rows-[1fr_auto] h-screen">
      <main id="main-content" role="main">
        {children}
      </main>
      <div className="px-5">
        <Footer />
      </div>
    </div>
  )
}
