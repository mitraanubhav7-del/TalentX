// TalentX Master Intelligence & Ecosystem Data
// Build for Bharat 2.0: Intelligent Talent and Workforce Ecosystem

export const INITIAL_USER = {
  id: "usr_101",
  name: "Priya Sharma",
  title: "Aspiring AI / Data Scientist & Final Year CS Undergraduate",
  tagline: "Learn → Build → Verify → Connect → Discover → Get Hired → Grow",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
  location: "Bengaluru, Karnataka, India",
  university: "National Institute of Technology (NIT) Karnataka",
  degree: "B.Tech in Computer Science and Engineering",
  gradYear: 2026,
  gpa: "8.9 / 10.0",
  about: "Passionate about machine learning, statistical modeling, and large-scale data systems. Eager to solve high-impact Bharat-scale problems using AI. Actively looking for Data Scientist / ML Engineer roles.",
  reputationScore: 940,
  verifiedBadgeCount: 4,
  careerReadiness: 78,
  targetRole: "Data Scientist",
  socialLinks: {
    github: "https://github.com/priyasharma-ai",
    linkedin: "https://linkedin.com/in/priyasharma-ai",
    portfolio: "https://priyasharma.dev",
  },
  skills: [
    { name: "Python", level: "Advanced", verified: true, score: 88, certId: "TX-VER-PY-8891" },
    { name: "SQL", level: "Intermediate", verified: true, score: 82, certId: "TX-VER-SQL-4412" },
    { name: "Statistics", level: "Intermediate", verified: true, score: 79, certId: "TX-VER-STAT-2094" },
    { name: "Pandas & NumPy", level: "Advanced", verified: true, score: 86, certId: "TX-VER-PD-9921" },
    { name: "Machine Learning", level: "Beginner", verified: false, score: 54, certId: null },
    { name: "Power BI", level: "Intermediate", verified: false, score: 62, certId: null },
    { name: "Cloud (AWS)", level: "Beginner", verified: false, score: 45, certId: null },
    { name: "Git & GitHub", level: "Intermediate", verified: true, score: 85, certId: "TX-VER-GIT-1021" },
  ],
  experience: [
    {
      id: "exp_1",
      role: "Data Science Intern",
      company: "BharatAnalytics Labs",
      location: "Bengaluru (Hybrid)",
      period: "May 2025 - Jul 2025",
      description: "Built automated data ingestion pipelines processing 2M+ daily e-commerce records. Developed baseline customer churn predictive models with 84% accuracy using Scikit-Learn and Pandas.",
      skillsUsed: ["Python", "SQL", "Pandas", "Scikit-Learn"]
    },
    {
      id: "exp_2",
      role: "Undergraduate Teaching Assistant - Python & DS",
      company: "NITK Computer Science Dept.",
      location: "Surathkal",
      period: "Jan 2025 - Apr 2025",
      description: "Mentored 120+ first-year engineering students in Python fundamentals, data structures, and algorithmic problem solving.",
      skillsUsed: ["Python", "Algorithms", "Mentorship"]
    }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering",
      institution: "National Institute of Technology Karnataka (NITK)",
      period: "2022 - 2026",
      grade: "CGPA: 8.9 / 10",
      highlights: "Coursework: Data Structures, Algorithms, DBMS, Probability & Statistics, Machine Learning, Operating Systems."
    },
    {
      degree: "Higher Secondary (CBSE - Class XII)",
      institution: "Delhi Public School, Bangalore",
      period: "2020 - 2022",
      grade: "96.4% in PCM + CS",
      highlights: "State Merit Scholar, Regional Olympiad Finalist."
    }
  ],
  projects: [
    {
      id: "proj_1",
      title: "AgriVision AI - Vernacular Crop Health Diagnostics",
      description: "Edge AI application allowing Indian smallholder farmers to diagnose crop diseases through smartphone photos with vernacular Hindi/Kannada voice guidance.",
      techStack: ["Python", "PyTorch", "FastAPI", "React Native", "AWS S3"],
      github: "https://github.com/priyasharma-ai/agrivision-bharat",
      demo: "https://agrivision-demo.talentx.dev",
      stars: 142,
      collaborators: 3,
      hackathonAward: "1st Runner Up - Build for Bharat AgriTech Hackathon 2025"
    },
    {
      id: "proj_2",
      title: "FinPulse - Real-time UPI Fraud Pattern Detection",
      description: "Stream analytics engine flagging anomalous multi-hop UPI micro-transactions using graph anomaly detection and statistical variance clustering.",
      techStack: ["Python", "SQL", "Kafka", "Pandas", "Streamlit"],
      github: "https://github.com/priyasharma-ai/finpulse-upi",
      demo: "https://finpulse.talentx.dev",
      stars: 89,
      collaborators: 2,
      hackathonAward: null
    }
  ],
  certifications: [
    {
      title: "DeepLearning.AI: Data Science & ML Specialization",
      issuer: "Coursera / Andrew Ng",
      date: "Aug 2025",
      credentialUrl: "https://coursera.org/verify/DL-9932"
    },
    {
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "Dec 2024",
      credentialUrl: "https://aws.amazon.com/verification/AWS-88219"
    }
  ]
};

// Skill verification question banks
export const VERIFICATION_TESTS = {
  "Python": {
    skill: "Python",
    durationMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "What is the output and memory behavior of using a generator expression `(x*2 for x in range(10**7))` compared to a list comprehension `[x*2 for x in range(10**7)]`?",
        options: [
          "Generator expression pre-allocates all elements into heap memory instantaneously.",
          "Generator expression returns a lazy iterator that yields elements on demand, consuming O(1) auxiliary memory.",
          "Both use exactly identical memory buffers in Python's C-API.",
          "Generators are slower and automatically compile down to NumPy ndarrays."
        ],
        correct: 1,
        explanation: "Generators use lazy evaluation and produce items one at a time using the iterator protocol, resulting in O(1) memory usage regardless of collection size."
      },
      {
        id: 2,
        question: "In Python, which built-in module and decorator is optimal for caching pure function return values using Least Recently Used eviction?",
        options: [
          "`functools.lru_cache`",
          "`itertools.memoize`",
          "`sys.cache_fast`",
          "`collections.cached_dict`"
        ],
        correct: 0,
        explanation: "`@functools.lru_cache` is the standard library decorator for memoization with an LRU cache."
      },
      {
        id: 3,
        question: "Consider: `a = [1, 2, [3, 4]]`; `b = list(a)`. If we execute `b[2].append(5)`, what is `a[2]`?",
        options: [
          "`[3, 4]` (unchanged because list(a) creates a deep copy)",
          "`[3, 4, 5]` (because list(a) performs a shallow copy, referencing the same inner list object)",
          "Throws an `ImmutableListException`",
          "`None`"
        ],
        correct: 1,
        explanation: "Shallow copying copies references to nested mutable objects. Changes to nested lists are reflected in both copies."
      },
      {
        id: 4,
        question: "What does the `GIL` (Global Interpreter Lock) in CPython prevent?",
        options: [
          "It prevents multiple operating system threads from executing Python bytecodes concurrently in the same process.",
          "It prevents I/O bound tasks from running asynchronously.",
          "It disables garbage collection during multi-threaded requests.",
          "It prevents importing third-party C-extensions."
        ],
        correct: 0,
        explanation: "CPython's GIL ensures only one native thread runs Python bytecode at any moment to keep reference counting thread-safe."
      },
      {
        id: 5,
        question: "How does the `__slots__` attribute optimize Python classes with millions of instances?",
        options: [
          "It converts methods to C machine code.",
          "It prevents the creation of the dynamic `__dict__` and `__weakref__` per instance, reducing memory footprint drastically.",
          "It enables automatic parallel multiprocessing across CPU cores.",
          "It forces attributes to be strictly statically typed floats."
        ],
        correct: 1,
        explanation: "`__slots__` allocates fixed array storage rather than dynamic hash dictionaries for each instance."
      }
    ]
  },
  "Machine Learning": {
    skill: "Machine Learning",
    durationMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "When evaluating an imbalanced fraud detection dataset where 99.8% of transactions are legitimate, which metric is most deceptive and least useful?",
        options: [
          "Area Under the Precision-Recall Curve (PR-AUC)",
          "Standard Accuracy (Accuracy Paradox)",
          "F1-Score with macro weighting",
          "Confusion Matrix False Negative Rate"
        ],
        correct: 1,
        explanation: "A naive model predicting 'no fraud' achieves 99.8% accuracy while failing 100% of actual fraud cases."
      },
      {
        id: 2,
        question: "What is the primary role of L1 regularization (Lasso) compared to L2 regularization (Ridge)?",
        options: [
          "L1 encourages sparse weights by driving non-critical coefficients strictly to zero (feature selection).",
          "L1 prevents gradient explosion in recurrent neural networks.",
          "L1 minimizes multicollinearity without removing any features.",
          "L1 only applies to un-normalized categorical features."
        ],
        correct: 0,
        explanation: "L1 regularization produces diamond-shaped constraint boundaries that intersect axes at zero, yielding sparse feature weights."
      },
      {
        id: 3,
        question: "In Gradient Boosted Decision Trees (XGBoost/LightGBM), what do subsequent trees specifically learn to predict?",
        options: [
          "Independent bootstrap random subsamples like Random Forest.",
          "The negative gradients (pseudo-residuals) of the loss function calculated from previous ensemble trees.",
          "Only linear interaction terms between high-cardinality features.",
          "The inverse probability weights of correct predictions."
        ],
        correct: 1,
        explanation: "Boosting iteratively fits new base learners to the residual errors (pseudo-residuals / gradients) of prior models."
      },
      {
        id: 4,
        question: "What phenomenon occurs when validation loss increases while training loss continues to decrease monotonically?",
        options: [
          "Underfitting due to excessive regularization",
          "Overfitting / high variance",
          "Vanishing gradient problem",
          "Covariate shift during batch normalization"
        ],
        correct: 1,
        explanation: "Monotonically decreasing training loss alongside diverging validation loss is the hallmark symptom of overfitting."
      },
      {
        id: 5,
        question: "Why should data preprocessing (e.g., StandardScaler or Mean Imputation) be fitted ONLY on the training fold during Cross-Validation?",
        options: [
          "To speed up matrix multiplication in GPU kernels.",
          "To prevent data leakage from the validation/test fold into the training phase.",
          "Because Scikit-Learn will throw an exception otherwise.",
          "To enforce non-negative float values."
        ],
        correct: 1,
        explanation: "Fitting transformers on the whole dataset leaks statistical parameters (mean, variance) from test to train, corrupting generalization estimates."
      }
    ]
  },
  "SQL": {
    skill: "SQL",
    durationMinutes: 8,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "What is the difference between `RANK()` and `DENSE_RANK()` window functions when encountering identical values?",
        options: [
          "`RANK()` leaves gaps in rank numbering (e.g. 1, 2, 2, 4), whereas `DENSE_RANK()` does not leave gaps (e.g. 1, 2, 2, 3).",
          "`DENSE_RANK()` can only be used with `GROUP BY` aggregates.",
          "`RANK()` only operates on unique primary keys.",
          "There is no difference in modern ANSI SQL."
        ],
        correct: 0,
        explanation: "`RANK()` skips subsequent ranks after ties, while `DENSE_RANK()` continues consecutively."
      },
      {
        id: 2,
        question: "Which index type is optimal in PostgreSQL/MySQL for range-based queries like `WHERE created_at BETWEEN '2026-01-01' AND '2026-03-31'`?",
        options: [
          "Hash Index",
          "B-Tree (Balanced Tree) Index",
          "Bloom Filter Index",
          "Full-text GIN Index"
        ],
        correct: 1,
        explanation: "B-Tree maintains sorted order and logarithmic lookups, making it the premier choice for equality and range scans."
      },
      {
        id: 3,
        question: "What does `EXPLAIN ANALYZE` do in PostgreSQL?",
        options: [
          "It syntax checks the query without connecting to the database.",
          "It plans and actually executes the query, returning execution time, actual row counts, and buffer hit rates.",
          "It automatically creates missing foreign keys.",
          "It archives old logs to cold storage."
        ],
        correct: 1,
        explanation: "`EXPLAIN ANALYZE` runs the query plan against live tables to output empirical timing and row counts."
      },
      {
        id: 4,
        question: "What is the result of `SELECT COUNT(*)` versus `SELECT COUNT(column_name)` when some rows contain `NULL` in `column_name`?",
        options: [
          "Both return identical values.",
          "`COUNT(*)` counts all rows including NULLs; `COUNT(column_name)` counts only rows where `column_name IS NOT NULL`.",
          "`COUNT(column_name)` raises a NULL pointer exception.",
          "`COUNT(*)` automatically converts NULLs to empty strings."
        ],
        correct: 1,
        explanation: "`COUNT(expr)` excludes NULL evaluations, while `COUNT(*)` counts the total tuple count."
      },
      {
        id: 5,
        question: "What is the purpose of a Common Table Expression (`WITH cte AS (...)`)?",
        options: [
          "To enforce permanent database constraints.",
          "To define a temporary, named result set that can be referenced within a SELECT, INSERT, UPDATE, or DELETE statement, enhancing modularity and enabling recursive queries.",
          "To replicate tables across geo-distributed read replicas.",
          "To encrypt sensitive credit card columns at rest."
        ],
        correct: 1,
        explanation: "CTEs provide readable temporary subqueries and support recursive traversals."
      }
    ]
  }
};

// Target Roles with Skill Requirements & Market Intelligence
export const ROLES_CATALOG = {
  "Data Scientist": {
    title: "Data Scientist",
    category: "AI & Data",
    averageSalaryIndia: "₹14 - 28 LPA",
    globalSalary: "$120,000 - $185,000",
    hiringDemand: "Very High (+34% YoY)",
    requiredSkills: ["Python", "SQL", "Statistics", "Pandas & NumPy", "Machine Learning", "Data Visualization"],
    advancedSkills: ["Deep Learning", "MLOps", "Model Deployment", "Cloud (AWS/GCP)", "Feature Engineering"],
    whyRecommended: "Your verified proficiency in Python (88%), SQL (82%), and Statistics (79%) covers 65% of the core foundation. Adding ML and MLOps creates an immediate high-match candidate profile."
  },
  "Machine Learning Engineer": {
    title: "Machine Learning Engineer",
    category: "AI & Data",
    averageSalaryIndia: "₹16 - 32 LPA",
    globalSalary: "$140,000 - $210,000",
    hiringDemand: "Hyper-Growth (+58% YoY)",
    requiredSkills: ["Python", "Machine Learning", "Deep Learning", "PyTorch / TensorFlow", "Data Structures", "Docker"],
    advancedSkills: ["MLOps", "Model Quantization", "CUDA/Triton", "Kubernetes", "Vector Databases"],
    whyRecommended: "Strong programming base in Python with algorithmic thinking. Focus on transitioning from statistical modeling to production deployment architectures."
  },
  "Data Analyst": {
    title: "Data Analyst",
    category: "Analytics & BI",
    averageSalaryIndia: "₹8 - 16 LPA",
    globalSalary: "$80,000 - $115,000",
    hiringDemand: "Steady High (+21% YoY)",
    requiredSkills: ["SQL", "Python", "Power BI", "Statistics", "Excel", "Data Storytelling"],
    advancedSkills: ["A/B Testing", "Tableau", "dbt", "Snowflake", "Business Acumen"],
    whyRecommended: "Immediate 94% capability match. Your verified SQL and Statistics scores place you in the top 10% of entry-level analyst pools."
  },
  "Fullstack AI Engineer": {
    title: "Fullstack AI Engineer",
    category: "Software & AI",
    averageSalaryIndia: "₹15 - 30 LPA",
    globalSalary: "$130,000 - $190,000",
    hiringDemand: "Hyper-Growth (+72% YoY)",
    requiredSkills: ["Python", "React", "TypeScript", "FastAPI", "LLM APIs", "SQL"],
    advancedSkills: ["LangChain / LlamaIndex", "Vector DBs", "Next.js", "Docker", "Prompt Engineering"],
    whyRecommended: "Combines your Python and web engineering capabilities to build full-stack intelligent agentic applications."
  },
  "Cloud & DevOps Engineer": {
    title: "Cloud & DevOps Engineer",
    category: "Infrastructure",
    averageSalaryIndia: "₹12 - 24 LPA",
    globalSalary: "$115,000 - $170,000",
    hiringDemand: "Very High (+29% YoY)",
    requiredSkills: ["Linux", "Cloud (AWS)", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    advancedSkills: ["Prometheus", "Networking", "Security Hardening", "Golang", "Helm"],
    whyRecommended: "High market demand across Indian enterprises migrating on-prem workloads to hybrid multi-cloud."
  }
};

// Feed Posts for Professional Network (Slide 13)
export const INITIAL_POSTS = [
  {
    id: "post_1",
    author: {
      name: "Dr. Arvind Ramanathan",
      title: "Chief AI Architect @ BharatAI Labs | Ex-IISc Researcher",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      verified: true
    },
    timeAgo: "2 hours ago",
    content: "We just open-sourced our multi-lingual IndicLLM benchmark evaluating 12 regional languages across reasoning, legal reasoning, and healthcare diagnosis. Noticeable insight: Tokenizer efficiency in Devanagari and Dravidian scripts improved inference latency by 3.4x when vocabulary compression is trained on native vernacular corpora.\n\nLooking for research fellows and ML engineers passionate about Bharat-centric AI!",
    tags: ["#BuildForBharat", "#IndicAI", "#MachineLearning", "#TalentXResearch"],
    likes: 342,
    comments: 48,
    shares: 26,
    hasLiked: false,
    projectCard: {
      title: "IndicBenchmark v2.4 (Open Weights)",
      link: "https://github.com/bharat-ai/indic-benchmark",
      stars: "2.1k"
    }
  },
  {
    id: "post_2",
    author: {
      name: "Priya Sharma",
      title: "Data Science Aspirant @ NITK | TalentX Verified (Python 88%, SQL 82%)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      verified: true
    },
    timeAgo: "5 hours ago",
    content: "Thrilled to share that our team just completed AgriVision AI! 🌾\n\nWe trained lightweight MobileNet models to detect 14 common paddy and cotton leaf blights with 92.4% accuracy under varying sunlight conditions. Deployed on FastAPI + React Native with offline caching.\n\nHuge shoutout to the TalentX Hackathon Hub for connecting me with our UI/UX designer and backend lead! Still looking to collaborate on Edge TPU optimization.",
    tags: ["#AgriTech", "#ComputerVision", "#FastAPI", "#TalentXProjects"],
    likes: 189,
    comments: 31,
    shares: 14,
    hasLiked: true
  },
  {
    id: "post_3",
    author: {
      name: "Sneha Kulkarni",
      title: "VP of Engineering @ Razorpay | Hiring Tech Leads",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      verified: true
    },
    timeAgo: "1 day ago",
    content: "Resume-based screening is officially outdated. At Razorpay, when candidates apply with TalentX Verified Badges in Distributed Systems, Go, and SQL Performance Tuning, they skip the initial phone screen directly to round 2 architecture review.\n\nProof of skill > Claiming a skill on PDF. 🎯",
    tags: ["#SkillBasedHiring", "#RazorpayCareers", "#EngineeringLeadership"],
    likes: 512,
    comments: 87,
    shares: 64,
    hasLiked: false
  }
];

// AI-Recommended People You Should Meet (Slide 13 - Skills + Career Goals + Projects)
export const AI_SUGGESTED_CONNECTIONS = [
  {
    id: "conn_1",
    name: "Aditya Nair",
    title: "MLOps Engineer @ Swiggy AI",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    matchReason: "Shares your Target Role: Data Scientist / ML. Verified in MLOps (91%) & Docker — can mentor on deployment gaps.",
    mutualSkills: ["Python", "FastAPI", "Docker"],
    connectionType: "Peer Mentor",
    compatibilityScore: 96
  },
  {
    id: "conn_2",
    name: "Tanvi Deshmukh",
    title: "UI/UX & Product Designer @ CRED",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    matchReason: "Complementary skill match for Hackathons: Looking for an AI developer to partner on FinTech AI challenges.",
    mutualSkills: ["Product Strategy", "Figma", "Design Systems"],
    connectionType: "Hackathon Teammate",
    compatibilityScore: 93
  },
  {
    id: "conn_3",
    name: "Karthik Raja",
    title: "Staff Data Engineer @ PhonePe",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    matchReason: "Alumnus of NITK. Actively referrals high-scoring TalentX SQL & Python verified talent.",
    mutualSkills: ["SQL", "Data Pipelines", "Kafka"],
    connectionType: "Alumni Mentor",
    compatibilityScore: 91
  },
  {
    id: "conn_4",
    name: "Meera Sen",
    title: "Deep Learning Researcher @ IIT Madras",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    matchReason: "Co-authored papers in Computer Vision for Indian agriculture. Working on allied datasets.",
    mutualSkills: ["PyTorch", "Computer Vision", "Research"],
    connectionType: "Research Collaborator",
    compatibilityScore: 89
  }
];

// Project & Collaboration Hub (Slide 14)
export const COLLABORATION_PROJECTS = [
  {
    id: "collab_1",
    title: "BharatHealth: Vernacular Rural Telemedicine & Triage",
    description: "Multi-modal AI assistant translating doctor prescriptions and medical jargon into 8 regional Indian dialects with offline speech recognition.",
    team: [
      { role: "AI Developer", member: "Priya Sharma", filled: true },
      { role: "Backend Developer", member: "Rohan K.", filled: true },
      { role: "UI/UX Designer", member: null, filled: false },
      { role: "Vernacular NLP Specialist", member: null, filled: false }
    ],
    event: "Smart India Hackathon 2026",
    deadline: "In 12 days",
    tags: ["Healthcare", "IndicNLP", "Speech-to-Text", "FastAPI"],
    githubUrl: "https://github.com/bharat-health/triage-ai"
  },
  {
    id: "collab_2",
    title: "KisanCredit: Alternative Credit Scoring via Satellite Imagery",
    description: "Assessing agricultural crop yield through Sentinel-2 satellite data and vegetation index (NDVI) to provide micro-loans to unbanked farmers.",
    team: [
      { role: "Data Scientist", member: "Aman V.", filled: true },
      { role: "Satellite GIS Lead", member: null, filled: false },
      { role: "Frontend (Next.js)", member: null, filled: false },
      { role: "FinTech Compliance Lead", member: "Neha G.", filled: true }
    ],
    event: "NABARD AgriFin Challenge 2026",
    deadline: "In 18 days",
    tags: ["SatelliteData", "FinTech", "RemoteSensing", "PyTorch"],
    githubUrl: "https://github.com/kisan-credit/satellite-score"
  },
  {
    id: "collab_3",
    title: "LogiRoute: Green Last-Mile EV Delivery Optimization",
    description: "Dynamic routing algorithm minimizing carbon emissions for electric two-wheeler delivery fleets across tier-1 congested Indian corridors.",
    team: [
      { role: "Algorithms Engineer", member: "Suresh P.", filled: true },
      { role: "Fullstack Developer", member: "Maya R.", filled: true },
      { role: "IoT / Telematics Dev", member: null, filled: false }
    ],
    event: "Build for Bharat Sustainability Track",
    deadline: "In 25 days",
    tags: ["OperationsResearch", "EV", "GraphAlgorithms", "Go"],
    githubUrl: "https://github.com/logiroute/green-fleet"
  }
];

// Smart Opportunities (Slide 15)
export const OPPORTUNITIES = [
  {
    id: "opp_1",
    type: "Job",
    title: "Associate Data Scientist - AI Platforms",
    company: "Swiggy AI Labs",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&auto=format&fit=crop&q=80",
    location: "Bengaluru, India (Hybrid)",
    salary: "₹18 - 24 LPA + ESOPs",
    experience: "0-2 Years / Freshers Welcome",
    aiMatchScore: 89,
    requiredSkills: ["Python", "SQL", "Statistics", "Machine Learning", "Pandas"],
    skillMatchBreakdown: {
      matched: ["Python (Verified 88%)", "SQL (Verified 82%)", "Statistics (Verified 79%)", "Pandas (Verified 86%)"],
      missing: ["Production ML Deployment"]
    },
    assessmentRequired: "Swiggy ML Proficiency & Data Structures Test (TalentX Verified candidates fast-tracked)",
    urgency: "Hiring Urgently",
    applicantsCount: 42
  },
  {
    id: "opp_2",
    type: "Internship",
    title: "Machine Learning Research Intern (Summer 2026)",
    company: "Microsoft Research India",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    location: "Bengaluru / Remote",
    salary: "₹1,25,000 / month stipend",
    experience: "Final Year B.Tech / M.Tech / PhD",
    aiMatchScore: 84,
    requiredSkills: ["Python", "PyTorch", "Statistics", "Deep Learning", "Algorithms"],
    skillMatchBreakdown: {
      matched: ["Python (Verified 88%)", "Statistics (Verified 79%)"],
      missing: ["PyTorch Advanced", "Deep Learning Architectures"]
    },
    assessmentRequired: "Research Problem Statement + Coding Evaluation",
    urgency: "Applications Close in 5 Days",
    applicantsCount: 118
  },
  {
    id: "opp_3",
    type: "Hackathon",
    title: "Build for Bharat 2.0 National Hackathon",
    company: "Ministry of Electronics & IT + TalentX",
    logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80",
    location: "Online + Grand Finale in New Delhi",
    salary: "₹25,00,000 Prize Pool + Incubation",
    experience: "Open to Students & Startups",
    aiMatchScore: 97,
    requiredSkills: ["Python", "Problem Solving", "AI/ML", "FastAPI"],
    skillMatchBreakdown: {
      matched: ["Python (Verified 88%)", "FastAPI", "AgriTech/FinTech Project Experience"],
      missing: []
    },
    assessmentRequired: "Project Submission & Prototype Demo",
    urgency: "Registration Open",
    applicantsCount: 1840
  },
  {
    id: "opp_4",
    type: "Job",
    title: "Junior Analytics Engineer",
    company: "Razorpay",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80",
    location: "Bengaluru (Onsite)",
    salary: "₹14 - 18 LPA",
    experience: "0-1 Years",
    aiMatchScore: 94,
    requiredSkills: ["SQL", "Python", "Data Warehousing", "dbt", "Power BI"],
    skillMatchBreakdown: {
      matched: ["SQL (Verified 82%)", "Python (Verified 88%)", "Statistics (Verified 79%)"],
      missing: ["dbt (Data Build Tool)"]
    },
    assessmentRequired: "Razorpay SQL Schema Query Optimization Challenge",
    urgency: "Direct Interview for >80% Match",
    applicantsCount: 29
  }
];

// Employer Candidates with Explainable Candidate Matching (Slide 18)
export const CANDIDATES_POOL = [
  {
    id: "cand_1",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    university: "NIT Karnataka",
    gradYear: 2026,
    overallMatch: 88,
    status: "Shortlisted",
    matchedSkills: ["Python (88%)", "SQL (82%)", "Pandas (86%)", "Statistics (79%)"],
    skillGaps: ["Cloud Computing (AWS)", "Production MLOps"],
    assessmentScores: {
      python: 88,
      sql: 82,
      aptitude: 85,
      coding: 84
    },
    explainabilitySummary: "Candidate exceeds Python (88% vs 75% req) and SQL thresholds (82% vs 70% req). Strong hackathon portfolio with 2 verified data applications. Minor gap in cloud deployment can be addressed via onboarding.",
    hiringRecommendation: "Highly Recommended for Interview"
  },
  {
    id: "cand_2",
    name: "Devendra Verma",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    university: "IIT Roorkee",
    gradYear: 2025,
    overallMatch: 92,
    status: "Interview Scheduled",
    matchedSkills: ["Python (94%)", "Machine Learning (89%)", "SQL (78%)", "Docker (80%)"],
    skillGaps: ["Power BI"],
    assessmentScores: {
      python: 94,
      sql: 78,
      aptitude: 90,
      coding: 95
    },
    explainabilitySummary: "Exceptional coding evaluation (95%) and verified ML badge (89%). Strong background in PyTorch and tensor operations.",
    hiringRecommendation: "Fast-Track Offer Candidate"
  },
  {
    id: "cand_3",
    name: "Simran Kaur",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    university: "BITS Pilani",
    gradYear: 2026,
    overallMatch: 74,
    status: "Assessed",
    matchedSkills: ["Python (76%)", "SQL (70%)", "Data Visualization (82%)"],
    skillGaps: ["Machine Learning", "Statistics (Needs Improvement)"],
    assessmentScores: {
      python: 76,
      sql: 70,
      aptitude: 72,
      coding: 68
    },
    explainabilitySummary: "Good foundational frontend and dashboarding capabilities, but coding test fell below the 70% threshold (scored 68%). Recommended for Business Analyst rather than Core Data Scientist.",
    hiringRecommendation: "Consider for Alternative Role"
  },
  {
    id: "cand_4",
    name: "Rajesh Kannan",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
    university: "Anna University",
    gradYear: 2025,
    overallMatch: 81,
    status: "Applied",
    matchedSkills: ["Python (80%)", "SQL (84%)", "Statistics (81%)"],
    skillGaps: ["Machine Learning Models", "FastAPI"],
    assessmentScores: {
      python: 80,
      sql: 84,
      aptitude: 88,
      coding: 79
    },
    explainabilitySummary: "Balanced profile with solid SQL and analytics. Assessment pending round 2.",
    hiringRecommendation: "Review for Shortlist"
  }
];

// Workforce Intelligence Data (Slide 19)
export const WORKFORCE_SKILLS_DATA = [
  { skill: "Python", currentWorkforce: 85, futureDemand: 90, gapDelta: 5, action: "Upskill" },
  { skill: "SQL & Analytics", currentWorkforce: 78, futureDemand: 82, gapDelta: 4, action: "Upskill" },
  { skill: "Cloud (AWS/Azure/GCP)", currentWorkforce: 42, futureDemand: 88, gapDelta: 46, action: "Reskill + Hire" },
  { skill: "Machine Learning & AI", currentWorkforce: 38, futureDemand: 85, gapDelta: 47, action: "Hire + Reskill" },
  { skill: "MLOps & CI/CD", currentWorkforce: 22, futureDemand: 76, gapDelta: 54, action: "Hire Urgently" },
  { skill: "GenAI & Prompt Systems", currentWorkforce: 28, futureDemand: 80, gapDelta: 52, action: "Reskill" },
  { skill: "Cybersecurity & Zero Trust", currentWorkforce: 35, futureDemand: 68, gapDelta: 33, action: "Upskill" }
];

// University Intelligence Data (Slide 20)
export const UNIVERSITY_CURRICULUM_DATA = [
  {
    subject: "Python Programming",
    curriculumCoverage: 90,
    industryDemand: 95,
    status: "Aligned",
    recommendation: "Maintain course rigor; introduce modern typing and async programming modules."
  },
  {
    subject: "Relational DBMS & SQL",
    curriculumCoverage: 85,
    industryDemand: 88,
    status: "Aligned",
    recommendation: "Expand beyond standard normalization into vector indexing and columnar analytics."
  },
  {
    subject: "Probability & Statistics",
    curriculumCoverage: 80,
    industryDemand: 84,
    status: "Aligned",
    recommendation: "Incorporate Bayesian methods and causal inference case studies."
  },
  {
    subject: "Cloud Architecture (AWS/GCP)",
    curriculumCoverage: 32,
    industryDemand: 90,
    status: "Critical Gap",
    recommendation: "Introduce mandatory semester lab on cloud native microservices and serverless infrastructure."
  },
  {
    subject: "MLOps & Model Lifecycle",
    curriculumCoverage: 12,
    industryDemand: 82,
    status: "Outdated / Missing",
    recommendation: "Create a capstone module on CI/CD for AI models, drift detection, and automated retraining."
  },
  {
    subject: "GenAI & LLM Application Engineering",
    curriculumCoverage: 18,
    industryDemand: 86,
    status: "Critical Gap",
    recommendation: "Add elective on retrieval augmented generation (RAG), vector stores, and evaluation metrics."
  }
];

// Market Skill Trends (Slide 7 & 23)
export const MARKET_SKILL_TRENDS = {
  topDemanded: [
    { name: "Python", demandIndex: 98, growthYoY: "+28%", roles: "Data Science, AI, Backend, Automation" },
    { name: "SQL", demandIndex: 94, growthYoY: "+22%", roles: "Data Analytics, Backend, BI, Product" },
    { name: "Cloud (AWS/Azure)", demandIndex: 91, growthYoY: "+35%", roles: "DevOps, Platform, Solutions Architect" },
    { name: "React & TypeScript", demandIndex: 88, growthYoY: "+26%", roles: "Frontend, Fullstack Engineering" },
    { name: "Docker & Kubernetes", demandIndex: 85, growthYoY: "+40%", roles: "Cloud, Infrastructure, MLOps" }
  ],
  emergingHyperGrowth: [
    { name: "MLOps & LLM Deployment", growthYoY: "+114%", badge: "Hyper Growth", salaryImpact: "+42%" },
    { name: "Vector Databases (Pinecone/Milvus)", growthYoY: "+98%", badge: "Breakthrough", salaryImpact: "+36%" },
    { name: "Rust Systems Programming", growthYoY: "+78%", badge: "High Surge", salaryImpact: "+38%" },
    { name: "Agentic AI Frameworks (LangGraph)", growthYoY: "+145%", badge: "Top Emerging", salaryImpact: "+50%" }
  ],
  decliningSkills: [
    { name: "Legacy jQuery", growthYoY: "-38%", status: "Phasing Out", replacement: "React / Modern DOM" },
    { name: "Manual QA / Plain Scripting", growthYoY: "-44%", status: "Automated", replacement: "AI-Assisted CI/CD & Playwright" },
    { name: "Monolithic SOAP WebServices", growthYoY: "-52%", status: "Legacy", replacement: "gRPC & REST / GraphQL" }
  ]
};

// 30 Slides Presentation Data (Direct from Pitch Deck)
export const SLIDES_DATA = [
  {
    number: 1,
    title: "TalentX",
    subtitle: "AI-Powered Talent Intelligence & Professional Network",
    tagline: "Learn → Build → Verify → Connect → Discover → Get Hired → Grow",
    category: "Cover",
    badge: "Build for Bharat 2.0",
    bullets: [
      "Problem Statement: Intelligent Talent and Workforce Ecosystem",
      "Unified platform connecting People ↔ Skills ↔ Jobs ↔ Learning ↔ Network ↔ Industry Demand",
      "Built for students, professionals, enterprises, and academic institutions"
    ],
    interactiveAction: "explorePlatform"
  },
  {
    number: 2,
    title: "The Problem: The Talent Ecosystem is Fragmented",
    subtitle: "Students, Companies, and Universities operate in disconnected silos",
    category: "The Problem",
    bullets: [
      "For Students & Professionals: Don't know industry demand, skill gaps hidden, certificates don't prove actual ability, generic job spam.",
      "For Companies: Resumes don't reflect true capability, screening large pools is noisy & slow, rapid skill obsolescence.",
      "For Universities: Curriculum lags 3-5 years behind industry realities, missing visibility into emergent labor market shifts."
    ],
    interactiveAction: "viewProblemMatrix"
  },
  {
    number: 3,
    title: "Our Vision: One Intelligent Ecosystem for Talent",
    subtitle: "PEOPLE ↔ SKILLS ↔ JOBS ↔ LEARNING ↔ NETWORK ↔ INDUSTRY DEMAND",
    category: "Vision",
    bullets: [
      "Help talent: Understand capabilities, verify skills, discover career pathways, bridge gaps, connect meaningfully.",
      "Help organizations: Discover verified talent, assess objectively, forecast skill demand, plan workforce reskilling.",
      "Help universities: Benchmark curriculum with real-time labor market telemetry."
    ],
    interactiveAction: "viewVision"
  },
  {
    number: 4,
    title: "Our Solution: TalentX",
    subtitle: "A dynamic skill-based professional identity instead of a static PDF resume",
    category: "Solution",
    bullets: [
      "Professional Networking + Verified Skills + AI Career Intelligence",
      "Skill Gap Analysis + Learning Recommendations + Smart Recruitment + Workforce Intelligence",
      "Evidence-backed credentials replacing unverified keyword stuffing."
    ],
    interactiveAction: "openProfile"
  },
  {
    number: 5,
    title: "How TalentX Works",
    subtitle: "Tri-party stakeholder synergy powered by an AI Intelligence Engine",
    category: "Architecture",
    bullets: [
      "Job Seeker: Dynamic Profile, Resume AI, Skill Tests, Career Simulator",
      "Employer: Job Post AI, Assessment Criteria, Candidate Match AI, Pipeline",
      "University: Curriculum Analysis, Skill Gap Radar, Industry Demand Telemetry",
      "Unified by the TalentX Intelligence Engine & Industry Data Layer"
    ],
    interactiveAction: "openSkillGraph"
  },
  {
    number: 6,
    title: "Intelligent Professional Profile",
    subtitle: "More Than a Resume — A Living Professional Identity",
    category: "Talent Feature",
    bullets: [
      "Dynamic data: Education, Experience, Projects, Certifications, Verified Skill Badges, Hackathons, Portfolio.",
      "AI Resume Parser: Instant extraction of skills, roles, projects with human review & sync.",
      "Continuous verification updates as candidates build and test."
    ],
    interactiveAction: "openResumeParser"
  },
  {
    number: 7,
    title: "Skill Intelligence: Know What the Industry Needs",
    subtitle: "Continuous mapping of Skills → Roles → Jobs → Industries",
    category: "Intelligence",
    bullets: [
      "Real-time identification of most demanded skills, emerging spikes, and declining tech.",
      "Role-specific skill combinations (e.g. Data Scientist = Python + SQL + Stats + ML + Pandas + Cloud).",
      "Location and industry-specific market compensation benchmarks."
    ],
    interactiveAction: "openMarketAnalytics"
  },
  {
    number: 8,
    title: "Skill Verification: Don't Just Claim a Skill. Prove It.",
    subtitle: "Transforming 'Python listed on resume' into 'Python Verified 88/100'",
    category: "Verification",
    bullets: [
      "Claim Skill → Take Code/Scenario Assessment → Evaluate Performance → Generate Skill Level → Issue Cryptographic Badge.",
      "Verified Skill Badges: Beginner, Intermediate, Advanced with verifiable credential ID.",
      "Eliminates resume fraud and gives recruiters instant hiring confidence."
    ],
    interactiveAction: "openSkillVerification"
  },
  {
    number: 9,
    title: "AI Career Intelligence: 'What Career Fits Me?'",
    subtitle: "Explainable multi-dimensional recommendation engine",
    category: "Career AI",
    bullets: [
      "Analyzes current skills, verified test percentiles, projects, and market demand.",
      "Transparent 'Why Recommended' explainability cards.",
      "Discovers high-compatibility adjacent roles (e.g., Python + SQL + Stats ➔ Data Scientist / Data Analyst)."
    ],
    interactiveAction: "openCareerIntelligence"
  },
  {
    number: 10,
    title: "Skill Gap Analysis: Know What You're Missing",
    subtitle: "Target Role comparison with pinpoint accuracy",
    category: "Career AI",
    bullets: [
      "Target Role: Data Scientist",
      "Current Skills: ✓ Python, ✓ SQL, ✓ Statistics, ✓ Pandas",
      "Skill Gaps: ⚠ Machine Learning, ⚠ Deep Learning, ⚠ MLOps, ⚠ Model Deployment",
      "Converts identified gaps directly into an actionable learning roadmap."
    ],
    interactiveAction: "openSkillGap"
  },
  {
    number: 11,
    title: "Personalized Career Roadmap: From Gap → Action",
    subtitle: "Guided step-by-step milestones to career readiness",
    category: "Career AI",
    bullets: [
      "Step 1: Current Level (Python + SQL) ➔ Step 2: Learn Machine Learning.",
      "Step 3: Build Real-World ML Projects ➔ Step 4: Take ML Assessment.",
      "Step 5: Verify Skill Badge ➔ Step 6: Apply for Matched Data Science Roles.",
      "Tracks real-time readiness progression as milestones are completed."
    ],
    interactiveAction: "openRoadmap"
  },
  {
    number: 12,
    title: "Career Simulator: 'What If I Learn This Skill?'",
    subtitle: "Interactive decision-support sandbox for career pivots",
    category: "Simulator",
    bullets: [
      "Select hypothetical skills: 'What if I learn MLOps or Cloud Computing?'",
      "Platform instantly recalculates: Match score jump (65% ➔ 92%), new unlocked roles, and salary compensation bump (+38%).",
      "Empowers users to prioritize high-ROI learning investments."
    ],
    interactiveAction: "openSimulator"
  },
  {
    number: 13,
    title: "Professional Networking: LinkedIn-Like, With Intelligence",
    subtitle: "Not just 'People You May Know', but 'People You Should Meet'",
    category: "Networking",
    bullets: [
      "Intelligent match reasons: Complementary skills, mutual hackathon goals, verified peer mentors.",
      "Interactive social feed: Project launches, skill badge achievements, research discussions.",
      "Real-time messaging, connections, and community groups."
    ],
    interactiveAction: "openNetwork"
  },
  {
    number: 14,
    title: "Project & Collaboration Hub: Learn by Building",
    subtitle: "Complementary skill team formation for hackathons & startups",
    category: "Collaboration",
    bullets: [
      "Showcase projects with live demos, tech stacks, and GitHub repositories.",
      "AI Team Builder: AI Developer + UI/UX Designer + Backend Dev + Data Analyst.",
      "One-click collaboration requests for national hackathons like Build for Bharat 2.0."
    ],
    interactiveAction: "openProjects"
  },
  {
    number: 15,
    title: "Smart Opportunities: Jobs + Internships + Hackathons",
    subtitle: "Personalized AI matching instead of generic job boards",
    category: "Opportunities",
    bullets: [
      "Jobs, Internships, Hackathons, Competitions, Workshops, Company Challenges.",
      "Dynamic AI Match Score (e.g. 89% Match) with transparent skill breakdowns.",
      "Fast-track applications for TalentX Verified candidates."
    ],
    interactiveAction: "openOpportunities"
  },
  {
    number: 16,
    title: "Intelligent Recruitment: From Resume Screening to Skill Hiring",
    subtitle: "Streamlined end-to-end employer recruitment workflow",
    category: "Recruitment",
    bullets: [
      "Create Job ➔ AI extracts Required Skills ➔ Set Criteria ➔ Candidate Matching.",
      "Online Assessment ➔ Coding / Skill Test ➔ Candidate Analytics ➔ Shortlist ➔ Hire.",
      "Reduces recruiter screening time by up to 70%."
    ],
    interactiveAction: "openEmployer"
  },
  {
    number: 17,
    title: "Company-Specific Assessment: Configurable Standards",
    subtitle: "Every company defines its own talent bar",
    category: "Recruitment",
    bullets: [
      "Configurable thresholds: Required skills, minimum proficiency tier (Beginner/Intermediate/Advanced).",
      "Cutoff criteria: Aptitude ≥ 60%, Coding ≥ 70%, Graduation year filters.",
      "Automated filtering based on verified assessment scores."
    ],
    interactiveAction: "openEmployer"
  },
  {
    number: 18,
    title: "Explainable Candidate Matching: Not Just '87% Match'",
    subtitle: "Transparent evidence-backed evaluation",
    category: "Recruitment",
    bullets: [
      "Matched Skills: Python ✓, SQL ✓, Pandas ✓, Machine Learning ✓.",
      "Skill Gap: Cloud Computing.",
      "Assessment: Python: 88%, SQL: 82%, Coding: 84%.",
      "Eliminates black-box AI bias and provides clear justification for hiring decisions."
    ],
    interactiveAction: "openEmployer"
  },
  {
    number: 19,
    title: "Workforce Intelligence: Plan Your Future Workforce",
    subtitle: "Current Workforce Skills vs Future Project Requirements",
    category: "Enterprise",
    bullets: [
      "Heatmaps comparing current organizational capabilities against future 2-year demand.",
      "Actionable decision framework: Hire vs Reskill vs Upskill.",
      "Identifies enterprise vulnerabilities before project delivery is compromised."
    ],
    interactiveAction: "openWorkforce"
  },
  {
    number: 20,
    title: "University Intelligence: Connect Education with Industry",
    subtitle: "Curriculum Skills vs Real-time Industry Demand",
    category: "Academia",
    bullets: [
      "Continuous gap analysis between academic syllabus and live employer job requirements.",
      "Alerts on outdated or missing subjects (e.g. MLOps, Cloud Native, GenAI).",
      "Equips institutions to maximize student graduate employability."
    ],
    interactiveAction: "openUniversity"
  },
  {
    number: 21,
    title: "Skill Graph: The Intelligence Layer Behind TalentX",
    subtitle: "The connected knowledge graph powering all recommendations",
    category: "Graph Engine",
    bullets: [
      "Multi-entity connected graph: People ↔ Skills ↔ Roles ↔ Jobs ↔ Companies ↔ Projects.",
      "Graph embeddings capturing deep semantic relationships between competencies and roles.",
      "Enables multi-hop talent discovery and career trajectory modeling."
    ],
    interactiveAction: "openSkillGraph"
  },
  {
    number: 22,
    title: "AI Intelligence Engine: The Brain of TalentX",
    subtitle: "Data Pipeline & Natural Language Processing Architecture",
    category: "Technology",
    bullets: [
      "Public & Organization Data ➔ NLP & Token Extraction ➔ Skill Normalization.",
      "Sentence Transformers & Vector Embeddings ➔ Recommendation & Scoring Engine.",
      "Tech stack: Python, Scikit-learn, FastAPI, React, Plotly, LLM APIs."
    ],
    interactiveAction: "openSkillGraph"
  },
  {
    number: 23,
    title: "Data & Analytics: Data-Driven, Not Just a Chatbot",
    subtitle: "Descriptive → Diagnostic → Predictive → Prescriptive Analytics",
    category: "Analytics",
    bullets: [
      "Grounded in verified labor market datasets, public job taxonomies, and user assessment metrics.",
      "Actionable recommendations instead of conversational fluff.",
      "Ethical, legal, and privacy-first data handling standards."
    ],
    interactiveAction: "openMarketAnalytics"
  },
  {
    number: 24,
    title: "Complete User Journey: A Continuous Growth Loop",
    subtitle: "From Sign Up to Lifelong Upskilling",
    category: "User Journey",
    bullets: [
      "Sign Up ➔ Build Profile ➔ Upload Resume ➔ AI Skill Extraction ➔ Verify Skills.",
      "Explore Careers ➔ Identify Gaps ➔ Follow Roadmap ➔ Build Projects ➔ Connect.",
      "Discover Opportunities ➔ Take Assessments ➔ Match with Employers ➔ Grow ➔ Repeat ↺."
    ],
    interactiveAction: "openRoadmap"
  },
  {
    number: 25,
    title: "Core Ecosystem: One Platform, Multiple Stakeholders",
    subtitle: "A balanced three-sided marketplace",
    category: "Ecosystem",
    bullets: [
      "Job Seekers: Profile, Skill Verification, Career Intelligence, Roadmap, Networking.",
      "Employers: Talent Discovery, Recruitment, Assessments, Workforce Planning.",
      "Universities: Curriculum Intelligence, Skill Gap Telemetry, Employability Index."
    ],
    interactiveAction: "explorePlatform"
  },
  {
    number: 26,
    title: "What Makes TalentX Different?",
    subtitle: "Beyond single-purpose legacy portals",
    category: "Differentiation",
    bullets: [
      "LinkedIn: Only networking (unverified claims).",
      "Unstop: Opportunities only.",
      "Traditional Job Boards: PDF resume spam & black-box filtering.",
      "TalentX: Integrates Verified Skills + Career AI + Networking + Recruitment + Workforce Intelligence in one unified loop."
    ],
    interactiveAction: "openProfile"
  },
  {
    number: 27,
    title: "MVP for Hackathon: What We Built",
    subtitle: "High-impact execution across all 4 core phases",
    category: "Hackathon MVP",
    bullets: [
      "Phase 1 (Core): Profile, Resume Upload & AI Parsing, Skill Verification, Career AI, Gap Analysis.",
      "Phase 2 (Recruitment): Employer Dashboard, Assessment Config, Explainable Matcher, Pipeline.",
      "Phase 3 (Network): Social Feed, AI-suggested connections, Project & Hackathon Hub.",
      "Phase 4 (Intelligence): Skill Demand Dashboard, Career Simulator, Interactive Skill Graph, Workforce Planning."
    ],
    interactiveAction: "explorePlatform"
  },
  {
    number: 28,
    title: "Expected Impact: Measurable Value Across Bharat",
    subtitle: "Empowering millions of students and thousands of companies",
    category: "Impact",
    bullets: [
      "For Students: Evidence-based verification, targeted learning, 3x faster hiring match.",
      "For Companies: 70% reduction in screening overhead, elimination of resume embellishment.",
      "For Universities: Actionable curriculum upgrades keeping Indian talent globally competitive."
    ],
    interactiveAction: "openMarketAnalytics"
  },
  {
    number: 29,
    title: "Future Scope: Scaling the Intelligence Ecosystem",
    subtitle: "Long-term vision for national talent infrastructure",
    category: "Roadmap",
    bullets: [
      "AI Career Coach with adaptive interview preparation.",
      "Nationwide labor demand forecasting & regional talent heatmaps.",
      "Industry-Academia joint research credits & micro-credentials.",
      "Integration with government skilling initiatives (Skill India / Digital Bharat)."
    ],
    interactiveAction: "explorePlatform"
  },
  {
    number: 30,
    title: "TalentX: Your Skills. Your Network. Your Future.",
    subtitle: "One Intelligent Ecosystem for the Future of Talent",
    category: "Closing",
    badge: "Build for Bharat 2.0",
    bullets: [
      "LEARN → BUILD → VERIFY → CONNECT → DISCOVER → GET HIRED → GROW",
      "Transforming how talent is identified, verified, and nurtured.",
      "Ready to deploy, scale, and transform the workforce."
    ],
    interactiveAction: "explorePlatform"
  }
];
