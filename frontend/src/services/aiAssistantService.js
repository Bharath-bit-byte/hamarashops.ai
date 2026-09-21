/**
 * HamaraShops.ai - Advanced NLP Assistant Engine
 * Synchronized with the 4 Backend Microservices:
 * 1. API Gateway (Spring Cloud Gateway WebFlux, Port 8080)
 * 2. Business Service (Industries & Careers, Port 8082)
 * 3. Content Service (Catalog, Partners, Metrics, Testimonials, Port 8081)
 * 4. Contact Service (Lead Inquiries & Resend Email Appointments, Port 8083)
 */

export const INITIAL_SUGGESTIONS = [
  '📅 Book Consultation / Meeting',
  '👔 Meet Our CEO (Dheerendar Srivastav)',
  '🎬 Watch Video Section',
  '⚡ Core AI Use Cases (Cross-Industry)',
  '📊 Platform Scale (200+ Models)',
  '🤝 Enterprise Partners (MSFT, Google)',
];

const SYSTEM_PROMPT = `You are the advanced Natural Language Processing (NLP) Assistant for HamaraShops.ai, an enterprise Generative AI platform.

Comprehensive Platform, Leadership & Capabilities Knowledge:

1. Leadership & CEO Profile:
   - Founder & Chief Executive Officer (CEO): Dheerendar Srivastav.
   - Core Vision: "HamaraShops.ai is an application player in the AI race." Championing practical, high-impact enterprise AI solutions over hype.
   - Strategic Leadership: Spearheading end-to-end AI engineering across Insurance, Financial Services, Retail, Healthcare, and Manufacturing.
   - Executive Contact: dheerendar@hamarashops.ai | contact@hamarashops.com
   - Featured prominently with an official leadership poster at /about#ceo-section.

2. Official Video Showcase:
   - Company Profile Video (Home page at /#company-video-section):
     * YouTube Embed: https://www.youtube.com/watch?v=pxaMqyFmHO0
     * Tagline: "HamaraShops.ai is an application player in the AI race." Explains platform mission, architecture, and enterprise value.
   - Our Journey Team Videos (/our-journey):
     * Gorantla Charan Ranga (Full Stack Developer): Developing HamaraShops.ai full-stack ecosystem (https://www.youtube.com/watch?v=ZNFY7UCzhbM).
     * Sadam Bharath (Backend Developer): Platform architecture & APIs (https://www.youtube.com/watch?v=D1zHyBLH3v0).
     * Akhil (Frontend Developer): 3D UI/UX design & WebGL interfaces (https://www.youtube.com/watch?v=zms_htzRvOE).
     * Bhavani (Cloud & Deployment Engineer): Google Cloud Run and deployment pipelines (https://www.youtube.com/watch?v=XskLsDyDLYw).

3. Core Enterprise AI Use Cases Across Workflows (/use-cases):
   Beyond the 5 industry verticals, HamaraShops.ai provides 6 universal Generative AI workflow capabilities:
   - Customer Service Automation: Conversational LLMs, garment fit & recipe advice, equipment fault troubleshooting, automated post-call wrap-up summaries.
   - Search & Synthesis: Deep document retrieval, natural language queries across contracts, LIBOR contract phase-outs, FDA drug indications, multi-decade archive search.
   - Personalization: 1:1 Contextual audience messaging, personalized credit card recommendations, complex fashion & grocery searches, streaming media discovery.
   - Content Generation: Studio-grade imagery with Imagen, prior authorization physician letters, clinical trial report tables and summaries.
   - AI Assistants & Concierges: Wendy's FreshAI PoS drive-thru assistance, pregnant patient hospital concierge, repo trade settlement status assistant.
   - Developer Assistance: Regulatory code translation (Basel III capital requirement math formulas), automated catalog schema mapping, API code generation.
   - 5 Common Business Challenges: Improving Customer Service, Accelerating Search & Discovery, Building Personalized Content, Developer Code Efficiency, Controlling Operating Costs.

4. Five Industry Verticals (/industries):
   - Retail: Creative assistance with Imagen, conversational shopping concierges, Wendy's FreshAI PoS drive-thru automation, customer service summaries.
   - Financial Services: Personalized 1:1 financial card recommendations, capital markets research summarization, repo trade settlement status assistant, LIBOR contract phase-out.
   - Healthcare & Life Sciences: MedPaLM automated clinical discharge notes, Vertex AI Search for FDA drug submissions and private EHR, 24/7 empathetic patient concierges.
   - Media & Entertainment: Multi-modal content generation (scripts, copy, imagery), natural language search over decades of media archives, real-time viewer recommendations.
   - Manufacturing: Predictive maintenance to eliminate downtime, CAD blueprint and schematic search, automated ERP parts reordering.

5. Enterprise Solution Architecture & Cloud Infrastructure:
   - Secure Ingress Layer: Managed API Gateway with rate-limiting, SSL termination, and high-throughput routing.
   - Industry Solutions Engine: Serving vertical AI workflows and business logic.
   - Enterprise Content & Vector Intelligence: Telemetry metrics, partner ecosystem, and semantic vector indexing.
   - Consultation & Engagement Engine: Automated consultation bookings and lead dispatching with transactional notifications.
   - Cloud Infrastructure: Deployed serverlessly on Google Cloud Run with multi-zone redundancy, low latency, and auto-scaling.

6. Verified Platform Metrics:
   - 200+ AI Models Deployed in enterprise production
   - 10K+ Real-time Predictions / Second inference throughput
   - 1PB+ Unstructured Data Points Processed
   - 80% Reduction in Manual Operational Tasks
   - 99.9% Decision Precision in cognitive processing
   - 100+ Languages Supported via multilingual NLP engines
   - 60% Reduced Risk Exposure with autonomous defensive AI

7. Strategic Partners & AI Alliances:
   - Technology Partners: Microsoft, Google Cloud, Oracle, Adobe, REDINGTON.
   - AI Research Alliances: OpenAI, Google AI, TensorFlow, PyTorch Foundation.

8. Global Offices & Contact:
   - Headquarters: 2611 Ross Ave, Dallas, TX 75201, USA
   - India Hub: Hyderabad, Telangana 500091, India
   - UK Office: 85 Harberton Road, London N19 3JT, United Kingdom
   - Contact Emails: contact@hamarashops.com, info@hamarashops.ai, dheerendar@hamarashops.ai
   - Phones: +1 (626) 924-456 (US), +91 8639551911 (India)

Formatting & Style Instructions:
- Answer with business and technical depth from an enterprise solution perspective.
- CRITICAL: NEVER mention internal development port numbers (8080, 8081, 8082, 8083) or internal Spring Boot microservice names.
- For appointment booking, offer the direct scheduling modal trigger.
- For video inquiries, reference both the Company Profile Video and the 4 Team Journey Videos.
- For CEO inquiries, highlight Dheerendar Srivastav's vision, leadership role, and contact email.
- For use cases, highlight both the 6 universal core capabilities and the 5 industry verticals.`;

// Exact & high-confidence domain intent map for instant concierge responses
const DOMAIN_CONCIERGE_MAP = [
  {
    id: 'greetings',
    exactKeywords: ['hi', 'hello', 'hey', 'greetings', 'who are you', 'what are you', 'help', 'start', 'good morning', 'good afternoon', 'good evening'],
    response: {
      text: `Hello! 👋 I am the **HamaraShops.ai Advanced NLP Assistant**.\n\nI am here to help you explore our enterprise Generative AI platform and solutions:\n\n• 📅 **Schedule Consultations**: Book instant engineering appointments\n• 👔 **Leadership & CEO**: Meet Founder & CEO Dheerendar Srivastav\n• 🎬 **Video Showcase**: Watch our official company & team journey videos\n• ⚡ **Core AI Use Cases**: 6 cross-industry workflow capabilities\n• 🏢 **5 Industry Verticals**: Retail, Finance, Healthcare, Media, Manufacturing\n• 📊 **Platform Scale**: 200+ production AI models & 99.9% decision precision\n\nWhat would you like to explore?`,
      actions: [
        { label: '📅 Book Appointment', path: 'open-appointment' },
        { label: '⚡ Core AI Use Cases', path: '/use-cases' },
        { label: '🎬 Watch Company Video', path: '/#company-video-section' },
      ],
      suggestions: [
        '👔 Meet Our CEO (Dheerendar Srivastav)',
        '🎬 Watch Video Section',
        '⚡ Core AI Use Cases (Cross-Industry)',
        '📊 Platform Scale (200+ Models)',
      ],
    },
  },
  {
    id: 'appointment_booking',
    exactKeywords: ['appointment', 'book appointment', 'schedule appointment', 'open appointment', 'book meeting', 'schedule meeting', 'consultation', 'book consultation', 'meet with team', 'schedule', 'talk to sales', 'schedule a call'],
    response: {
      text: `📅 **Schedule an Engineering Consultation / Appointment**:\n\nYou can open our interactive scheduling modal directly from here, or connect with our solutions architects:\n\n• **Instant Booking**: Click **"Open Appointment Form"** below to pick your preferred date and time immediately.\n• **Automated Email Dispatch**: Appointments are registered with our **Contact Service** (\`/api/v1/contact/appointment\`) and generate an automated tracking receipt (\`APT-XXXXXXXX\`) powered by the **Resend Email API**.\n• **Direct Email**: contact@hamarashops.com | info@hamarashops.ai\n• **Phone Support**: +1 (626) 924-456 (US HQ) | +91 8639551911 (India Hub)\n\nWould you like to open the appointment form right now?`,
      actions: [
        { label: '📅 Open Appointment Form', path: 'open-appointment' },
        { label: '📞 Contact Portal', path: '/contact' },
        { label: '📍 View Global Offices', path: '/contact#form' },
      ],
      suggestions: ['👔 Meet Our CEO', '🎬 Watch Company Video', '⚡ Core AI Use Cases', '📊 Platform Metrics'],
    },
  },
  {
    id: 'video_section',
    exactKeywords: ['video', 'videos', 'video section', 'watch video', 'company video', 'profile video', 'team video', 'youtube', 'watch', 'journey video', 'demo video', 'watch demo'],
    response: {
      text: `🎬 **HamaraShops.ai Video Showcase & Engineering Broadcasts**:\n\nWe feature two primary video sections on our platform:\n\n1. **Official HamaraShops.ai Company Profile Video** (Home Page):\n   • **Tagline**: *"HamaraShops.ai is an application player in the AI race."*\n   • **YouTube Stream**: https://www.youtube.com/watch?v=pxaMqyFmHO0\n   • Outlines our enterprise positioning, multi-model generative architecture, and business transformation.\n\n2. **Our Journey — Team Video Series** (\`/our-journey\`):\n   • **Gorantla Charan Ranga** (*Full Stack Developer*): End-to-end platform engineering.\n   • **Sadam Bharath** (*Backend Developer*): Microservices, Spring Cloud Gateway, and APIs.\n   • **Akhil** (*Frontend Developer*): 3D Three.js visualizer & UI/UX engineering.\n   • **Bhavani** (*Cloud & Deployment Engineer*): Google Cloud Run serverless deployment.\n\nClick below to jump directly to either video section!`,
      actions: [
        { label: '🎬 Open Company Video', path: '/#company-video-section' },
        { label: '🎥 Watch Team Journey Videos', path: '/our-journey' },
        { label: '📅 Schedule Strategy Call', path: 'open-appointment' },
      ],
      suggestions: ['👔 Meet Our CEO', '⚡ Core AI Use Cases', '🏗️ 4 Microservices Architecture'],
    },
  },
  {
    id: 'ceo_details',
    exactKeywords: ['ceo', 'dheerendar', 'srivastav', 'founder', 'leadership', 'who is the ceo', 'chief executive officer', 'executive', 'director', 'who runs hamarashops', 'management', 'leader'],
    response: {
      text: `👔 **Meet Our CEO & Leadership — Dheerendar Srivastav**:\n\n• **Title**: Founder & Chief Executive Officer (CEO) of HamaraShops.ai.\n• **Strategic Vision**: *"HamaraShops.ai is an application player in the AI race."* Dheerendar has positioned the company to bridge foundational AI models (PaLM, MedPaLM, Imagen) into turnkey, scalable enterprise applications.\n• **Executive Focus**: Engineering enterprise-grade generative AI systems across Insurance, Financial Services, Retail, Healthcare, and Manufacturing.\n• **Global Reach**: Leading cross-functional engineering and consulting operations across Dallas (US), Hyderabad (India), and London (UK).\n• **Direct Inquiries**: \`dheerendar@hamarashops.ai\` | \`contact@hamarashops.com\`\n\nYou can view the full executive leadership feature and official CEO poster on our About page!`,
      actions: [
        { label: '👔 View CEO Leadership Section', path: '/about#ceo-section' },
        { label: '📅 Book Meeting with CEO/Team', path: 'open-appointment' },
        { label: '📖 About HamaraShops.ai', path: '/about' },
      ],
      suggestions: ['🎬 Watch Company Video', '⚡ Core AI Use Cases', '📊 Platform Metrics (200+ Models)'],
    },
  },
  {
    id: 'core_use_cases',
    exactKeywords: ['use cases', 'usecases', 'all use cases', 'other use cases', 'what use cases', 'capabilities', 'cross industry', 'solutions', 'customer service automation', 'search & synthesis', 'personalization', 'content generation', 'developer assistance', 'ai assistants'],
    response: {
      text: `⚡ **Core Enterprise AI Use Cases Across Workflows** (Cross-Industry):\n\nIn addition to our **5 industry verticals** (Retail, Finance, Healthcare, Media, Manufacturing), HamaraShops.ai provides **6 universal Generative AI capabilities** deployed across any business workflow:\n\n1. 🤖 **Customer Service Automation**: Conversational LLMs, automated post-call wrap-up summaries, equipment diagnostic troubleshooting, and garment fit/lifestyle advice.\n2. 🔍 **Search & Synthesis**: Natural language queries over unstructured contracts, multi-decade corporate archives, LIBOR phase-outs, and FDA drug submissions.\n3. 🎯 **1:1 Hyper-Personalization**: Real-time contextual audience messaging, customized financial card recommendations, and personalized streaming discovery.\n4. 📝 **Studio-Grade Content Generation**: High-fidelity marketing copy, Imagen product asset generation, prior authorization physician letters, and clinical trial report TOCs.\n5. ✨ **Domain-Specific AI Concierges**: Context-aware virtual agents like Wendy's FreshAI PoS drive-thru, pregnant patient hospital concierges, and repo trade facilitators.\n6. 💻 **Developer Assistance**: Regulatory code transformation (e.g. Basel III capital formulas), automated catalog schema mapping, and API code generation.\n\n**Common Business Challenges Solved**:\n• Improving Customer Service (24/7 hyper-personalized support)\n• Accelerating Search & Discovery\n• Building Studio-Grade Personalized Content\n• Improving Developer Code Efficiency\n• Controlling Operating Costs (80% manual task reduction)`,
      actions: [
        { label: '⚡ Explore All Core Use Cases', path: '/use-cases' },
        { label: '🏢 5 Industry Verticals', path: '/industries' },
        { label: '📈 View Business Value Metrics', path: '/business-value' },
      ],
      suggestions: ['Tell me about Search & Synthesis', 'Explain Wendy\'s FreshAI', 'Customer Service Automation', '📅 Book Consultation'],
    },
  },
  {
    id: 'microservices_architecture',
    exactKeywords: ['microservices', 'backend', 'architecture', 'services', 'how it works', 'cloud run', 'system architecture', 'tech stack'],
    response: {
      text: `🏗️ **HamaraShops.ai Enterprise AI Solution Architecture**:\n\nOur platform architecture is built for high availability, zero-downtime container scaling, and sub-second inference:\n\n1. **Unified Enterprise Ingress**: High-throughput gateway layer managing SSL termination, rate-limiting, and secure routing.\n2. **Industry Solutions Engine**: Powers tailored generative workflows across Retail, Finance, Healthcare, Media, and Manufacturing.\n3. **Content & Intelligence Knowledge Store**: Manages real-time platform metrics, partner integrations, and vector search indexing.\n4. **Engagement & Transaction Engine**: Automates enterprise consultations and inquiry routing with instant transactional notifications.\n\nAll services communicate asynchronously with multi-zone redundancy on **Google Cloud Run**.`,
      actions: [
        { label: 'Explore Full Architecture', path: '/architecture' },
        { label: 'API Documentation', path: '/api-docs' },
        { label: 'Connected Stack', path: '/integrations' },
      ],
      suggestions: ['📊 Platform Scale (200+ Models)', '🤝 Enterprise Partners', 'Five Industries', '📅 Book Appointment'],
    },
  },
  {
    id: 'platform_metrics',
    exactKeywords: ['metrics', 'scale', 'models deployed', 'predictions', 'accuracy', 'stats', 'numbers', 'throughput'],
    response: {
      text: `📊 **Verified HamaraShops.ai Platform Metrics** (via Content Service):\n\n• **200+ AI Models Deployed**: Managed across global enterprise production environments.\n• **10,000+ Predictions / Sec**: Real-time distributed inference throughput capability.\n• **1PB+ Data Processed**: Telemetry and unstructured document ingestion.\n• **80% Manual Task Reduction**: Operational automation across back-office workflows.\n• **99.9% Decision Precision**: Accuracy achieved in cognitive document parsing.\n• **100+ Languages Supported**: Multilingual NLP engines for global deployments.\n• **45% Business Growth**: Average growth reported by enterprise partners.`,
      actions: [
        { label: 'View Business Value', path: '/business-value' },
        { label: 'AI Architecture', path: '/architecture' },
      ],
      suggestions: ['🤝 Enterprise Partners', '🏥 Healthcare AI', '🛍️ Retail AI', '📅 Book Strategy Session'],
    },
  },
  {
    id: 'partners',
    exactKeywords: ['partners', 'microsoft', 'google cloud', 'oracle', 'adobe', 'redington', 'alliances', 'openai', 'tensorflow'],
    response: {
      text: `🤝 **Enterprise Technology Partners & AI Research Alliances** (via Content Service):\n\n**Strategic Technology Partners**:\n• **Microsoft**: Cloud infrastructure & enterprise AI integration.\n• **Google Cloud**: Google Cloud Run, Vertex AI, and GPU compute clusters.\n• **Oracle**: Enterprise database and transactional systems alliance.\n• **Adobe**: Digital experience and creative content technologies.\n• **REDINGTON**: Strategic enterprise distribution and market reach.\n\n**AI Research Alliances**:\n• **OpenAI**: Generative models and foundational agent frameworks.\n• **Google AI**: Advanced deep learning architectures.\n• **TensorFlow**: Enterprise machine learning pipelines.`,
      actions: [
        { label: 'Connected Ecosystem', path: '/integrations' },
        { label: 'About HamaraShops.ai', path: '/about' },
      ],
      suggestions: ['📊 Platform Metrics (200+ Models)', '🏗️ 4 Microservices Architecture', 'Target Industries'],
    },
  },
  {
    id: 'testimonials',
    exactKeywords: ['testimonials', 'clients', 'reviews', 'case studies', 'what customers say', 'proof'],
    response: {
      text: `💬 **Verified Enterprise Client Testimonials** (via Content Service):\n\n• **Retail Global Corp** (*Chief Operating Officer*):\n  *"Cognitive Automation reduced our operational processing tasks by 80% while maintaining 99.9% accuracy across complex workflows."*\n\n• **Fintech Innovations** (*Head of Cyber Security*):\n  *"Defensive AI provided autonomous threat neutralization that secured our financial transaction gateways with zero downtime."*\n\n• **Modern SaaS Ltd** (*VP of Engineering*):\n  *"MLOps Hub accelerated our model release velocity by 5x, enabling seamless continuous deployment for our AI algorithms."*`,
      actions: [
        { label: 'View Business Value', path: '/business-value' },
        { label: 'Explore Industries', path: '/industries' },
      ],
      suggestions: ['📊 Platform Metrics', 'Five Industries', '📅 Book Appointment'],
    },
  },
  {
    id: 'healthcare',
    exactKeywords: ['healthcare ai', 'healthcare', 'medical', 'hospital', 'patient concierge', 'medpalm', 'clinical', 'fda'],
    response: {
      text: `🏥 **Healthcare & Life Sciences Gen AI Solutions** (via Business Service):\n\n• **Clinical Assistant (MedPaLM)**: Generates automated clinical discharge notes and medical summaries, freeing clinicians from hours of paperwork.\n• **Vertex AI Search**: Natural language cross-referencing across FDA drug submissions, medical literature, and private electronic health records (EHR).\n• **Virtual Patient Concierge**: 24/7 empathetic conversational concierge for patient navigation, appointment prep, and post-discharge guidance.`,
      actions: [
        { label: 'Healthcare Vertical Details', path: '/industries/healthcare-life-sciences' },
        { label: 'AI Solution Architecture', path: '/architecture' },
      ],
      suggestions: ['How does MedPaLM integrate with EHR?', 'What about HIPAA security?', 'Schedule Healthcare Consultation'],
    },
  },
  {
    id: 'retail',
    exactKeywords: ['retail solutions', 'retail', 'shopping', 'ecommerce', 'apparel', 'sizing', 'fashion', 'freshai', 'wendys'],
    response: {
      text: `🛍️ **Retail & E-Commerce Gen AI Solutions** (via Business Service):\n\n• **Conversational Concierge**: 24/7 AI shopping assistant guiding customers from discovery to checkout.\n• **Creative Assistance with Imagen**: Studio-grade product imagery, localized marketing copy, and catalog attribution.\n• **PoS & Drive-Thru Automation**: Groundbreaking QSR solutions (e.g. Wendy's FreshAI) for frictionless automated ordering.\n• **Customer Service Summaries**: LLM-driven post-call wrap-up summaries, fit/sizing advice, and recipe recommendations.`,
      actions: [
        { label: 'Retail Vertical Details', path: '/industries/retail' },
        { label: 'View Use Cases', path: '/use-cases' },
      ],
      suggestions: ['Explain Wendy\'s FreshAI', 'How does vector catalog search work?', 'Book Retail AI Strategy Session'],
    },
  },
  {
    id: 'finance',
    exactKeywords: ['financial services', 'finance', 'banking', 'fintech', 'fraud detection', 'libor', 'trading'],
    response: {
      text: `💳 **Financial Services Gen AI Solutions** (via Business Service):\n\n• **Contract Intelligence**: Automated analysis of legacy financial contracts (such as LIBOR phase-out transitions).\n• **Fraud & Risk Scoring**: Real-time neural scoring analyzing high-volume transaction streams for suspicious patterns.\n• **Personalized Portfolios**: 1:1 financial card and product recommendations reinforcing customized "you know me" experiences.\n• **Back-Office Virtual Assistant**: Locating trade information and troubleshooting repo trade settlement statuses.`,
      actions: [
        { label: 'Financial Services Details', path: '/industries/financial-services' },
        { label: 'Business Value Metrics', path: '/business-value' },
      ],
      suggestions: ['How does real-time fraud scoring work?', 'Explain LIBOR transition automation', 'Schedule Finance AI Review'],
    },
  },
  {
    id: 'media',
    exactKeywords: ['media & entertainment', 'media', 'entertainment', 'content generation', 'streaming', 'video generation'],
    response: {
      text: `🎬 **Media & Entertainment Gen AI Solutions** (via Business Service):\n\n• **Multi-Modal Content Generation**: Rapidly produce marketing collateral, episode summaries, and social copy.\n• **Deep Archive Discovery**: Natural language search over decades of video metadata, scripts, and audio tracks.\n• **Real-Time Audience Personalization**: Contextual video and feed recommendations powered by vector embeddings.`,
      actions: [
        { label: 'Media Vertical Details', path: '/industries/media-entertainment' },
        { label: 'View Use Cases', path: '/use-cases' },
      ],
      suggestions: ['How is archive search implemented?', 'What models are used for content generation?', 'Explore Media AI Use Cases'],
    },
  },
  {
    id: 'manufacturing',
    exactKeywords: ['manufacturing ai', 'manufacturing', 'factory', 'industrial', 'predictive maintenance', 'cad blueprint'],
    response: {
      text: `⚙️ **Manufacturing & Industrial AI Solutions** (via Business Service):\n\n• **Predictive Maintenance**: Early equipment anomaly detection to eliminate costly plant downtime.\n• **Blueprint & Spec Search**: Natural language query over complex CAD specs, schematics, and operating manuals.\n• **Automated Parts Reordering**: Triggering ERP workflows when component thresholds are breached.`,
      actions: [
        { label: 'Manufacturing Details', path: '/industries/manufacturing' },
        { label: 'AI Solution Architecture', path: '/architecture' },
      ],
      suggestions: ['How are IoT fault codes analyzed?', 'Explain CAD blueprint search', 'Schedule Industrial AI Consultation'],
    },
  },
  {
    id: 'locations',
    exactKeywords: ['global offices', 'locations', 'offices', 'where are you', 'dallas', 'hyderabad', 'london', 'headquarters', 'hq'],
    response: {
      text: `📍 **Our Global Offices**:\n\n• **United States (Headquarters)**:\n  2611 Ross Ave, Dallas, TX, 75201\n• **India Operations Hub**:\n  Hyderabad, Telangana, 500091\n• **United Kingdom Office**:\n  85 Harberton Road, London, N19 3JT`,
      actions: [
        { label: 'Contact & Locations', path: '/contact' },
        { label: '📅 Book Consultation', path: 'open-appointment' },
      ],
      suggestions: ['📅 Schedule a Meeting', '👔 Meet Our CEO', '🏗️ 4 Microservices Architecture'],
    },
  },
];

/**
 * Generates dynamic follow-up suggestions based on semantic context
 */
function generateDynamicFollowUps(text, query) {
  const combined = (text + ' ' + query).toLowerCase();
  const suggestions = [];

  if (combined.includes('ceo') || combined.includes('dheerendar') || combined.includes('leader')) {
    suggestions.push('👔 View CEO Section', 'What is Dheerendar Srivastav\'s vision?', '📅 Book Meeting with CEO/Team');
  } else if (combined.includes('video') || combined.includes('youtube') || combined.includes('watch')) {
    suggestions.push('🎬 Open Company Video', '🎥 Watch Team Journey Videos', '📅 Schedule an Appointment');
  } else if (combined.includes('use case') || combined.includes('usecase') || combined.includes('workflow')) {
    suggestions.push('Tell me about Search & Synthesis', 'Explain Developer Assistance (Basel III)', 'Customer Service Automation');
  } else if (combined.includes('appoint') || combined.includes('schedule') || combined.includes('meet') || combined.includes('consult')) {
    suggestions.push('📅 Open Appointment Form', 'What hours are available?', '📍 View Global Offices');
  } else if (combined.includes('health') || combined.includes('medical') || combined.includes('medpalm')) {
    suggestions.push('How does MedPaLM integrate with EHR?', 'What about HIPAA security?', 'Schedule Healthcare Consultation');
  } else if (combined.includes('retail') || combined.includes('shop') || combined.includes('freshai')) {
    suggestions.push('Explain Wendy\'s FreshAI PoS', 'How does vector catalog search work?', 'Book Retail Strategy Session');
  } else if (combined.includes('finan') || combined.includes('bank') || combined.includes('fraud')) {
    suggestions.push('How is fraud detected in real time?', 'Explain LIBOR transition automation', 'Financial Services Architecture');
  } else if (combined.includes('manufactur') || combined.includes('factory') || combined.includes('iot')) {
    suggestions.push('How are IoT fault codes analyzed?', 'Explain CAD blueprint search', 'Schedule Industrial AI Consultation');
  } else if (combined.includes('partner') || combined.includes('microsoft') || combined.includes('google')) {
    suggestions.push('Tell me about Microsoft Partnership', 'What is the OpenAI research alliance?', 'Connected Ecosystem Stack');
  } else if (combined.includes('metric') || combined.includes('scale') || combined.includes('accuracy')) {
    suggestions.push('How is 99.9% accuracy achieved?', 'Explain the 10K+ predictions/sec throughput', 'Business ROI Metrics');
  } else if (combined.includes('microservice') || combined.includes('gateway') || combined.includes('architect')) {
    suggestions.push('Explore AI Solution Architecture', 'Platform Security Standards', 'Connected Tech Stack');
  } else {
    suggestions.push('📅 Book Consultation / Meeting', '👔 Meet Our CEO', '⚡ Core AI Use Cases (Cross-Industry)');
  }

  return suggestions;
}

/**
 * Extracts entities and generates navigation links
 */
function extractActions(text, query) {
  const combined = (text + ' ' + query).toLowerCase();
  const actions = [];

  if (combined.includes('appoint') || combined.includes('schedule') || combined.includes('meeting') || combined.includes('consultation')) {
    actions.push({ label: '📅 Open Appointment Form', path: 'open-appointment' });
  }
  if (combined.includes('ceo') || combined.includes('dheerendar') || combined.includes('founder') || combined.includes('leadership')) {
    actions.push({ label: '👔 View CEO Section', path: '/about#ceo-section' });
  }
  if (combined.includes('video') || combined.includes('youtube') || combined.includes('watch') || combined.includes('broadcast')) {
    actions.push({ label: '🎬 Open Company Video', path: '/#company-video-section' });
    actions.push({ label: '🎥 Team Journey Videos', path: '/our-journey' });
  }
  if (combined.includes('use case') || combined.includes('usecase') || combined.includes('capabilit')) {
    actions.push({ label: '⚡ Explore All Use Cases', path: '/use-cases' });
  }
  if (combined.includes('health') || combined.includes('medical') || combined.includes('medpalm')) {
    actions.push({ label: 'Healthcare AI', path: '/industries/healthcare-life-sciences' });
  }
  if (combined.includes('retail') || combined.includes('shop') || combined.includes('freshai')) {
    actions.push({ label: 'Retail AI', path: '/industries/retail' });
  }
  if (combined.includes('finan') || combined.includes('bank') || combined.includes('fraud')) {
    actions.push({ label: 'Financial Services', path: '/industries/financial-services' });
  }
  if (combined.includes('manufactur') || combined.includes('industrial') || combined.includes('maintenance')) {
    actions.push({ label: 'Manufacturing AI', path: '/industries/manufacturing' });
  }
  if (combined.includes('media') || combined.includes('entertainment')) {
    actions.push({ label: 'Media & Entertainment', path: '/industries/media-entertainment' });
  }
  if (combined.includes('partner') || combined.includes('integration') || combined.includes('connector')) {
    actions.push({ label: 'Connected Ecosystem', path: '/integrations' });
  }
  if (combined.includes('metric') || combined.includes('roi') || combined.includes('value')) {
    actions.push({ label: 'Business Value', path: '/business-value' });
  }
  if (combined.includes('architect') || combined.includes('vertex') || combined.includes('gateway') || combined.includes('microservice')) {
    actions.push({ label: 'AI Architecture', path: '/architecture' });
  }

  if (actions.length === 0) {
    actions.push({ label: '📅 Book Appointment', path: 'open-appointment' });
    actions.push({ label: '⚡ All Use Cases', path: '/use-cases' });
    actions.push({ label: '👔 Meet CEO', path: '/about#ceo-section' });
  }

  return actions.slice(0, 3);
}

/**
 * Progressive token streamer helper.
 */
async function streamTextGradually(text, onToken, signal, speedMs = 14) {
  const words = text.split(/(\s+)/);
  let accumulated = '';

  for (let i = 0; i < words.length; i++) {
    if (signal && signal.aborted) {
      break;
    }
    accumulated += words[i];
    onToken(accumulated);
    await new Promise((resolve) => setTimeout(resolve, speedMs));
  }

  return accumulated;
}

/**
 * Advanced Multi-Turn NLP Streamer.
 */
export async function streamAssistantResponse({
  userInput,
  conversationHistory = [],
  onToken,
  onComplete,
  signal,
}) {
  const query = userInput.toLowerCase().trim();

  // 1. Check Domain Concierge for high-confidence match
  for (const entry of DOMAIN_CONCIERGE_MAP) {
    const exactMatch = entry.exactKeywords.some((kw) => {
      if (query === kw) return true;
      if (query.includes(kw)) return true;
      return false;
    });

    if (exactMatch) {
      const fullText = await streamTextGradually(entry.response.text, onToken, signal, 10);
      onComplete({
        text: fullText,
        actions: entry.response.actions,
        suggestions: entry.response.suggestions,
        source: 'concierge',
      });
      return;
    }
  }

  // 2. Invoke Free Keyless Generative Engine with Multi-turn Memory
  let generativeText = null;

  try {
    const pastTurns = conversationHistory
      .slice(-8)
      .filter((m) => m.text && typeof m.text === 'string')
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      }));

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...pastTurns,
      { role: 'user', content: userInput },
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: 'openai',
        seed: 42,
      }),
      signal: signal || controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const rawText = await res.text();
      if (rawText && rawText.trim().length > 10) {
        generativeText = rawText.trim();
      }
    }
  } catch (err) {
    // Generative call timed out or was aborted
  }

  // Fallback to GET if POST returned nothing
  if (!generativeText && (!signal || !signal.aborted)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const promptText = `${SYSTEM_PROMPT}\n\nUser Question: ${userInput}\nProvide a concise, technically rich response:`;
      
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(promptText)}`, {
        signal: signal || controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const rawText = await res.text();
        if (rawText && rawText.trim().length > 10) {
          generativeText = rawText.trim();
        }
      }
    } catch (e) {
      // Fallback
    }
  }

  // If Generative Engine succeeded, stream tokens progressively
  if (generativeText) {
    const streamed = await streamTextGradually(generativeText, onToken, signal, 14);
    const actions = extractActions(streamed, userInput);
    const suggestions = generateDynamicFollowUps(streamed, userInput);

    onComplete({
      text: streamed,
      actions,
      suggestions,
      source: 'generative',
    });
    return;
  }

  // 3. Fallback to Domain Knowledge if external endpoint is offline or interrupted
  let bestEntry = null;
  let highestScore = 0;
  const userWords = query.split(/\s+/);

  for (const entry of DOMAIN_CONCIERGE_MAP) {
    let score = 0;
    for (const kw of entry.exactKeywords) {
      if (userWords.some((w) => w.length > 3 && kw.includes(w))) {
        score += 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  const fallbackText = bestEntry
    ? bestEntry.response.text
    : `I am your **HamaraShops.ai NLP Assistant**.\n\nOur platform delivers **6 core enterprise AI capabilities** across **5 key industries**:\n\n• **Leadership**: Founder & CEO **Dheerendar Srivastav** (/about#ceo-section)\n• **Video Broadcasts**: Official Company Profile Video & Team Journey series\n• **Core Capabilities**: Customer Service Automation, Search & Synthesis, 1:1 Personalization, Content Generation, AI Assistants, Developer Assistance\n• **Industries**: Retail, Financial Services, Healthcare, Media, Manufacturing\n• **Scale**: 200+ models, 10K+ predictions/sec, 99.9% accuracy\n\nWould you like to schedule an appointment or explore our use cases?`;

  const streamed = await streamTextGradually(fallbackText, onToken, signal, 10);
  const actions = extractActions(streamed, userInput);
  const suggestions = generateDynamicFollowUps(streamed, userInput);

  onComplete({
    text: streamed,
    actions: bestEntry?.response.actions || actions,
    suggestions: bestEntry?.response.suggestions || suggestions,
    source: 'concierge',
  });
}
