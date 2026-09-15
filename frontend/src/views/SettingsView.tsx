import React, { useState } from 'react';
import { 
  Network, 
  Shield, 
  Bell, 
  Sliders, 
  User, 
  Save, 
  Check, 
  Lock 
} from 'lucide-react';
import { AbbCard } from '../components/common/AbbCard';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'network' | 'policies' | 'notifications' | 'response' | 'user'>('network');
  const [savedNotice, setSavedNotice] = useState(false);

  // Mock toggle states for realistic UI feel
  const [toggles, setToggles] = useState({
    autoQuarantine: true,
    dpiSslDecrypt: true,
    netflowV9: true,
    mfaEnforced: true,
    smsOnCritical: true,
    pagerDutyWebhook: true,
    autoSinkhole: true,
    tableDense: true,
    utcClock: true,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ABB Standard KPI Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AbbCard
          title="Cluster node availability"
          subtitle="24h Window"
          primaryValue="12 / 12 Nodes"
          changeText="+0.0% nominal"
          changeType="positive"
          progressBar={{
            currentPercent: 100,
            currentLabel: 'Operational nodes',
            targetLabel: 'Target SLA (>99.9%)'
          }}
        />

        <AbbCard
          title="SIEM ingestion throughput"
          subtitle="MTD Avg"
          primaryValue="14.8k EPS"
          changeText="+3.2%"
          changeType="positive"
          barChart={{
            items: [
              { label: 'Zurich', value: 95, isRed: true },
              { label: 'Västerås', value: 85 },
              { label: 'Baden', value: 72 },
              { label: 'Helsinki', value: 64 },
              { label: 'Mannheim', value: 50 },
            ],
            targetLinePercent: 75,
            targetLineLabel: 'Threshold: 10k EPS'
          }}
        />

        <AbbCard
          title="Policy rule sync SLA"
          subtitle="MTD Avg"
          primaryValue="99.98%"
          changeText="+0.02%"
          changeType="positive"
          progressBar={{
            currentPercent: 99.9,
            currentLabel: 'Sync Time < 1.2s',
            targetLabel: 'Target SLA (< 2.0s)'
          }}
        />
      </div>

      {/* Top Banner with ABB Signature Red Accent Bar */}
      <div className="bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] p-5 rounded-sm shadow-industrial space-y-4">
        {/* ABB Signature Red Accent Bar */}
        <div className="w-12 h-1.5 bg-[#FF000F] mb-3"></div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#181B1F] dark:text-white" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
                System Configuration & Policy Engine
              </h3>
            </div>
            <p className="text-[11px] text-[#5A626E] dark:text-[#9BA3AF] font-sans mt-0.5">
              Manage boundary routing, EDR response playbooks, detection thresholds, and SOC operator preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedNotice && (
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-sm border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Configuration Staged (Mock)
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-[#181B1F] dark:bg-[#FF000F] hover:bg-[#2D3239] dark:hover:bg-[#D6000D] text-white text-xs font-mono font-semibold rounded-sm flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-[#FF000F] dark:text-white" />
              Apply Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Settings Navigation Tabs */}
        <div className="md:col-span-3 bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-industrial overflow-hidden p-4">
          {/* ABB Signature Red Accent Bar */}
          <div className="w-12 h-1.5 bg-[#FF000F] mb-3"></div>

          <div className="pb-2 border-b border-[#E2E6EA] dark:border-[#282D35] text-[10px] font-mono uppercase font-bold text-[#6C757D] dark:text-[#9BA3AF] mb-2">
            Configuration Domains
          </div>
          <div className="space-y-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('network')}
              className={`w-full text-left px-3 py-2 rounded-sm flex items-center gap-2.5 transition-colors ${
                activeTab === 'network'
                  ? 'bg-[#181B1F] dark:bg-[#FF000F] text-white font-semibold'
                  : 'text-[#495057] dark:text-[#ADB5BD] hover:bg-[#F1F3F5] dark:hover:bg-[#1F242D]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Network Configuration
            </button>

            <button
              onClick={() => setActiveTab('policies')}
              className={`w-full text-left px-3 py-2 rounded-sm flex items-center gap-2.5 transition-colors ${
                activeTab === 'policies'
                  ? 'bg-[#181B1F] dark:bg-[#FF000F] text-white font-semibold'
                  : 'text-[#495057] dark:text-[#ADB5BD] hover:bg-[#F1F3F5] dark:hover:bg-[#1F242D]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Security Policies
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-3 py-2 rounded-sm flex items-center gap-2.5 transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-[#181B1F] dark:bg-[#FF000F] text-white font-semibold'
                  : 'text-[#495057] dark:text-[#ADB5BD] hover:bg-[#F1F3F5] dark:hover:bg-[#1F242D]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Notification Preferences
            </button>

            <button
              onClick={() => setActiveTab('response')}
              className={`w-full text-left px-3 py-2 rounded-sm flex items-center gap-2.5 transition-colors ${
                activeTab === 'response'
                  ? 'bg-[#181B1F] dark:bg-[#FF000F] text-white font-semibold'
                  : 'text-[#495057] dark:text-[#ADB5BD] hover:bg-[#F1F3F5] dark:hover:bg-[#1F242D]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Response Policies
            </button>

            <button
              onClick={() => setActiveTab('user')}
              className={`w-full text-left px-3 py-2 rounded-sm flex items-center gap-2.5 transition-colors ${
                activeTab === 'user'
                  ? 'bg-[#181B1F] dark:bg-[#FF000F] text-white font-semibold'
                  : 'text-[#495057] dark:text-[#ADB5BD] hover:bg-[#F1F3F5] dark:hover:bg-[#1F242D]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              User Preferences
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-9 bg-white dark:bg-[#16191E] border border-[#E2E6EA] dark:border-[#282D35] rounded-sm shadow-industrial p-6">
          {/* ABB Signature Red Accent Bar */}
          <div className="w-12 h-1.5 bg-[#FF000F] mb-4"></div>
          {/* TAB 1: Network Configuration */}
          {activeTab === 'network' && (
            <div className="space-y-6">
              <div className="border-b border-[#E9ECEF] dark:border-[#282D35] pb-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
                  Network Configuration & Boundary Topology
                </h4>
                <p className="text-xs text-[#5A626E] dark:text-[#9BA3AF] mt-0.5">
                  Specify authoritative DNS resolvers, perimeter gateway addresses, and interface flow monitoring.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    Primary Enterprise DNS Resolver
                  </label>
                  <input
                    type="text"
                    defaultValue="192.168.10.5 (dc01.corp.abb)"
                    className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    Secondary DNS Resolver (Recursive)
                  </label>
                  <input
                    type="text"
                    defaultValue="1.1.1.1 (Cloudflare Gateway)"
                    className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    Core Router Default Gateway
                  </label>
                  <input
                    type="text"
                    defaultValue="192.168.20.1 (Cisco Catalyst 9500)"
                    className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    NetFlow v9 / IPFIX Collector Port
                  </label>
                  <input
                    type="text"
                    defaultValue="UDP Port 2055"
                    className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9ECEF] dark:border-[#282D35] space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#E9ECEF] dark:border-[#282D35] rounded-sm">
                  <div>
                    <div className="font-mono text-xs font-bold text-[#181B1F] dark:text-white">
                      Deep Packet Inspection & SSL/TLS Decryption
                    </div>
                    <div className="text-[11px] text-[#5A626E] dark:text-[#9BA3AF]">
                      Enables hardware SSL decryption on perimeter firewall for inbound HTTPS traffic.
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('dpiSslDecrypt')}
                    className={`font-mono text-xs px-2.5 py-1 rounded-sm border font-semibold ${
                      toggles.dpiSslDecrypt ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {toggles.dpiSslDecrypt ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#E9ECEF] dark:border-[#282D35] rounded-sm">
                  <div>
                    <div className="font-mono text-xs font-bold text-[#181B1F] dark:text-white">
                      OT/ICS Industrial Protocol Strict Filter (IEC 62443)
                    </div>
                    <div className="text-[11px] text-[#5A626E] dark:text-[#9BA3AF]">
                      Drop non-whitelisted Modbus, DNP3, and IEC 60870-5-104 packets entering VLAN 40.
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('netflowV9')}
                    className={`font-mono text-xs px-2.5 py-1 rounded-sm border font-semibold ${
                      toggles.netflowV9 ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {toggles.netflowV9 ? 'ENFORCED' : 'AUDIT ONLY'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Security Policies */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="border-b border-[#E9ECEF] dark:border-[#282D35] pb-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
                  Security Policies & Detection Thresholds
                </h4>
                <p className="text-xs text-[#5A626E] dark:text-[#9BA3AF] mt-0.5">
                  Configure real-time heuristics, brute-force frequency triggers, and MITRE rule mappings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    SSH / RDP Brute Force Velocity Trigger
                  </label>
                  <select className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none">
                    <option>&gt; 50 failed attempts in 60s (Strict)</option>
                    <option>&gt; 100 failed attempts in 60s (Default)</option>
                    <option>&gt; 250 failed attempts in 60s (Relaxed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    Port Scan Sensitivity Threshold
                  </label>
                  <select className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none">
                    <option>High (&gt; 10 ports probed in 10s)</option>
                    <option>Medium (&gt; 50 ports probed in 10s)</option>
                    <option>Low (&gt; 200 ports probed in 10s)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9ECEF] dark:border-[#282D35] space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#FFF8F8] dark:bg-red-950/30 border border-[#FFA3A8] dark:border-red-900/50 rounded-sm">
                  <div>
                    <div className="font-mono text-xs font-bold text-[#D6000D] dark:text-red-400">
                      Automated C2 Host Quarantine Trigger
                    </div>
                    <div className="text-[11px] text-[#5A626E] dark:text-[#9BA3AF]">
                      Instantly isolate endpoint via CrowdStrike Falcon agent upon confirmed C2 beacon matching.
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('autoQuarantine')}
                    className={`font-mono text-xs px-2.5 py-1 rounded-sm border font-semibold ${
                      toggles.autoQuarantine ? 'bg-[#FF000F] text-white border-[#D6000D]' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {toggles.autoQuarantine ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#E9ECEF] dark:border-[#282D35] rounded-sm">
                  <div>
                    <div className="font-mono text-xs font-bold text-[#181B1F] dark:text-white">
                      Mandatory FIDO2 Hardware Key Authentication
                    </div>
                    <div className="text-[11px] text-[#5A626E] dark:text-[#9BA3AF]">
                      Enforce YubiKey / WebAuthn for all SOC analyst logins and configuration edits.
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('mfaEnforced')}
                    className={`font-mono text-xs px-2.5 py-1 rounded-sm border font-semibold ${
                      toggles.mfaEnforced ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {toggles.mfaEnforced ? 'MANDATORY' : 'OPTIONAL'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Notification Preferences */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="border-b border-[#E9ECEF] dark:border-[#282D35] pb-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
                  Notification Preferences & Incident Dispatch
                </h4>
                <p className="text-xs text-[#5A626E] dark:text-[#9BA3AF] mt-0.5">
                  Configure SIEM webhooks, automated on-call escalations, and incident alerting matrix.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    PagerDuty SOC Escalation Webhook URL
                  </label>
                  <input
                    type="text"
                    defaultValue="https://events.pagerduty.com/v2/enqueue/abb-soc-primary"
                    className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    Duty Escalation Email Distribution List
                  </label>
                  <input
                    type="text"
                    defaultValue="soc-incident-leads@ch.abb.com, ciso-alerts@abb.com"
                    className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#E9ECEF] dark:border-[#282D35] rounded-sm">
                    <div>
                      <div className="font-mono text-xs font-bold text-[#181B1F] dark:text-white">
                        Urgent SMS Dispatch on Severity 1 (Critical) Incidents
                      </div>
                      <div className="text-[11px] text-[#5A626E] dark:text-[#9BA3AF]">
                        Immediate cellular alert to active shift duty lead and Tier 3 on-call incident commander.
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('smsOnCritical')}
                      className={`font-mono text-xs px-2.5 py-1 rounded-sm border font-semibold ${
                        toggles.smsOnCritical ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      {toggles.smsOnCritical ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Response Policies */}
          {activeTab === 'response' && (
            <div className="space-y-6">
              <div className="border-b border-[#E9ECEF] dark:border-[#282D35] pb-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
                  Response Policies & Automated Containment
                </h4>
                <p className="text-xs text-[#5A626E] dark:text-[#9BA3AF] mt-0.5">
                  Playbook execution rules, quarantine thresholds, and boundary firewall blacklisting TTLs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    Edge Dynamic Blocklist TTL
                  </label>
                  <select className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none">
                    <option>24 Hours (Recommended)</option>
                    <option>72 Hours</option>
                    <option>7 Days</option>
                    <option>Permanent until manual review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    Forensic Memory Capture Policy
                  </label>
                  <select className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none">
                    <option>Always capture RAM dump prior to isolation</option>
                    <option>Capture volatile handles and socket state only</option>
                    <option>Immediate isolation without delay</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9ECEF] dark:border-[#282D35] space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#E9ECEF] dark:border-[#282D35] rounded-sm">
                  <div>
                    <div className="font-mono text-xs font-bold text-[#181B1F] dark:text-white">
                      Recursive DNS Response Policy Zone (RPZ) Sinkhole
                    </div>
                    <div className="text-[11px] text-[#5A626E] dark:text-[#9BA3AF]">
                      Direct identified malicious domains to local honeypot telemetry sinkhole (127.0.0.1).
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('autoSinkhole')}
                    className={`font-mono text-xs px-2.5 py-1 rounded-sm border font-semibold ${
                      toggles.autoSinkhole ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {toggles.autoSinkhole ? 'ACTIVE' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: User Preferences */}
          {activeTab === 'user' && (
            <div className="space-y-6">
              <div className="border-b border-[#E9ECEF] dark:border-[#282D35] pb-3">
                <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-[#181B1F] dark:text-white">
                  User Preferences & Operator Console Display
                </h4>
                <p className="text-xs text-[#5A626E] dark:text-[#9BA3AF] mt-0.5">
                  Configure information density, timezone presentation, and telemetry refresh frequencies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    Visual Design Theme
                  </label>
                  <input
                    type="text"
                    disabled
                    value="ABB Swiss Industrial Precision"
                    className="w-full bg-[#E9ECEF] dark:bg-[#202632] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#495057] dark:text-[#ADB5BD] outline-none cursor-not-allowed"
                  />
                  <span className="text-[10px] text-[#6C757D] dark:text-[#9BA3AF] mt-1 block">
                    Enforced by corporate industrial cybersecurity visual guidelines.
                  </span>
                </div>

                <div>
                  <label className="block text-[#6C757D] dark:text-[#9BA3AF] uppercase font-semibold mb-1">
                    Telemetry Ingestion Refresh Frequency
                  </label>
                  <select className="w-full bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#CED4DA] dark:border-[#333A46] p-2 rounded-sm text-[#181B1F] dark:text-white outline-none">
                    <option>Every 5 seconds (Real-time)</option>
                    <option>Every 15 seconds</option>
                    <option>Every 60 seconds</option>
                    <option>Manual Refresh</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9ECEF] dark:border-[#282D35] space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#E9ECEF] dark:border-[#282D35] rounded-sm">
                  <div>
                    <div className="font-mono text-xs font-bold text-[#181B1F] dark:text-white">
                      High-Density SOC Table Layout
                    </div>
                    <div className="text-[11px] text-[#5A626E] dark:text-[#9BA3AF]">
                      Maximizes rows and parameters per viewport for Tier 2/3 analyst workstations.
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('tableDense')}
                    className={`font-mono text-xs px-2.5 py-1 rounded-sm border font-semibold ${
                      toggles.tableDense ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {toggles.tableDense ? 'DENSE' : 'STANDARD'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] dark:bg-[#1F242D] border border-[#E9ECEF] dark:border-[#282D35] rounded-sm">
                  <div>
                    <div className="font-mono text-xs font-bold text-[#181B1F] dark:text-white">
                      Universal Time Coordinated (UTC / Zulu) Display
                    </div>
                    <div className="text-[11px] text-[#5A626E] dark:text-[#9BA3AF]">
                      Display all incident timestamps in UTC to maintain cross-border audit synchronization.
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('utcClock')}
                    className={`font-mono text-xs px-2.5 py-1 rounded-sm border font-semibold ${
                      toggles.utcClock ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {toggles.utcClock ? 'UTC ACTIVE' : 'LOCAL TIME'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
