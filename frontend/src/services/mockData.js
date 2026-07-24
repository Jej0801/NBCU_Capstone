import { faker } from '@faker-js/faker';

// Seed for consistent data
faker.seed(123);

// Growth Resources Mock Data - With actual NBCU URLs
export const growthResourcesData = [
  {
    id: "mta",
    title: "Media Tech Program",
    image: "/assets/mta.png",
    url: "https://nbcuni.sharepoint.com/sites/Media-Tech-Program/SitePages/Home.aspx",
    description: "Accelerate your career in media technology with hands-on projects and mentorship. The Media Tech Program is NBCUniversal's flagship technical development initiative.",
    participants: 234,
    completionRate: 87,
    duration: "12 weeks",
    nextCohort: "August 15, 2026",
    topics: ["Streaming Technology", "Content Delivery", "Media Analytics", "Cloud Infrastructure"],
    instructors: [
      { name: faker.person.fullName(), role: "Senior Engineer" },
      { name: faker.person.fullName(), role: "Tech Lead" },
    ],
    testimonials: [
      {
        author: faker.person.fullName(),
        role: "Graduate, MTA 2025",
        text: "This program transformed my understanding of media technology and opened doors to incredible opportunities.",
      },
    ],
  },
  {
    id: "cameo",
    title: "Cameo",
    image: "/assets/cameo.png",
    url: "https://nbcuni.sharepoint.com/sites/OTGrowthEngine/SitePages/Cameo.aspx",
    description: "Connect with industry leaders and get personalized career advice from NBCU executives. Cameo provides one-on-one mentorship opportunities with senior leaders across the organization.",
    totalMentors: 156,
    activeSessions: 89,
    avgRating: 4.8,
    categories: ["Career Growth", "Technical Skills", "Leadership", "Work-Life Balance"],
    featuredMentors: [
      { name: faker.person.fullName(), title: "VP of Engineering", availability: "3 slots this week" },
      { name: faker.person.fullName(), title: "Director of Product", availability: "2 slots this week" },
      { name: faker.person.fullName(), title: "Senior Tech Lead", availability: "5 slots this week" },
    ],
    upcomingSessions: 12,
  },
  {
    id: "ld",
    title: "Learning and Development Calendar",
    image: "/assets/ld.jpg",
    url: "https://nbcuni.sharepoint.com/sites/OTGrowthEngine/SitePages/Learning-&-Development-Calendar.aspx",
    description: "Explore hundreds of courses, workshops, and training sessions to advance your skills. From technical certifications to leadership development, find everything you need to grow.",
    totalCourses: 342,
    thisMonthEvents: 28,
    popularTopics: ["Leadership", "Technical Skills", "Data Science", "Communication", "Project Management"],
    upcomingHighlights: [
      {
        title: "Advanced Python for Data Analysis",
        date: "July 25, 2026",
        time: "2:00 PM - 4:00 PM",
        instructor: faker.person.fullName(),
        seatsLeft: 8,
      },
      {
        title: "Effective Leadership Communication",
        date: "July 28, 2026",
        time: "10:00 AM - 12:00 PM",
        instructor: faker.person.fullName(),
        seatsLeft: 15,
      },
      {
        title: "Cloud Architecture Fundamentals",
        date: "August 2, 2026",
        time: "1:00 PM - 5:00 PM",
        instructor: faker.person.fullName(),
        seatsLeft: 5,
      },
    ],
    certifications: ["AWS", "Azure", "Google Cloud", "PMP", "Scrum Master"],
  },
  {
    id: "feedback",
    title: "myFeedback",
    image: "/assets/feedback.avif",
    url: "https://www.nbcunow.com/career-tools/myfeedback",
    description: "Give and receive continuous feedback to drive your professional growth. myFeedback makes it easy to provide constructive feedback, track your development, and achieve your goals.",
    feedbackGiven: 1247,
    feedbackReceived: 982,
    avgResponseTime: "24 hours",
    features: ["360° Reviews", "Peer Feedback", "Manager Check-ins", "Goal Tracking", "Development Plans"],
    recentFeedback: [
      {
        type: "positive",
        from: "Team Lead",
        snippet: "Exceptional problem-solving on the streaming optimization project...",
        date: "2 days ago",
      },
      {
        type: "constructive",
        from: "Peer",
        snippet: "Consider more proactive communication during sprint planning...",
        date: "5 days ago",
      },
    ],
    upcomingReviews: [
      { type: "Mid-Year Review", dueDate: "August 15, 2026", status: "pending" },
      { type: "Project Retrospective", dueDate: "July 30, 2026", status: "in-progress" },
    ],
  },
];

// Enhanced Events Data - Exact events from specification
export const eventsData = {
  2: {
    title: "Upskill with Excel Series",
    type: "recommend",
    time: "2:00 PM - 3:30 PM",
    location: "Virtual - Teams",
    description: "Join us for an intensive Excel training series designed to elevate your data analysis and spreadsheet skills.",
    attendees: 145,
    organizer: faker.person.fullName(),
    agenda: ["Advanced Formulas", "Pivot Tables", "Data Visualization", "Macros Basics"],
    topics: ["Excel Functions", "Data Analysis", "Charts & Graphs", "Automation"],
    materials: ["Excel Workbook", "Cheat Sheet", "Practice Files"],
    rsvpStatus: null,
  },
  6: {
    title: "Leading Inclusive Meetings",
    type: "useful",
    time: "10:00 AM - 11:30 AM",
    location: "30 Rock, Conference Room B",
    description: "Learn best practices for facilitating inclusive meetings where all voices are heard and valued.",
    attendees: 85,
    organizer: faker.person.fullName(),
    facilitator: faker.person.fullName(),
    topics: ["Inclusive Facilitation", "Active Listening", "Meeting Design", "Psychological Safety"],
    materials: ["Meeting Facilitation Guide", "Inclusion Checklist"],
    rsvpStatus: null,
  },
  9: {
    title: "Lab Kit: Effective Pitching",
    type: "useful",
    time: "1:00 PM - 3:00 PM",
    location: "TalentLab Studio",
    description: "Master the art of pitching ideas effectively with hands-on practice and expert feedback.",
    attendees: 65,
    organizer: faker.person.fullName(),
    facilitator: faker.person.fullName(),
    activities: ["Pitch Structure Workshop", "Practice Sessions", "Peer Feedback", "Expert Review"],
    materials: ["Pitch Template", "Storytelling Framework", "Visual Aid Guidelines"],
    rsvpStatus: null,
  },
  14: {
    title: "Performance Feedback",
    type: "useful",
    time: "3:00 PM - 4:30 PM",
    location: "Virtual - Zoom",
    description: "Interactive session on delivering and receiving constructive performance feedback.",
    attendees: 120,
    organizer: faker.person.fullName(),
    facilitator: faker.person.fullName(),
    topics: ["Feedback Models", "Difficult Conversations", "Growth Mindset", "Action Plans"],
    materials: ["Feedback Template", "Conversation Guide", "Self-Reflection Worksheet"],
    rsvpStatus: null,
  },
  22: {
    title: "The Innovation Stage",
    type: "recommend",
    time: "9:00 AM - 5:00 PM",
    location: "Universal Studios - Innovation Lab",
    description: "Annual innovation showcase featuring groundbreaking projects, demos, and networking opportunities.",
    attendees: 420,
    organizer: "O&T Innovation Team",
    activities: ["Project Demos", "Tech Talks", "Networking Lunch", "Awards Ceremony"],
    projects: 32,
    awards: ["Most Innovative", "Best Impact", "People's Choice", "Future Vision"],
    prizes: ["$10,000 Grand Prize", "$5,000 Runner-up", "$2,500 Third Place"],
    rsvpStatus: null,
  },
  24: {
    title: "Rapid Ideation",
    type: "useful",
    time: "2:00 PM - 3:30 PM",
    location: "Virtual - Teams",
    description: "Fast-paced workshop on generating creative ideas quickly using proven ideation techniques.",
    attendees: 95,
    organizer: faker.person.fullName(),
    facilitator: faker.person.fullName(),
    activities: ["Brainstorming Techniques", "Mind Mapping", "Rapid Prototyping", "Idea Selection"],
    topics: ["Design Thinking", "Creative Problem Solving", "Collaboration Methods"],
    materials: ["Ideation Toolkit", "Templates & Frameworks", "Case Studies"],
    rsvpStatus: null,
  },
  30: {
    title: "Lab Kit: Peer to Manager",
    type: "useful",
    time: "11:00 AM - 1:00 PM",
    location: "TalentLab Studio",
    description: "Essential skills and strategies for successfully transitioning from peer to manager role.",
    attendees: 78,
    organizer: faker.person.fullName(),
    facilitator: faker.person.fullName(),
    topics: ["Leadership Transition", "Team Dynamics", "Difficult Conversations", "Building Trust"],
    activities: ["Role-Playing Scenarios", "Group Discussion", "Action Planning"],
    materials: ["Transition Guide", "Leadership Playbook", "30-60-90 Day Plan Template"],
    rsvpStatus: null,
  },
};

// Communities Mock Data
export const communitiesData = [
  {
    id: "ypn",
    title: "YPN",
    fullName: "Young Professionals Network",
    image: "/assets/ypn.jpeg",
    description: "Connect with early-career professionals across NBCU for networking, mentorship, and career development.",
    members: 847,
    founded: "2018",
    nextEvent: {
      title: "YPN Summer Social & Networking",
      date: "August 5, 2026",
      attendees: 120,
    },
    initiatives: [
      "Monthly Networking Events",
      "Mentorship Program",
      "Professional Development Workshops",
      "Social Activities",
    ],
    leadership: [
      { name: faker.person.fullName(), role: "President" },
      { name: faker.person.fullName(), role: "VP of Events" },
      { name: faker.person.fullName(), role: "VP of Membership" },
    ],
    recentPosts: [
      {
        author: faker.person.fullName(),
        title: "How I Transitioned from Marketing to Product Management",
        likes: 45,
        date: "3 days ago",
      },
      {
        author: faker.person.fullName(),
        title: "YPN Book Club: July Selection Announced",
        likes: 28,
        date: "1 week ago",
      },
    ],
    memberBenefits: ["Exclusive Events", "Career Resources", "Networking Opportunities", "Leadership Training"],
  },
  {
    id: "techwomen",
    title: "TECHWomen",
    fullName: "Women in Technology",
    image: "/assets/techwomen.jpeg",
    description: "Empowering women in technology through community, advocacy, and professional development.",
    members: 623,
    founded: "2015",
    nextEvent: {
      title: "Women in Tech Leadership Panel",
      date: "July 29, 2026",
      attendees: 180,
    },
    initiatives: [
      "Leadership Development",
      "Technical Skills Workshops",
      "Mentorship Circles",
      "Speaker Series",
      "Advocacy & Inclusion",
    ],
    leadership: [
      { name: faker.person.fullName(), role: "Executive Sponsor" },
      { name: faker.person.fullName(), role: "Community Lead" },
      { name: faker.person.fullName(), role: "Events Coordinator" },
    ],
    achievements: [
      "40% increase in women in senior tech roles since 2020",
      "Launched scholarship program for women in STEM",
      "Recognized as Top ERG 2025",
    ],
    programs: {
      mentorship: "1-on-1 and group mentoring with senior leaders",
      workshops: "Monthly technical and leadership workshops",
      scholarship: "$50,000 annual scholarship fund",
    },
  },
  {
    id: "talentlab",
    title: "talentlab",
    fullName: "Talent Development Lab",
    image: "/assets/talentlab.jpeg",
    description: "Experimental learning programs and innovative approaches to skill development and career growth.",
    members: 412,
    founded: "2020",
    nextEvent: {
      title: "Design Thinking Workshop",
      date: "August 8, 2026",
      attendees: 45,
    },
    programs: [
      "Innovation Bootcamp",
      "Design Thinking Labs",
      "Rapid Prototyping Sessions",
      "Cross-Functional Projects",
      "Emerging Tech Exploration",
    ],
    stats: {
      projectsLaunched: 67,
      participantSatisfaction: "96%",
      skillsLearned: "200+",
      partnerships: 15,
    },
    currentInitiatives: [
      {
        name: "AI/ML Fundamentals Cohort",
        participants: 30,
        duration: "8 weeks",
        startDate: "August 12, 2026",
      },
      {
        name: "Product Management Accelerator",
        participants: 25,
        duration: "10 weeks",
        startDate: "July 22, 2026",
      },
    ],
    alumni: [
      {
        name: faker.person.fullName(),
        quote: "TalentLab gave me hands-on experience with AI that transformed my career path.",
        role: "ML Engineer",
      },
    ],
    resources: ["Learning Materials", "Project Templates", "Expert Network", "Lab Space Access"],
  },
];

// Generate random users for various features
export const generateMockUsers = (count) => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    role: faker.person.jobTitle(),
    department: faker.helpers.arrayElement(['Engineering', 'Product', 'Design', 'Data', 'Operations']),
    avatar: faker.image.avatar(),
    email: faker.internet.email(),
  }));
};

// Generate mock notifications
export const generateNotifications = () => {
  return [
    {
      id: 1,
      type: 'event',
      title: 'New event RSVP confirmed',
      message: 'You are registered for O&T All Hands on July 2',
      timestamp: new Date(2026, 6, 23, 10, 30),
      read: false,
    },
    {
      id: 2,
      type: 'feedback',
      title: 'Feedback received',
      message: 'You received new feedback from your team lead',
      timestamp: new Date(2026, 6, 21, 14, 15),
      read: false,
    },
    {
      id: 3,
      type: 'community',
      title: 'New TECHWomen event',
      message: 'Women in Tech Leadership Panel on July 29',
      timestamp: new Date(2026, 6, 20, 9, 0),
      read: true,
    },
  ];
};

// Toast messages for user actions
export const toastMessages = {
  rsvpSuccess: (eventName) => `Successfully RSVP'd to ${eventName}!`,
  rsvpCancel: (eventName) => `RSVP cancelled for ${eventName}`,
  joinCommunity: (communityName) => `You've joined ${communityName}!`,
  enrollProgram: (programName) => `Enrolled in ${programName}`,
  error: 'Something went wrong. Please try again.',
};
