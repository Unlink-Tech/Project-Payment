/**
 * Single source of truth for site content.
 * Copy is carried over from the existing projectpayment.me pages.
 */

export const site = {
  name: "Project Payment",
  legalName: "Project Payment Pte. Ltd.",
  tagline: "Payments & e-commerce advisory",
  description:
    "Independent payments and e-commerce advisory. We help digital businesses build resilient, operationally sound commerce ecosystems.",
  url: "https://projectpayment.me",
  founded: "2021",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

export const contact = {
  emails: [
    { label: "sales@projpayment.com", href: "mailto:sales@projpayment.com", note: "Project enquiries" },
  ],
  offices: [
    {
      entity: "Project Payment Pte Ltd",
      region: "Singapore",
      address: "7 Temasek Boulevard, #32-18 Suntec Tower One, Singapore 038987",
    },
    {
      entity: "Project Payment HK Limited",
      region: "Hong Kong",
      address: "Unit 308, 3/F, Chevalier House, 45-51 Chatham Rd South, Tsim Sha Tsui, Hong Kong",
    },
  ],
} as const;

export type Service = {
  slug: string;
  index: string;
  title: string;
  short: string;
  summary: string;
  capabilities: string[];
  outcome: string;
  /** Imagery for the practice. Shared by the home-page row and the services page. */
  art: string;
  /** Line shown over the artwork on hover: the promise, in one sentence. */
  hoverLine: string;
};

export const services: Service[] = [
  {
    slug: "ecommerce-platform-consultancy",
    index: "01",
    title: "E-Commerce Platform Consultancy",
    short: "Architecture, scalability, and payments optimisation.",
    summary:
      "Guidance on designing, optimising, and future-proofing the platform your business runs on, from architecture through to the payment stack.",
    capabilities: [
      "Platform architecture design and scalability planning",
      "Technical solution evaluation and vendor assessment",
      "Payment gateway and infrastructure optimisation",
      "System integrations and operational workflow alignment",
      "Upgrade and migration strategy",
    ],
    outcome:
      "Platforms that are not merely functional, but robust, scalable, and aligned with long-term commercial objectives.",
    art: "/placeholders/wide-1.webp",
    hoverLine: "Architecture that still holds at ten times the volume.",
  },
  {
    slug: "foreign-company-management",
    index: "02",
    title: "Foreign Company Management",
    short: "Structured support for cross-border expansion.",
    summary:
      "Support for businesses expanding internationally, addressing the regulatory, structural, and operational questions that decide whether a new market works.",
    capabilities: [
      "Administrative and operational setup guidance",
      "International business structuring support",
      "Access to regional networks and ecosystem partners",
      "Operational readiness planning for new markets",
    ],
    outcome:
      "Cross-border growth that is strategically planned, operationally sound, and aligned with compliance and market expectations.",
    art: "/placeholders/wide-2.webp",
    hoverLine: "Enter the next market without relearning it the hard way.",
  },
  {
    slug: "ecommerce-operations-advisory",
    index: "03",
    title: "E-Commerce Operations Advisory",
    short: "Operational discipline, risk mitigation, sustainable growth.",
    summary:
      "Strengthening the operational frameworks behind the business, so growth is backed by disciplined oversight rather than improvisation.",
    capabilities: [
      "Ongoing strategic advisory and operational reviews",
      "Industry best-practice alignment",
      "Risk identification and mitigation guidance",
      "Payment and transaction flow optimisation",
      "Continuous improvement across business processes",
    ],
    outcome:
      "Operations that hold their shape under growth, with risk identified early and processes that improve on a schedule.",
    art: "/placeholders/wide-3.webp",
    hoverLine: "Growth you can support on Monday morning.",
  },
];

/**
 * The "why us" argument, framed as a contrast rather than a list of adjectives.
 * Each row names the dimension, what the market usually does, and what we do.
 */
export const differentiators = [
  {
    dimension: "Incentives",
    title: "Independent by design",
    usual: "Paid a referral fee by the platform they recommend.",
    ours: "No reseller agreements, no referral fees. You are the only client.",
  },
  {
    dimension: "Scope",
    title: "Depth across the stack",
    usual: "Payments, compliance, and operations reviewed by three separate parties.",
    ours: "Treated as one system, because that is how they fail.",
  },
  {
    dimension: "Horizon",
    title: "Built to scale",
    usual: "A design that fits the market you are trading in this year.",
    ours: "Strategies that hold as you add markets, currencies, and volume.",
  },
  {
    dimension: "Output",
    title: "Operationally grounded",
    usual: "A slide deck, delivered and then filed.",
    ours: "Ranked actions with owners, effort, and measures attached.",
  },
];

/**
 * The four domains named in the mission statement, as an interactive dial.
 * `angle` is degrees clockwise from 12 o'clock on that dial.
 */
export const disciplines = [
  {
    key: "payments",
    label: "Payments",
    angle: -90,
    body: "Authorisation rates, settlement timing, and what each transaction actually costs you once the fees are unpicked.",
    proof: "Fewer failed payments, faster cash",
  },
  {
    key: "technology",
    label: "Technology",
    angle: 0,
    body: "The architecture underneath the storefront: whether it holds at your next peak, and what it costs to change later.",
    proof: "Peaks handled without firefighting",
  },
  {
    key: "operations",
    label: "Operations",
    angle: 90,
    body: "The routines, owners, and controls that keep the promise after launch day, when attention moves elsewhere.",
    proof: "Earlier warnings, fewer surprises",
  },
  {
    key: "expansion",
    label: "Global expansion",
    angle: 180,
    body: "Entity structure, compliance, and payment rails for the market you enter next, planned before you commit to it.",
    proof: "New markets opened deliberately",
  },
];

export const values = [
  { title: "Integrity", body: "Transparency, independence, and professional standards in every engagement." },
  { title: "Practicality", body: "Recommendations that are executable and measurable, not theoretical." },
  { title: "Accountability", body: "We stand behind our recommendations with consistency." },
  { title: "Adaptability", body: "We monitor industry change so our clients stay current." },
  { title: "Partnership", body: "Lasting relationships built on trust and measurable outcomes." },
];

export const process = [
  {
    step: "01",
    title: "Discover",
    body: "We map your current platform, payment flows, and operating model, and identify where value leaks today.",
    duration: "Weeks 1-2",
    deliverable: "Current-state map",
    yours: "Every flow written down, including the ones nobody owns.",
  },
  {
    step: "02",
    title: "Diagnose",
    body: "Findings are ranked by commercial impact and effort, with the risks stated plainly and evidence attached.",
    duration: "Week 3",
    deliverable: "Ranked findings register",
    yours: "A shortlist you could act on tomorrow, worst first.",
  },
  {
    step: "03",
    title: "Design",
    body: "A target architecture and operating plan, sequenced so each phase pays for the next.",
    duration: "Weeks 4-6",
    deliverable: "Target architecture and roadmap",
    yours: "A route from here to there, costed and sequenced.",
  },
  {
    step: "04",
    title: "Deliver",
    body: "We stay through execution: vendor selection, integration oversight, and operational review.",
    duration: "Ongoing",
    deliverable: "Execution oversight",
    yours: "Someone accountable when the plan meets reality.",
  },
];

export const stats = [
  { value: 2021, suffix: "", label: "Founded", prefix: "" },
  { value: 3, suffix: "", label: "Advisory practices", prefix: "" },
  { value: 2, suffix: "", label: "Registered entities", prefix: "" },
  { value: 100, suffix: "%", label: "Vendor-neutral", prefix: "" },
];

export const faqs = [
  {
    q: "How does an engagement typically start?",
    a: "With a scoping conversation, at no cost. We establish what you are trying to change, what constraints you are working inside, and whether we are genuinely the right party to help. If we are not, we will say so.",
  },
  {
    q: "Are you tied to any platform or payment provider?",
    a: "No. We hold no reseller agreements, referral fees, or commercial relationships with the vendors we assess. Independence is the reason our recommendations are worth anything.",
  },
  {
    q: "Do you work with businesses outside Singapore and Hong Kong?",
    a: "Yes. Our entities are registered in Singapore and Hong Kong, and we advise on cross-border expansion into and out of both. Engagements are run remotely with on-site work where it is warranted.",
  },
  {
    q: "What does a deliverable actually look like?",
    a: "A prioritised set of recommendations with owners, effort estimates, and measures, plus the target architecture or operating model where relevant. Everything is written to be executed, not filed.",
  },
];
