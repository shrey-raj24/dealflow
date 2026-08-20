"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  DollarSign,
  Percent,
  BarChart2,
  Settings,
  ClipboardList,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Activity,
  User,
  Users,
  Lock,
  RefreshCw,
  FileText,
  Check,
  X,
  Info,
  Plus,
  ArrowRight,
  TrendingUp,
  Database,
  Flame,
  LayoutDashboard
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie
} from "recharts";

// TypeScript Interfaces
interface Deal {
  id: string;
  companyName: string;
  dealSize: number;
  discountPercentage: number;
  industry: string;
  products: string[];
  customerHistory: string;
  status: 'pending_ai' | 'pending_manager' | 'pending_director' | 'approved' | 'rejected';
  stage: string;
  closeProbability?: number;
  riskScore?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  aiReasoning?: string;
  aiConfidence?: number;
  approvalRequired?: string;
  submittedBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

interface AuditLog {
  id: string;
  dealId?: string;
  dealCompany?: string;
  userId: string;
  userName: string;
  action: string;
  actorType: 'user' | 'ai' | 'system';
  decision?: string;
  reasoning?: string;
  metadata?: any;
  createdAt: string;
}

interface Policy {
  id: string;
  name: string;
  description: string;
  ruleType: string;
  ruleConfig: any;
  severity: 'warning' | 'block';
  active: boolean;
}

// Initial Mock Seed Data
const initialDeals: Deal[] = [
  {
    id: "DF-392",
    companyName: "Acme Corporation",
    dealSize: 85000,
    discountPercentage: 15,
    industry: "SaaS",
    products: ["Enterprise Plan"],
    customerHistory: "Existing customer, positive payments, 2-year relationship.",
    status: "approved",
    stage: "negotiation",
    closeProbability: 88,
    riskScore: 18,
    riskLevel: "low",
    aiReasoning: "Strong close history, discount is within safe parameters (<20%), customer has stable profile.",
    aiConfidence: 0.92,
    submittedBy: "John Smith",
    createdAt: "2026-06-12T10:30:00Z",
    approvedBy: "AI System (Auto-Approve)",
    approvedAt: "2026-06-12T10:31:00Z"
  },
  {
    id: "DF-393",
    companyName: "Globex Inc",
    dealSize: 120000,
    discountPercentage: 30,
    industry: "FinTech",
    products: ["API Access Premium", "Support SLA Gold"],
    customerHistory: "New relationship, no previous engagements.",
    status: "pending_manager",
    stage: "proposal",
    closeProbability: 58,
    riskScore: 68,
    riskLevel: "high",
    aiReasoning: "30% discount exceeds standard policy. High risk due to new customer profile, large deal size.",
    aiConfidence: 0.85,
    submittedBy: "John Smith",
    createdAt: "2026-06-18T14:22:00Z"
  },
  {
    id: "DF-394",
    companyName: "Initech",
    dealSize: 15000,
    discountPercentage: 5,
    industry: "Professional Services",
    products: ["Basic CRM License"],
    customerHistory: "Slow billing cycles, historical minor payment issues.",
    status: "approved",
    stage: "negotiation",
    closeProbability: 92,
    riskScore: 12,
    riskLevel: "low",
    aiReasoning: "Low discount and high win probability. Customer credit score average but overall deal parameters are safe.",
    aiConfidence: 0.95,
    submittedBy: "John Smith",
    createdAt: "2026-06-20T09:10:00Z",
    approvedBy: "AI System (Auto-Approve)",
    approvedAt: "2026-06-20T09:11:00Z"
  },
  {
    id: "DF-395",
    companyName: "Umbrella Corp",
    dealSize: 310000,
    discountPercentage: 45,
    industry: "BioTech",
    products: ["Custom Server Deployment", "On-Prem Agent License"],
    customerHistory: "Strategic partner, multi-year contract renewals.",
    status: "pending_director",
    stage: "proposal",
    closeProbability: 42,
    riskScore: 88,
    riskLevel: "critical",
    aiReasoning: "45% discount is extremely aggressive and breaches the maximum threshold of 25% for Biotech. Requires Director override.",
    aiConfidence: 0.89,
    submittedBy: "Sarah Jenkins",
    createdAt: "2026-06-25T11:45:00Z"
  },
  {
    id: "DF-396",
    companyName: "Hooli",
    dealSize: 55000,
    discountPercentage: 25,
    industry: "SaaS",
    products: ["Enterprise Plan", "Analytics Add-on"],
    customerHistory: "Competitor bid active, high churn threat.",
    status: "rejected",
    stage: "lost",
    closeProbability: 38,
    riskScore: 74,
    riskLevel: "high",
    aiReasoning: "25% discount is standard but low close probability due to strong competitor presence.",
    aiConfidence: 0.81,
    submittedBy: "Sarah Jenkins",
    createdAt: "2026-07-02T16:05:00Z",
    rejectedBy: "Marcus Vance (Sales Manager)",
    rejectedAt: "2026-07-02T17:15:00Z",
    rejectionReason: "Discount too aggressive for low close probability. Renegotiate to max 15% discount."
  },
  {
    id: "DF-397",
    companyName: "Wayne Enterprises",
    dealSize: 185000,
    discountPercentage: 10,
    industry: "Defense Tech",
    products: ["Specialized Sandbox Suite"],
    customerHistory: "Top-tier account, perfect compliance record.",
    status: "approved",
    stage: "closing",
    closeProbability: 95,
    riskScore: 8,
    riskLevel: "low",
    aiReasoning: "Excellent deal parameters. High closing potential, zero policy violations, strategic customer.",
    aiConfidence: 0.98,
    submittedBy: "John Smith",
    createdAt: "2026-07-08T10:12:00Z",
    approvedBy: "AI System (Auto-Approve)",
    approvedAt: "2026-07-08T10:13:00Z"
  },
  {
    id: "DF-398",
    companyName: "Stark Industries",
    dealSize: 220000,
    discountPercentage: 22,
    industry: "Clean Energy",
    products: ["Grid Integration API", "Premium Support Suite"],
    customerHistory: "Strategic account, aggressive negotiator.",
    status: "approved",
    stage: "closing",
    closeProbability: 75,
    riskScore: 52,
    riskLevel: "medium",
    aiReasoning: "Discount exceeds standard 20% limit slightly. AI recommended manager review; approved due to customer relationship value.",
    aiConfidence: 0.88,
    submittedBy: "Sarah Jenkins",
    createdAt: "2026-07-10T15:30:00Z",
    approvedBy: "Marcus Vance (Sales Manager)",
    approvedAt: "2026-07-10T16:45:00Z"
  },
  {
    id: "DF-399",
    companyName: "Tyrell Corporation",
    dealSize: 98000,
    discountPercentage: 35,
    industry: "Robotics",
    products: ["Core System Engine", "Developer SLA Gold"],
    customerHistory: "New customer, requested complex customizations.",
    status: "rejected",
    stage: "negotiation",
    closeProbability: 40,
    riskScore: 82,
    riskLevel: "high",
    aiReasoning: "Discount of 35% violates core Robotics policy. Low confidence due to aggressive requests from new logo.",
    aiConfidence: 0.84,
    submittedBy: "John Smith",
    createdAt: "2026-07-12T11:00:00Z",
    rejectedBy: "Marcus Vance (Sales Manager)",
    rejectedAt: "2026-07-12T13:20:00Z",
    rejectionReason: "Robotics industry deals have a hard cap of 20% discount for first contracts."
  }
];

const initialPolicies: Policy[] = [
  {
    id: "POL-001",
    name: "Standard Discount Cap",
    description: "Deals over $50,000 are capped at 20% maximum discount unless approved by a Manager.",
    ruleType: "max_discount",
    ruleConfig: { thresholdSize: 50000, maxDiscount: 20 },
    severity: "warning",
    active: true
  },
  {
    id: "POL-002",
    name: "Executive Review Cap",
    description: "Any deal with a discount greater than 40% must be reviewed by a Director.",
    ruleType: "requires_approval",
    ruleConfig: { discountFloor: 40, roleRequired: "director" },
    severity: "block",
    active: true
  },
  {
    id: "POL-003",
    name: "Robotics Industry Restrictions",
    description: "New Robotics deals are capped at 20% discount due to low initial margins.",
    ruleType: "blocklist_industry",
    ruleConfig: { industry: "Robotics", maxDiscount: 20 },
    severity: "warning",
    active: true
  },
  {
    id: "POL-004",
    name: "Low Win Probability Safeguard",
    description: "Deals with close probability under 30% are blocked automatically.",
    ruleType: "min_margin",
    ruleConfig: { minProbability: 30 },
    severity: "block",
    active: true
  }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    dealId: "DF-392",
    dealCompany: "Acme Corporation",
    userId: "SYSTEM",
    userName: "LangGraph Scorer",
    action: "ai_analysis",
    actorType: "ai",
    decision: "Auto-Approve Recommended",
    reasoning: "Score computed: Close Prob 88%, Risk Score 18%. Discount within limit.",
    metadata: { tokensUsed: 420, costUsd: 0.0021, latencyMs: 1420 },
    createdAt: "2026-06-12T10:30:45Z"
  },
  {
    id: "AUD-002",
    dealId: "DF-393",
    dealCompany: "Globex Inc",
    userId: "SYSTEM",
    userName: "LangGraph Risk Auditor",
    action: "policy_violation",
    actorType: "ai",
    decision: "Flagged for Manager Review",
    reasoning: "Violated Standard Discount Cap (30% > 20% limit for deals > $50K).",
    metadata: { violatedPolicies: ["POL-001"], tokensUsed: 465, costUsd: 0.0023, latencyMs: 1820 },
    createdAt: "2026-06-18T14:22:45Z"
  },
  {
    id: "AUD-003",
    dealId: "DF-396",
    dealCompany: "Hooli",
    userId: "M-VANCE",
    userName: "Marcus Vance",
    action: "manager_rejection",
    actorType: "user",
    decision: "Rejected",
    reasoning: "Discount too aggressive for low close probability. Renegotiate to max 15% discount.",
    createdAt: "2026-07-02T17:15:00Z"
  },
  {
    id: "AUD-004",
    dealId: "DF-398",
    dealCompany: "Stark Industries",
    userId: "M-VANCE",
    userName: "Marcus Vance",
    action: "manager_approval",
    actorType: "user",
    decision: "Approved with Override",
    reasoning: "Customer relationship value overrides minor policy breach.",
    createdAt: "2026-07-10T16:45:00Z"
  }
];

// Mock Analytics over time
const latencyData = [
  { date: "May 18", latency: 2.1, cost: 0.04 },
  { date: "May 25", latency: 2.3, cost: 0.08 },
  { date: "Jun 02", latency: 1.8, cost: 0.12 },
  { date: "Jun 10", latency: 2.5, cost: 0.15 },
  { date: "Jun 18", latency: 2.9, cost: 0.19 },
  { date: "Jun 25", latency: 2.2, cost: 0.23 },
  { date: "Jul 02", latency: 2.0, cost: 0.27 },
  { date: "Jul 10", latency: 2.4, cost: 0.31 },
  { date: "Jul 15", latency: 1.9, cost: 0.34 }
];

const riskDistributionData = [
  { name: "Low Risk", value: 45, color: "#10b981" },
  { name: "Medium Risk", value: 78, color: "#f59e0b" },
  { name: "High Risk", value: 28, color: "#ef4444" },
  { name: "Critical Risk", value: 5, color: "#7c3aed" }
];

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [currentRole, setCurrentRole] = useState<'sales_rep' | 'manager' | 'admin'>('sales_rep');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Sales Rep submit states
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newDealSize, setNewDealSize] = useState<number>(0);
  const [newDiscount, setNewDiscount] = useState<number>(0);
  const [newIndustry, setNewIndustry] = useState('SaaS');
  const [newProducts, setNewProducts] = useState<string>('');
  const [newHistory, setNewHistory] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manager decisions states
  const [selectedDealForAction, setSelectedDealForAction] = useState<Deal | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');

  // Admin filter states
  const [logFilterAction, setLogFilterAction] = useState('');
  const [dealFilterStatus, setDealFilterStatus] = useState('');
  
  // Quick Stat Counts
  const stats = useMemo(() => {
    const total = deals.length;
    const pendingManager = deals.filter(d => d.status === 'pending_manager').length;
    const pendingDirector = deals.filter(d => d.status === 'pending_director').length;
    const approved = deals.filter(d => d.status === 'approved').length;
    const rejected = deals.filter(d => d.status === 'rejected').length;
    const avgRisk = Math.round(deals.reduce((sum, d) => sum + (d.riskScore || 0), 0) / total) || 0;
    const totalValue = deals.reduce((sum, d) => sum + d.dealSize, 0);

    return { total, pendingManager, pendingDirector, approved, rejected, avgRisk, totalValue };
  }, [deals]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handler for Policy Toggle by Admin
  const handlePolicyToggle = (id: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === id) {
        const updated = !p.active;
        triggerToast(`Policy "${p.name}" status updated to ${updated ? 'Active' : 'Inactive'}`);
        return { ...p, active: updated };
      }
      return p;
    }));
  };

  // Handler for Sales Rep Deal Submission Simulation
  const handleDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName || newDealSize <= 0) {
      triggerToast("Error: Company Name and Deal Size are required.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisLogs(["[GATEWAY] Ingesting deal payload and validating UUID schema...", "[REDIS] Sliding window rate limit check passed (1/10 deals per hr)..."]);
    
    // Simulate pipeline execution step-by-step
    await new Promise(resolve => setTimeout(resolve, 600));
    setAnalysisLogs(prev => [...prev, "[LANGGRAPH] Initializing 3-agent orchestration pipeline...", "[AI SCORER] Running Close Probability Agent node...", "[AI SCORER] Retrieving 5 similar historical deals via pgvector search..."]);

    await new Promise(resolve => setTimeout(resolve, 600));
    // Determine close probability based on heuristics
    let closeProb = Math.max(30, Math.min(95, Math.round(85 - (newDiscount * 0.7) - (newDealSize > 100000 ? 10 : 0))));
    if (newHistory.toLowerCase().includes("new customer")) closeProb -= 12;
    closeProb = Math.max(10, Math.min(99, closeProb));

    setAnalysisLogs(prev => [...prev, `[AI SCORER] Close probability predicted: ${closeProb}%`, "[RISK AUDITOR] Evaluating deals against active policies in DB...", "[RISK AUDITOR] Triggered standard risk matrices..."]);

    await new Promise(resolve => setTimeout(resolve, 600));
    // Calculate risk score based on policy enforcer rules
    let riskScore = 0;
    let violated: string[] = [];

    // Check discount limit
    const p1 = policies.find(p => p.id === "POL-001");
    if (p1?.active && newDealSize > 50000 && newDiscount > 20) {
      riskScore += 30;
      violated.push(p1.id);
    }

    // Check director approval limit
    const p2 = policies.find(p => p.id === "POL-002");
    if (p2?.active && newDiscount > 40) {
      riskScore += 45;
      violated.push(p2.id);
    }

    // Check industry restrictions
    const p3 = policies.find(p => p.id === "POL-003");
    if (p3?.active && newIndustry === "Robotics" && newDiscount > 20) {
      riskScore += 25;
      violated.push(p3.id);
    }

    // Check low probability safeguard
    const p4 = policies.find(p => p.id === "POL-004");
    if (p4?.active && closeProb < 30) {
      riskScore += 50;
      violated.push(p4.id);
    }

    if (newHistory.toLowerCase().includes("new customer")) {
      riskScore += 15;
    }
    if (newDealSize > 50000 && newDiscount > 20) {
      riskScore += 20;
    }

    riskScore = Math.max(5, Math.min(100, riskScore));
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (riskScore >= 80) riskLevel = 'critical';
    else if (riskScore >= 60) riskLevel = 'high';
    else if (riskScore >= 35) riskLevel = 'medium';

    setAnalysisLogs(prev => [...prev, `[RISK AUDITOR] Risk Score calculated: ${riskScore}/100 (${riskLevel.toUpperCase()} RISK)`, "[POLICY ENFORCER] Deciding workflow routing path..."]);

    await new Promise(resolve => setTimeout(resolve, 600));
    // Determine workflow recommendation
    let status: Deal['status'] = 'approved';
    let recommendation = 'auto_approve';
    let reasoning = `All policies passed. Deal is auto-approved by rule config.`;

    if (riskScore >= 80 || newDiscount > 35) {
      status = 'pending_director';
      recommendation = 'director_review';
      reasoning = `High risk profile detected (${riskScore} risk points, ${newDiscount}% discount). Requires Director-level approval under Policy POL-002.`;
    } else if (riskScore >= 45 || newDiscount > 20) {
      status = 'pending_manager';
      recommendation = 'manager_review';
      reasoning = `Moderate to high risk profile detected (${riskScore} risk points). Violates active cap threshold of 20% discount. Routed to Manager approval.`;
    } else if (closeProb < 30) {
      status = 'rejected';
      recommendation = 'block';
      reasoning = `Deal blocked automatically. Estimated win probability of ${closeProb}% is below minimum compliance safeguard threshold.`;
    }

    const uniqueId = `DF-${Math.floor(Math.random() * 100) + 400}`;
    const productsArr = newProducts ? newProducts.split(',').map(s => s.trim()) : ["Standard Solution Suite"];

    const createdDeal: Deal = {
      id: uniqueId,
      companyName: newCompanyName,
      dealSize: Number(newDealSize),
      discountPercentage: Number(newDiscount),
      industry: newIndustry,
      products: productsArr,
      customerHistory: newHistory || "No previous history logged.",
      status,
      stage: "proposal",
      closeProbability: closeProb,
      riskScore,
      riskLevel,
      aiReasoning: reasoning,
      aiConfidence: Number((0.8 + Math.random() * 0.18).toFixed(2)),
      submittedBy: "Mahi Jadeja",
      createdAt: new Date().toISOString(),
      approvedBy: status === 'approved' ? "AI System (Auto-Approve)" : undefined,
      approvedAt: status === 'approved' ? new Date().toISOString() : undefined
    };

    // Create Audit Logs
    const logId = `AUD-${Math.floor(Math.random() * 100) + 100}`;
    const newAuditEntry: AuditLog = {
      id: logId,
      dealId: uniqueId,
      dealCompany: newCompanyName,
      userId: "AI-SYSTEM",
      userName: "LangGraph Orchestrator",
      action: status === 'approved' ? "ai_auto_approval" : "ai_flagged_review",
      actorType: "ai",
      decision: status === 'approved' ? "Auto-Approved" : `Escalated to ${recommendation.toUpperCase()}`,
      reasoning: reasoning,
      metadata: { violatedPolicies: violated, tokensUsed: 440, costUsd: 0.0022, latencyMs: 2400 },
      createdAt: new Date().toISOString()
    };

    setDeals(prev => [createdDeal, ...prev]);
    setAuditLogs(prev => [newAuditEntry, ...prev]);
    setIsAnalyzing(false);

    // Reset Form
    setNewCompanyName('');
    setNewDealSize(0);
    setNewDiscount(0);
    setNewProducts('');
    setNewHistory('');
    setAnalysisLogs([]);

    triggerToast(`Deal ${uniqueId} successfully submitted. Status: ${status.replace('_', ' ')}`);
  };

  // Handler for Manager Action (Approve / Reject)
  const submitManagerDecision = () => {
    if (!selectedDealForAction || !actionType) return;

    const notes = decisionNotes || "Manager reviewed and updated.";
    const actorName = "Marcus Vance";

    setDeals(prev => prev.map(d => {
      if (d.id === selectedDealForAction.id) {
        if (actionType === 'approve') {
          return {
            ...d,
            status: 'approved',
            approvedBy: actorName + ' (Manager Override)',
            approvedAt: new Date().toISOString()
          };
        } else {
          return {
            ...d,
            status: 'rejected',
            rejectedBy: actorName,
            rejectedAt: new Date().toISOString(),
            rejectionReason: notes
          };
        }
      }
      return d;
    }));

    // Append to Audit Logs
    const logId = `AUD-${Math.floor(Math.random() * 100) + 200}`;
    const newAuditEntry: AuditLog = {
      id: logId,
      dealId: selectedDealForAction.id,
      dealCompany: selectedDealForAction.companyName,
      userId: "M-VANCE",
      userName: actorName,
      action: actionType === 'approve' ? "manager_approval" : "manager_rejection",
      actorType: "user",
      decision: actionType === 'approve' ? "Approved with Override" : "Rejected",
      reasoning: notes,
      createdAt: new Date().toISOString()
    };

    setAuditLogs(prev => [newAuditEntry, ...prev]);
    setSelectedDealForAction(null);
    setActionType(null);
    setDecisionNotes('');
    triggerToast(`Deal ${selectedDealForAction.id} has been ${actionType === 'approve' ? 'Approved' : 'Rejected'}.`);
  };

  // Filtered lists
  const filteredDeals = useMemo(() => {
    return deals.filter(d => {
      if (dealFilterStatus && d.status !== dealFilterStatus) return false;
      return true;
    });
  }, [deals, dealFilterStatus]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (logFilterAction && log.action !== logFilterAction) return false;
      return true;
    });
  }, [auditLogs, logFilterAction]);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans flex flex-col relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Neon Glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      {/* Simulation Banner - Header */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-cyan-400 p-2 rounded-xl text-[#070913]">
              <Database className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                DealFlow <span className="text-indigo-400 font-extrabold">AI</span>
              </h1>
              <p className="text-[10px] text-indigo-300 font-mono tracking-wider">ENTERPRISE AUDIT & DEAL intelligence</p>
            </div>
          </div>

          {/* Role selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 px-2 hidden md:inline">Simulated Sandbox Role:</span>
            <button
              onClick={() => { setCurrentRole('sales_rep'); setActiveTab('dashboard'); }}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'sales_rep'
                  ? 'bg-indigo-600/90 text-white font-medium shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Sales Rep
            </button>
            <button
              onClick={() => { setCurrentRole('manager'); setActiveTab('dashboard'); }}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'manager'
                  ? 'bg-amber-600/90 text-white font-medium shadow-lg shadow-amber-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Manager
            </button>
            <button
              onClick={() => { setCurrentRole('admin'); setActiveTab('dashboard'); }}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all ${
                currentRole === 'admin'
                  ? 'bg-purple-600/90 text-white font-medium shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">Navigation</h3>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800/80 text-white border-l-4 border-indigo-500 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Main Dashboard
            </button>

            {currentRole === 'sales_rep' && (
              <button
                onClick={() => setActiveTab('submit_deal')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  activeTab === 'submit_deal'
                    ? 'bg-slate-800/80 text-white border-l-4 border-indigo-500 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Send className="w-4 h-4" />
                Submit New Deal
              </button>
            )}

            {currentRole === 'manager' && (
              <button
                onClick={() => setActiveTab('approvals')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  activeTab === 'approvals'
                    ? 'bg-slate-800/80 text-white border-l-4 border-amber-500 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Approval Queue
                {stats.pendingManager > 0 && (
                  <span className="ml-auto bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {stats.pendingManager}
                  </span>
                )}
              </button>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('policies')}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                    activeTab === 'policies'
                      ? 'bg-slate-800/80 text-white border-l-4 border-purple-500 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                  Policy Rules
                </button>
                <button
                  onClick={() => setActiveTab('audit_logs')}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                    activeTab === 'audit_logs'
                      ? 'bg-slate-800/80 text-white border-l-4 border-purple-500 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 text-purple-400" />
                  Audit Trail Logs
                </button>
              </>
            )}
          </div>

          {/* Quick Context Card */}
          <div className="bg-gradient-to-b from-slate-900/60 to-[#0e1227]/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              Role Permissions
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {currentRole === 'sales_rep' && "As a Sales Representative, you can submit new transactions, specify discount limits, and track approvals on your submitted dashboard."}
              {currentRole === 'manager' && "As a Sales Manager, you oversee all pipeline deals. You have override authority to approve or reject deals flagged for high discount parameters."}
              {currentRole === 'admin' && "As a System Administrator, you manage the compliance policy thresholds, view deep agent cost/latency metrics, and review immutable audit records."}
            </p>
            <div className="border-t border-slate-800/80 pt-3">
              <span className="text-[10px] font-mono text-slate-500">Workspace status: </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                Next.js Dev Server Live
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">

          {/* TAB 1: Main Dashboard */}
          {activeTab === 'dashboard' && (
            <>
              {/* Header Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all">
                  <span className="text-xs text-slate-400">Total Pipeline</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold tracking-tight text-white">${(stats.totalValue / 1000).toFixed(0)}k</span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      +12%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">{stats.total} total deals</span>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all">
                  <span className="text-xs text-slate-400">Pending Review</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-bold tracking-tight text-amber-400">{stats.pendingManager + stats.pendingDirector}</span>
                    <span className="text-xs text-slate-500">deals</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">{stats.pendingDirector} critical escalations</span>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all">
                  <span className="text-xs text-slate-400">Approved Ratio</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-bold tracking-tight text-emerald-400">
                      {Math.round((stats.approved / (stats.approved + stats.rejected || 1)) * 100)}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">{stats.approved} approved, {stats.rejected} rejected</span>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all">
                  <span className="text-xs text-slate-400">Avg Risk Rating</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-bold tracking-tight text-indigo-400">{stats.avgRisk}</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">Moderate classification</span>
                </div>
              </div>

              {/* Interactive Charts (Visible to Admin, hidden or simplified for Reps) */}
              {currentRole === 'admin' && isMounted && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart 1: AI Latency and Cost */}
                  <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-5 rounded-2xl">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-400" />
                      LangGraph Node Latency & Token Costs (USDT)
                    </h3>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={latencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                          <YAxis stroke="#64748b" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                          <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                          <Area type="monotone" dataKey="latency" name="Latency (seconds)" stroke="#6366f1" fillOpacity={1} fill="url(#colorLatency)" />
                          <Area type="monotone" dataKey="cost" name="LLM Cost ($)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCost)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Risk Profile Distribution */}
                  <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-5 rounded-2xl">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-purple-400" />
                      Deals Risk Distribution
                    </h3>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={riskDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                          <YAxis stroke="#64748b" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                          <Bar dataKey="value" name="Deals Volume" radius={[4, 4, 0, 0]}>
                            {riskDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Deal Pipeline table (Role-aware filtering) */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                  <div>
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <ClipboardList className="w-4.5 h-4.5 text-indigo-400" />
                      Deal Pipeline Overview
                    </h3>
                    <p className="text-xs text-slate-400">All submitted transactions and their corresponding AI analysis</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Filter status:</span>
                    <select
                      value={dealFilterStatus}
                      onChange={(e) => setDealFilterStatus(e.target.value)}
                      className="bg-slate-950 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="approved">Approved</option>
                      <option value="pending_manager">Pending Manager</option>
                      <option value="pending_director">Pending Director</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-medium">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Company</th>
                        <th className="py-3 px-3">Deal Value</th>
                        <th className="py-3 px-3 text-center">Discount</th>
                        <th className="py-3 px-3">Close Prob.</th>
                        <th className="py-3 px-3">Risk Rating</th>
                        <th className="py-3 px-3">Workflow State</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredDeals.map((deal) => (
                        <tr key={deal.id} className="hover:bg-slate-800/20 group transition-all">
                          <td className="py-3.5 px-3 font-mono font-semibold text-indigo-300">{deal.id}</td>
                          <td className="py-3.5 px-3 font-medium text-white">
                            <div>{deal.companyName}</div>
                            <div className="text-[10px] text-slate-500 font-normal mt-0.5">{deal.industry}</div>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-200">
                            ${deal.dealSize.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-300">
                            {deal.discountPercentage}%
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-200">{deal.closeProbability}%</span>
                              <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden hidden sm:block">
                                <div 
                                  className="bg-emerald-500 h-1.5 rounded-full" 
                                  style={{ width: `${deal.closeProbability}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            {deal.riskScore !== undefined ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                                deal.riskLevel === 'low' ? 'bg-emerald-500/10 text-emerald-400' :
                                deal.riskLevel === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                                deal.riskLevel === 'high' ? 'bg-rose-500/10 text-rose-400' :
                                'bg-purple-500/10 text-purple-400'
                              }`}>
                                <AlertTriangle className="w-3 h-3" />
                                {deal.riskScore} ({deal.riskLevel})
                              </span>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${
                              deal.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              deal.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              deal.status === 'pending_director' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                deal.status === 'approved' ? 'bg-emerald-400' :
                                deal.status === 'rejected' ? 'bg-rose-400' :
                                deal.status === 'pending_director' ? 'bg-purple-400' :
                                'bg-amber-400'
                              }`} />
                              {deal.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            {/* Manager Actions inline */}
                            {currentRole === 'manager' && (deal.status === 'pending_manager' || deal.status === 'pending_director') ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedDealForAction(deal);
                                    setActionType('approve');
                                  }}
                                  className="p-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors"
                                  title="Approve Deal"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedDealForAction(deal);
                                    setActionType('reject');
                                  }}
                                  className="p-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                                  title="Reject Deal"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">
                                {deal.approvedBy ? "Auto-Approved" : deal.rejectedBy ? "Rejected" : "Complete"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Submit Deal (Sales Rep role) */}
          {activeTab === 'submit_deal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submission Form */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-400" />
                  Initiate New Deal Audit
                </h3>
                <p className="text-xs text-slate-400 mb-6">Specify parameters. The LangGraph agent pipeline will score risk and audit policy violations.</p>

                <form onSubmit={handleDealSubmit} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wayne Enterprises"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1.5">Deal Size ($ USD) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 75000"
                        value={newDealSize || ''}
                        onChange={(e) => setNewDealSize(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1.5">Discount % *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="100"
                        placeholder="e.g. 25"
                        value={newDiscount || ''}
                        onChange={(e) => setNewDiscount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1.5">Industry Segment</label>
                      <select
                        value={newIndustry}
                        onChange={(e) => setNewIndustry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="SaaS">SaaS</option>
                        <option value="FinTech">FinTech</option>
                        <option value="Robotics">Robotics</option>
                        <option value="BioTech">BioTech</option>
                        <option value="Defense Tech">Defense Tech</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1.5">Products (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Enterprise SLA, API Key"
                        value={newProducts}
                        onChange={(e) => setNewProducts(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">Customer Relationship History / Context</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Strategic partner since 2024. Active competitor bidding against us. Requesting custom integration SLAs."
                      value={newHistory}
                      onChange={(e) => setNewHistory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        AI Agent Analysis Running...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Analyze Deal & Submit
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Live Agent Terminal Log */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-slate-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
                      LangGraph Agents Pipeline Logs
                    </span>
                    <span className="text-[10px] text-slate-600">v1.0 (Live)</span>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {analysisLogs.length === 0 ? (
                      <p className="text-slate-600 italic">Waiting for transaction payload submission to spawn agent nodes...</p>
                    ) : (
                      analysisLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-slate-600">[{idx+1}]</span>
                          <span className={
                            log.includes('[AI SCORER]') ? 'text-indigo-400' :
                            log.includes('[RISK AUDITOR]') ? 'text-amber-400' :
                            log.includes('[POLICY ENFORCER]') ? 'text-purple-400' :
                            log.includes('calculated') || log.includes('predicted') ? 'text-emerald-400 font-bold' :
                            'text-slate-400'
                          }>
                            {log}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-4 mt-4 text-[10px] text-slate-500">
                  <p>Database: postgresql://localhost:5432/dealflow</p>
                  <p>Circuit Breaker Fallback Mode: Deterministic Rules Engine (Inactive)</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Approval Queue (Manager role) */}
          {activeTab === 'approvals' && (
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                Active Review Queue
              </h3>
              <p className="text-xs text-slate-400 mb-6">Deals flagged for high risk or policy deviations. Review recommendation reasons and override or reject.</p>

              {deals.filter(d => d.status === 'pending_manager' || d.status === 'pending_director').length === 0 ? (
                <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-slate-800/40">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-200">All caught up!</p>
                  <p className="text-xs text-slate-500">No deals are currently pending review in the queue.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deals.filter(d => d.status === 'pending_manager' || d.status === 'pending_director').map((deal) => (
                    <div key={deal.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-900">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{deal.companyName}</span>
                            <span className="font-mono text-xs text-indigo-300">({deal.id})</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              deal.status === 'pending_director' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {deal.status === 'pending_director' ? 'Director Review Needed' : 'Manager Review Needed'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">Submitted by: {deal.submittedBy} • Segment: {deal.industry}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-200">${deal.dealSize.toLocaleString()}</div>
                          <p className="text-[10px] text-slate-400">Discount Requested: {deal.discountPercentage}%</p>
                        </div>
                      </div>

                      {/* AI Scorer & Auditor outputs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs">
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
                          <span className="text-slate-400 font-medium block">Close Probability</span>
                          <span className="text-lg font-bold text-white mt-1 block">{deal.closeProbability}%</span>
                        </div>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
                          <span className="text-slate-400 font-medium block">AI Risk Score</span>
                          <span className={`text-lg font-bold mt-1 block ${
                            deal.riskLevel === 'critical' ? 'text-purple-400' : 'text-rose-400'
                          }`}>{deal.riskScore} / 100</span>
                        </div>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/50">
                          <span className="text-slate-400 font-medium block">Confidence Score</span>
                          <span className="text-lg font-bold text-slate-200 mt-1 block">{(deal.aiConfidence || 0) * 100}%</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/20 border border-slate-800/70 p-3.5 rounded-lg mb-4 text-xs">
                        <span className="text-indigo-400 font-semibold block mb-1">AI Recommendation Reasoning:</span>
                        <p className="text-slate-300 leading-relaxed">{deal.aiReasoning}</p>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setSelectedDealForAction(deal);
                            setActionType('reject');
                          }}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs px-4 py-2 rounded-xl transition-all border border-rose-500/25 flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject Deal
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDealForAction(deal);
                            setActionType('approve');
                          }}
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs px-4 py-2 rounded-xl transition-all border border-emerald-500/25 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve (Override Policy)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Policy Settings (Admin role) */}
          {activeTab === 'policies' && (
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    System Compliance Policies
                  </h3>
                  <p className="text-xs text-slate-400">Configure discount validation caps and automated routing thresholds</p>
                </div>
                <button
                  onClick={() => triggerToast("Feature: Custom policy designer is available in the v2 roadmap.")}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Create Policy
                </button>
              </div>

              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-800 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{policy.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">({policy.id})</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          policy.severity === 'block' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {policy.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{policy.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">Status:</span>
                      <button
                        onClick={() => handlePolicyToggle(policy.id)}
                        className={`text-xs px-3.5 py-1.5 rounded-xl border font-semibold transition-all ${
                          policy.active
                            ? 'bg-purple-600/15 border-purple-500/30 text-purple-400'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {policy.active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Audit Logs (Admin role) */}
          {activeTab === 'audit_logs' && (
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-purple-400" />
                    Immutable Audit Trail
                  </h3>
                  <p className="text-xs text-slate-400">Append-only log containing all system executions, AI evaluations, and manual overrides</p>
                </div>
                <div>
                  <select
                    value={logFilterAction}
                    onChange={(e) => setLogFilterAction(e.target.value)}
                    className="bg-slate-950 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">All Actions</option>
                    <option value="ai_analysis">AI Analysis</option>
                    <option value="policy_violation">Policy Violation</option>
                    <option value="manager_approval">Manager Approval</option>
                    <option value="manager_rejection">Manager Rejection</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-medium">
                      <th className="py-2.5 px-3">Transaction ID</th>
                      <th className="py-2.5 px-3">Deal ID</th>
                      <th className="py-2.5 px-3">Actor</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Outcome Decision</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 font-mono">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/10 transition-colors">
                        <td className="py-3 px-3 text-slate-500">{log.id}</td>
                        <td className="py-3 px-3">
                          <span className="text-indigo-400">{log.dealId || '-'}</span>
                          {log.dealCompany && <span className="text-[10px] text-slate-500 font-normal ml-1">({log.dealCompany})</span>}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${
                            log.actorType === 'ai' ? 'bg-indigo-500/10 text-indigo-400' :
                            log.actorType === 'system' ? 'bg-slate-800 text-slate-300' :
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                            {log.actorType === 'ai' ? 'AI Agent' : log.actorType === 'system' ? 'System' : 'User'}
                            {log.userName && <span className="text-slate-400 font-normal">({log.userName})</span>}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-300">{log.action}</td>
                        <td className="py-3 px-3 text-slate-300 font-sans">{log.decision || '-'}</td>
                        <td className="py-3 px-3 text-slate-500 text-[10px]">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-950/80 backdrop-blur-md border-t border-slate-900 px-6 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
            <p className="font-mono text-[10px] text-slate-400">Security Target: JWT / bcrypt hashed / pgvector indices active</p>
          </div>
          <p>© 2026 DealFlow AI Portfolio Project. Designed for recruitment engineering demonstration.</p>
        </div>
      </footer>

      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-slide-in-right backdrop-blur-md">
          <Info className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* DECISION OVERLAY DIALOG (MANAGER ACTIONS) */}
      {selectedDealForAction && actionType && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">
              {actionType === 'approve' ? 'Approve Deal with Policy Override' : 'Reject Deal Submission'}
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              {actionType === 'approve' 
                ? `You are overriding the policy flags for ${selectedDealForAction.companyName} (${selectedDealForAction.id}). Please document the business justification below.`
                : `Please enter the reason for rejecting the discount request for ${selectedDealForAction.companyName}.`
              }
            </p>

            <textarea
              rows={3}
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder={actionType === 'approve' ? "e.g., Strategic account renewal, high long-term retention value overrides initial margin reduction." : "e.g., Discount is excessive. Renegotiate terms to max 15% discount."}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none mb-4"
            />

            <div className="flex justify-end gap-3 text-xs font-semibold">
              <button
                onClick={() => {
                  setSelectedDealForAction(null);
                  setActionType(null);
                  setDecisionNotes('');
                }}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={submitManagerDecision}
                className={`px-4 py-2 text-white rounded-xl transition-all ${
                  actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20' : 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20'
                }`}
              >
                Submit Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
