"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Instance {
  id: string;
  ipAddress: string | null;
  username: string;
  password?: string; // Optional in UI if hidden
  status: string;
  region: string;
  plan: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("vc2-2c-4gb");
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch instances on load
  useEffect(() => {
    if (status === "authenticated") {
      fetchInstances();
    }
  }, [status]);

  const fetchInstances = async () => {
    try {
      const res = await fetch("/api/instances");
      if (res.ok) {
        const data = await res.json();
        setInstances(data);
      }
    } catch (err) {
      console.error("Failed to fetch instances");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to start checkout");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeploy = async () => {
    setDeploying(true);
    setError("");
    
    try {
      const res = await fetch("/api/instances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      if (res.status === 403) {
        // Payment required
        if (confirm("Subscription required. Go to checkout?")) {
           handleSubscribe();
        }
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Deployment failed");
      }

      // Refresh list
      await fetchInstances();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeploying(false);
    }
  };

  const handleRefresh = async (id: string) => {
    setRefreshingId(id);
    try {
      const res = await fetch(`/api/instances/${id}/sync`, { method: "POST" });
      if (res.ok) {
        // Update local state for immediate feedback
        const updated = await res.json();
        setInstances((prev) => 
          prev.map((inst) => (inst.id === id ? updated : inst))
        );
      }
    } catch (err) {
      console.error("Sync failed", err);
    } finally {
      setRefreshingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this instance? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/instances/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Remove from list
        setInstances((prev) => prev.filter((inst) => inst.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              RDPFast
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSubscribe}
                className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors"
              >
                Subscribe
              </button>
              <span className="text-sm text-gray-400 hidden sm:block">{session?.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded border border-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Your Instances</h1>
        </div>

        {/* Deployment Section (Always visible for easy access) */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-10">
          <h2 className="text-lg font-semibold mb-4 text-white">Deploy New Server</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Selection Cards */}
            {[
              { id: "vc2-1c-2gb", name: "Starter", specs: "1 CPU • 2GB RAM", price: "$14.99" },
              { id: "vc2-2c-4gb", name: "Pro", specs: "2 CPU • 4GB RAM", price: "$24.99" },
              { id: "vc2-4c-8gb", name: "Business", specs: "4 CPU • 8GB RAM", price: "$49.99" },
            ].map((plan) => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer border rounded-xl p-4 flex justify-between items-center transition-all ${
                  selectedPlan === plan.id 
                    ? "border-blue-500 bg-blue-900/20 ring-1 ring-blue-500" 
                    : "border-gray-700 bg-gray-800 hover:border-gray-500"
                }`}
              >
                <div>
                  <div className="font-bold text-white">{plan.name}</div>
                  <div className="text-sm text-gray-400">{plan.specs}</div>
                </div>
                <div className="font-semibold text-blue-400">{plan.price}</div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={handleDeploy}
              disabled={deploying}
              className={`px-6 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2 ${
                deploying 
                  ? "bg-blue-800 cursor-wait text-gray-300" 
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20 transform hover:scale-105"
              }`}
            >
              {deploying ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-transparent rounded-full"></span>
                  Provisioning Server...
                </>
              ) : (
                "Deploy Server Now"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-200 rounded">
            Error: {error}
          </div>
        )}

        {/* Instance List */}
        {instances.length === 0 ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
            <div className="text-gray-500 mb-4 text-4xl">🖥️</div>
            <h3 className="text-lg font-medium text-gray-300">No active instances</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              You haven't deployed any RDP servers yet. Click the deploy button to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {instances.map((instance) => (
              <div key={instance.id} className="bg-gray-900 rounded-lg border border-gray-800 p-6 shadow-sm hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    instance.status === "ACTIVE" ? "bg-green-900 text-green-300 border border-green-800" :
                    instance.status === "PENDING" ? "bg-yellow-900 text-yellow-300 border border-yellow-800" :
                    "bg-gray-800 text-gray-300"
                  }`}>
                    {instance.status}
                  </div>
                  <span className="text-xs text-gray-500 uppercase">{instance.plan} • {instance.region}</span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">
                  {instance.ipAddress || "Provisioning IP..."}
                </h3>
                
                <div className="space-y-2 mt-4 text-sm">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">Username</span>
                    <span className="font-mono text-gray-300">{instance.username}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-500">Password</span>
                    <span className="font-mono text-gray-300 truncate max-w-[150px]" title={instance.password}>
                      {instance.password || "Checking..."}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end gap-2">
                   <button 
                     onClick={() => handleRefresh(instance.id)}
                     disabled={refreshingId === instance.id}
                     className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                   >
                     {refreshingId === instance.id ? (
                       <span className="animate-spin h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full"></span>
                     ) : (
                       "↻ Refresh"
                     )}
                   </button>
                   
                   <button 
                     onClick={() => handleDelete(instance.id)}
                     disabled={deletingId === instance.id}
                     className="text-xs bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800 px-3 py-1.5 rounded transition-colors"
                   >
                     {deletingId === instance.id ? "Terminating..." : "Terminate"}
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
