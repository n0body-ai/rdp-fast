const VULTR_API_KEY = process.env.VULTR_API_KEY;
const VULTR_API_URL = "https://api.vultr.com/v2";

// Configuration Defaults
// 1743 = Windows 2022 Standard
// vc2-2c-4gb = 2 vCPU, 4GB RAM (Minimum decent for Windows)
// ewr = New Jersey (Default region)
const DEFAULT_CONFIG = {
  region: "ewr",
  plan: "vc2-2c-4gb",
  os_id: 1743, 
};

/**
 * Generic Vultr API Fetcher
 */
async function vultrFetch(endpoint: string, options: RequestInit = {}) {
  if (!VULTR_API_KEY) {
    throw new Error("VULTR_API_KEY is not defined in environment variables");
  }

  const res = await fetch(`${VULTR_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${VULTR_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Vultr API Error: ${res.status} ${res.statusText} - ${errorBody}`);
  }

  return res.json();
}

/**
 * Deploy a new RDP Instance
 */
export async function createRDPInstance(label: string, plan: string = DEFAULT_CONFIG.plan) {
  const payload = {
    region: DEFAULT_CONFIG.region,
    plan: plan,
    os_id: DEFAULT_CONFIG.os_id,
    label: label,
    hostname: label.replace(/[^a-zA-Z0-9]/g, "-"), // Sanitize hostname
    backups: "disabled",
  };

  const data = await vultrFetch("/instances", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Returns { instance: { id: "subid", ... } }
  return data.instance;
}

/**
 * Get Instance Details (IP, Status, Password)
 */
export async function getInstanceDetails(instanceId: string) {
  const data = await vultrFetch(`/instances/${instanceId}`);
  return data.instance;
}

/**
 * Delete an Instance
 */
export async function deleteInstance(instanceId: string) {
  await vultrFetch(`/instances/${instanceId}`, {
    method: "DELETE",
  });
  return true;
}

/**
 * List all OS available (Utility to find correct Windows ID)
 */
export async function listOS() {
  const data = await vultrFetch("/os");
  return data.os;
}
