import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            RDPFast
          </div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            High-Performance <span className="text-blue-500">Cloud Desktops</span> <br/>
            in Seconds.
          </h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Deploy secure, powerful Windows RDP instances instantly. 
            Perfect for businesses with funding limits. 
            Pay monthly, cancel anytime.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-900/20">
              Deploy Now
            </Link>
            <Link href="#pricing" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-bold text-lg border border-gray-700 transition-all">
              View Pricing
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 p-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} RDPFast. All rights reserved.
      </footer>
    </div>
  );
}
