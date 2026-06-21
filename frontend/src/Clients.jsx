/* eslint-disable */
// BEDROCK — mock data for prototype
export const USER = {
  name: "John",
  business: "JM Earthworks & Concrete",
  region: "Brisbane, QLD",
  abn: "82 645 991 220",
};

export const SNAPSHOT = {
  quotesSent: 12,
  awaitingApproval: 4,
  jobsWon: 7,
  revenue: 18450,
};

export const PIPELINE = {
  draft: 3,
  sent: 8,
  followUp: 4,
  approved: 2,
};

export const RECENT_ACTIVITY = [
  {
    id: "245",
    client: "Smith Earthworks",
    quoteNo: "Q-0245",
    amount: 6500,
    status: "Sent",
    when: "2h ago",
    job: "Site cut + pad prep",
  },
  {
    id: "246",
    client: "Jones Civil",
    quoteNo: "Q-0246",
    amount: 12400,
    status: "Awaiting Approval",
    when: "Yesterday",
    job: "Driveway + drainage",
  },
  {
    id: "244",
    client: "Harper Landscaping",
    quoteNo: "Q-0244",
    amount: 4200,
    status: "Approved",
    when: "2 days ago",
    job: "Retaining wall — 12m",
  },
];

export const FOLLOWUPS = [
  {
    id: "242",
    client: "Outback Civil",
    quoteNo: "Q-0242",
    amount: 4900,
    job: "Trenching + drainage",
    age: 7,
    risk: "medium",
    note: "No response since quote sent",
  },
  {
    id: "240",
    client: "Riverside Homes",
    quoteNo: "Q-0240",
    amount: 9300,
    job: "Site cut + retaining wall",
    age: 9,
    risk: "high",
    note: "Owner away — call back Monday",
  },
  {
    id: "239",
    client: "Coastal Concrete",
    quoteNo: "Q-0239",
    amount: 8200,
    job: "Exposed agg patio",
    age: 5,
    risk: "medium",
    note: "Waiting on engineering plans",
  },
];

export const CLIENTS = [
  { id: 1, name: "Smith Earthworks", company: "Smith Earthworks Pty Ltd", phone: "0412 884 221", email: "mark@smithearth.com.au", suburb: "Carindale", jobs: 4, value: 24300 },
  { id: 2, name: "Jones Civil", company: "Jones Civil Group", phone: "0455 110 882", email: "dave@jonescivil.au", suburb: "Coorparoo", jobs: 6, value: 58200 },
  { id: 3, name: "Harper Landscaping", company: "Harper & Co", phone: "0421 332 119", email: "kate@harperland.com", suburb: "Bulimba", jobs: 2, value: 8800 },
  { id: 4, name: "Coastal Concrete", company: "Coastal Concrete QLD", phone: "0438 992 005", email: "ops@coastalconcrete.au", suburb: "Cleveland", jobs: 3, value: 17400 },
  { id: 5, name: "Outback Excavations", company: "Outback Civil", phone: "0419 442 776", email: "billy@outbackex.au", suburb: "Ipswich", jobs: 1, value: 4900 },
];

export const JOBS = [
  { id: 1, client: "Smith Earthworks", title: "Site cut + pad prep", status: "Scheduled", start: "Mon 12 Feb", value: 6500, address: "14 Stanley St, Carindale" },
  { id: 2, client: "Jones Civil", title: "Driveway + drainage", status: "In Progress", start: "Today", value: 12400, address: "88 Oxford St, Coorparoo" },
  { id: 3, client: "Harper Landscaping", title: "Retaining wall 12m", status: "Awaiting Materials", start: "Wed 14 Feb", value: 4200, address: "31 Riverside Dr, Bulimba" },
  { id: 4, client: "Coastal Concrete", title: "Exposed agg patio", status: "Completed", start: "Last week", value: 8200, address: "9 Bayview Tce, Cleveland" },
];

export const QUOTES = [
  { id: "Q-0245", client: "Smith Earthworks", stage: "sent", amount: 6500, age: "2d", risk: "medium" },
  { id: "Q-0246", client: "Jones Civil", stage: "awaiting", amount: 12400, age: "1d", risk: "low" },
  { id: "Q-0244", client: "Harper Landscaping", stage: "approved", amount: 4200, age: "5d", risk: "none" },
  { id: "Q-0243", client: "Coastal Concrete", stage: "draft", amount: 8200, age: "1d", risk: "high" },
  { id: "Q-0242", client: "Outback Civil", stage: "followup", amount: 4900, age: "7d", risk: "medium" },
  { id: "Q-0241", client: "Bayside Builders", stage: "sent", amount: 21800, age: "3d", risk: "low" },
  { id: "Q-0240", client: "Riverside Homes", stage: "followup", amount: 9300, age: "9d", risk: "high" },
];

// SUBGRADE AI — categories of hidden costs the AI scans for
export const HIDDEN_COST_CATEGORIES = [
  { id: "delivery", label: "Delivery fees", icon: "Truck" },
  { id: "supplier-distance", label: "Supplier distance", icon: "Route" },
  { id: "float", label: "Machine float fees", icon: "Forklift" },
  { id: "disposal", label: "Disposal costs", icon: "Trash2" },
  { id: "tip", label: "Tip fees", icon: "Landmark" },
  { id: "travel", label: "Travel time", icon: "Clock" },
  { id: "access", label: "Site access issues", icon: "AlertTriangle" },
  { id: "labour", label: "Extra hand labour", icon: "Users" },
  { id: "minimum-order", label: "Minimum order fees", icon: "PackageMinus" },
  { id: "waiting", label: "Waiting time", icon: "Hourglass" },
  { id: "permits", label: "Permits", icon: "FileBadge" },
  { id: "weather", label: "Wet weather risk", icon: "CloudRain" },
  { id: "pump", label: "Concrete pump fees", icon: "Wrench" },
  { id: "regional", label: "Regional pricing diff.", icon: "MapPin" },
  { id: "availability", label: "Material availability", icon: "Boxes" },
];

// Detected hidden cost risks for current dashboard alert
export const DASHBOARD_RISKS = [
  { quote: "Q-0246", flag: "Delivery + access not allowed for", severity: "high", est: 720 },
  { quote: "Q-0243", flag: "Disposal/tip fees missing", severity: "medium", est: 460 },
];

export const MARGIN_AT_RISK = 1180; // sum of unprotected margin SUBGRADE AI detected

export const STATUS_COLORS = {
  Sent: "amber",
  "Awaiting Approval": "amber",
  Approved: "green",
  Draft: "mute",
  "Follow Up": "red",
  Scheduled: "amber",
  "In Progress": "gold",
  "Awaiting Materials": "amber",
  Completed: "green",
};
