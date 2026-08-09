/*
 * EDIT THIS FILE to personalise the site.
 * The application and markup should not need changing for normal content updates.
 */
window.SITE_CONFIG = Object.freeze({
  features: {
    // The synthesized handshake is intentionally disabled until an accurate
    // modem recording or reconstruction replaces the current placeholder.
    modemAudio: false
  },

  identity: {
    name: "YOUR NAME",
    domain: "YOUR-NAME.EXAMPLE",
    email: "you@example.com",
    role: "YOUR ROLE",
    location: "YOUR LOCATION",
    copyrightYear: 2026
  },

  node: {
    name: "YOUR NODE",
    established: "1996",
    speed: "14.4k",
    host: "your-node",
    systemName: "YOUR SYSTEMS"
  },

  hero: {
    eyebrow: "YOUR NAME — YOUR ROLE, YOUR LOCATION",
    headlineHTML: "A concise statement about <em>your work.</em>",
    introduction: "Replace this with two or three sentences explaining what you build, who it helps, and why the work matters."
  },

  work: [
    {
      title: "Selected project one",
      meta: "PLATFORM · SCALE · OUTCOME",
      description: "Describe the problem, your contribution, and the practical result. Keep this focused on evidence rather than responsibilities."
    },
    {
      title: "Selected project two",
      meta: "PRODUCT · TECHNOLOGY · WORKFLOW",
      description: "Explain what made the project useful, difficult, or distinctive—and how people actually experienced the result."
    },
    {
      title: "Selected experiment",
      meta: "RESEARCH · PROTOTYPE · LEARNING",
      description: "Use this space for current experiments, independent work, or the direction you want to explore next."
    }
  ],

  about: [
    "Replace this paragraph with your professional background, technical strengths, and the kind of systems or products you care about.",
    "Replace this paragraph with something personal enough to be memorable without publishing anything you would rather keep private."
  ],

  contact: {
    note: "Replace this with your preferred contact expectations."
  },

  terminal: {
    profileUser: "sysop",
    profileName: "YOUR NAME",
    shell: "/bin/optimism",
    aboutFile: [
      "YOUR NAME. Replace this file with a shorter, stranger biography",
      "than the respectable one on the modern site."
    ],
    projectsFile: [
      "project-one    — replace with a short terminal-style description.",
      "project-two    — another project, experiment, or machine.",
      "this-site      — you're soaking in it."
    ],
    profilePlan: [
      "build useful systems. keep production boring.",
      "old files are visible to persistent callers. try ls -la."
    ],
    manifesto: [
      "Build tools that disappear into the work.",
      "Keep production boring. Keep experiments strange.",
      "Replace these lines with your own operating principles."
    ]
  }
});
