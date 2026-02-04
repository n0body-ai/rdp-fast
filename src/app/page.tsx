import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-[#0f172a]/80 backdrop-blur fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">R</div>
            <span className="text-xl font-bold tracking-tight">RDPFast</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-gray-300 hover:text-white font-medium transition-colors">Login</Link>
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-900/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-blue-400 font-semibold tracking-wide uppercase text-sm mb-4 block">Premium Cloud Desktop</span>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight mb-8 text-white">
            Your Office, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Anywhere in the World.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Deploy high-performance Windows RDP servers in seconds. <br/>
            No long-term contracts. 99.99% Uptime. Pure Power.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all">
              Deploy Server Now
            </Link>
            <Link href="#pricing" className="bg-[#1e293b] text-white hover:bg-[#334155] px-8 py-4 rounded-full font-bold text-lg border border-gray-700 transition-all">
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#1e293b]/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🚀</div>
            <h3 className="text-xl font-bold mb-3">Instant Deployment</h3>
            <p className="text-gray-400">Your server is online and ready to connect in under 60 seconds after payment.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🛡️</div>
            <h3 className="text-xl font-bold mb-3">DDoS Protection</h3>
            <p className="text-gray-400">Enterprise-grade security included free to keep your workspace safe.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">⚡</div>
            <h3 className="text-xl font-bold mb-3">NVMe SSD Storage</h3>
            <p className="text-gray-400">Blazing fast disk speeds ensure your applications never lag.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="bg-[#1e293b] rounded-3xl p-8 border border-gray-700 flex flex-col hover:border-blue-500 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-gray-400 mb-6">Perfect for light browsing</div>
              <div className="text-5xl font-bold mb-6">$14.99<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3"><span className="text-green-400">✓</span> 1 vCPU Core</li>
                <li className="flex items-center gap-3"><span className="text-green-400">✓</span> 2 GB RAM</li>
                <li className="flex items-center gap-3"><span className="text-green-400">✓</span> 40 GB NVMe SSD</li>
                <li className="flex items-center gap-3"><span className="text-green-400">✓</span> Windows Server 2022</li>
              </ul>
              
              <Link href="/register" className="w-full block text-center bg-gray-700 hover:bg-gray-600 py-4 rounded-xl font-bold transition-colors">
                Choose Starter
              </Link>
            </div>

            {/* Plan 2 (Popular) */}
            <div className="bg-[#1e293b] rounded-3xl p-8 border-2 border-blue-600 relative flex flex-col shadow-2xl shadow-blue-900/20 transform md:-translate-y-4">
              <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="text-gray-400 mb-6">For remote work & tools</div>
              <div className="text-5xl font-bold mb-6">$24.99<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> 2 vCPU Cores</li>
                <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> 4 GB RAM</li>
                <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> 80 GB NVMe SSD</li>
                <li className="flex items-center gap-3"><span className="text-blue-400">✓</span> Windows Server 2022</li>
              </ul>
              
              <Link href="/register" className="w-full block text-center bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition-colors">
                Choose Pro
              </Link>
            </div>

            {/* Plan 3 */}
            <div className="bg-[#1e293b] rounded-3xl p-8 border border-gray-700 flex flex-col hover:border-purple-500 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <div className="text-gray-400 mb-6">Heavy multitasking power</div>
              <div className="text-5xl font-bold mb-6">$49.99<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3"><span className="text-purple-400">✓</span> 4 vCPU Cores</li>
                <li className="flex items-center gap-3"><span className="text-purple-400">✓</span> 8 GB RAM</li>
                <li className="flex items-center gap-3"><span className="text-purple-400">✓</span> 160 GB NVMe SSD</li>
                <li className="flex items-center gap-3"><span className="text-purple-400">✓</span> Priority Support</li>
              </ul>
              
              <Link href="/register" className="w-full block text-center bg-gray-700 hover:bg-gray-600 py-4 rounded-xl font-bold transition-colors">
                Choose Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0b1120] py-12 border-t border-gray-800 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} RDPFast. High Performance Cloud Solutions.</p>
      </footer>
    </div>
  );
}
