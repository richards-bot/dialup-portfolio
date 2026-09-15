/*
 * Public site content for rdpryce.com.
 * The application and markup should not need changing for normal content updates.
 */
window.SITE_CONFIG = Object.freeze({
  features: {
    // Keep silent until the placeholder synthesis is replaced with an accurate
    // modem recording or reconstruction.
    modemAudio: false
  },

  identity: {
    name: "Richard Pryce",
    domain: "rdpryce.com",
    email: "rich@rdpryce.com",
    role: "Software developer and technical lead at The Guardian",
    location: "London",
    copyrightYear: 2026
  },

  node: {
    name: "RDPRYCE BBS",
    established: "2026",
    speed: "14.4k",
    host: "rdpryce",
    systemName: "MEDIA / SYSTEMS / TOOLS"
  },

  hero: {
    eyebrow: "RICHARD PRYCE — SOFTWARE DEVELOPER AND TECHNICAL LEAD, LONDON",
    headlineHTML: "Building systems for <em>the work behind the work.</em>",
    introduction: "I’m a software developer and technical lead at The Guardian. I build media platforms, workflow automation and practical AI tools that turn complicated production processes into dependable, usable systems."
  },

  work: [
    {
      title: "Project Launcher",
      meta: "MEDIA OPERATIONS · AUTOMATION · DESKTOP",
      description: "A desktop control plane that turns workspace setup, media collections and metadata into a repeatable publishing workflow—removing operational friction while keeping people in control."
    },
    {
      title: "Multimedia workflow modernisation",
      meta: "TECHNICAL LEADERSHIP · CLOUD MEDIA · RESILIENCE",
      description: "Designing and delivering modern media workflows for distributed teams, treating capture, remote editing, asset management, archive and recovery as one operational system rather than a chain of products."
    },
    {
      title: "Practical AI-agent tooling",
      meta: "AGENTS · AUTOMATION · LOCAL-FIRST",
      description: "Building and testing agent workflows that can research, operate tools and carry useful work through to a verified result—with human judgement at the consequential edges."
    }
  ],

  about: [
    "I work where software engineering meets media production: translating messy real-world workflows into systems that are understandable, resilient and useful. I’m most interested in tools that reduce friction without hiding how the work gets done.",
    "Before moving into software, I was a professional double bassist. It was good preparation for engineering: listen closely, know when to lead, and make the whole thing work without demanding the spotlight."
  ],

  contact: {
    note: "For engineering, media systems or practical AI work, email is the best place to start."
  },

  terminal: {
    profileUser: "sysop",
    profileName: "RICHARD PRYCE",
    shell: "/bin/optimism",
    aboutFile: [
      "software developer. technical lead. former double bassist.",
      "builds media systems, automation, and useful agent tooling.",
      "still believes the bass line should make everyone else sound better."
    ],
    projectsFile: [
      "launcher        — less setup, fewer sharp edges, calmer production.",
      "media-systems   — capture, edit, archive, recovery: one workflow.",
      "agent-tools     — useful autonomy with receipts.",
      "this-site       — 14.4k of portfolio, give or take several megabytes."
    ],
    profilePlan: [
      "build useful systems. keep production boring.",
      "make complicated work legible before trying to automate it.",
      "old files are visible to persistent callers. try ls -la."
    ],
    manifesto: [
      "Build tools that disappear into the work.",
      "Keep production boring. Keep experiments strange.",
      "Automate repetition, not responsibility.",
      "A system is not finished until somebody else can operate it."
    ]
  }
});
