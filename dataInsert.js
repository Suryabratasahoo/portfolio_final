import dotenv from 'dotenv';
dotenv.config();

import connectDB from './lib/connectDb.js';
import Timeline from './models/timeline.js';
import Stats from './models/stats.js';
import Education from './models/education.js';
import Certification from './models/certification.js';
import Experience from './models/experience.js';
import NowItem from "./models/NowItem.js"



const dummyDataTimelines = [
      {
        id: "1",
        icon: "Target",
        title: "Launch Personal Blog",
        description:
          "Create and launch a technical blog focusing on web development tutorials and case studies from my projects.",
        timeframe: "January 2024",
        status: "planning",
        category: "Content Creation",
        details:
          "The blog will feature weekly articles on React, Next.js, and modern web development techniques. I'll share code snippets, performance optimization tips, and lessons learned from real-world projects.",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        id: "2",
        icon: "Award",
        title: "AWS Solutions Architect Certification",
        description:
          "Complete the AWS Solutions Architect Professional certification to enhance cloud architecture skills.",
        timeframe: "March 2024",
        status: "in-progress",
        category: "Professional Development",
        details:
          "Currently studying 2 hours daily following a structured curriculum. The certification will help me design more scalable and cost-effective cloud solutions for my projects and clients.",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
      {
        id: "3",
        icon: "Briefcase",
        title: "Launch Freelance Collective",
        description:
          "Establish a collective of freelance developers and designers to take on larger, more complex projects.",
        timeframe: "June 2024",
        status: "planning",
        category: "Business",
        details:
          "The collective will bring together 5-7 specialists across frontend, backend, design, and project management. We'll focus on helping startups and mid-sized businesses with complete digital transformations.",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
      },
      {
        id: "4",
        icon: "GraduationCap",
        title: "Complete AI/ML Specialization",
        description:
          "Finish the Stanford Machine Learning specialization to integrate AI capabilities into web projects.",
        timeframe: "August 2024",
        status: "not-started",
        category: "Education",
        details:
          "The specialization covers fundamental ML algorithms, neural networks, and practical applications. I plan to use these skills to build more intelligent web applications with features like content recommendation and user behavior prediction.",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        id: "5",
        icon: "Globe",
        title: "Speak at Web Development Conference",
        description: "Present a talk on modern frontend architecture at a major web development conference.",
        timeframe: "October 2024",
        status: "planning",
        category: "Public Speaking",
        details:
          "I'm preparing a presentation on micro-frontend architecture and performance optimization techniques. This will be my first major speaking engagement, with the goal of establishing myself as a thought leader in the space.",
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
      },
      {
        id: "6",
        icon: "Rocket",
        title: "Launch SaaS Product",
        description: "Develop and launch a SaaS product focused on helping freelancers manage their business operations.",
        timeframe: "December 2024",
        status: "not-started",
        category: "Product Development",
        details:
          "The product will include features for time tracking, invoicing, client management, and project planning. I'm currently in the market research phase, with development planned to start in July 2024.",
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
      },
    ];

const dummyDataStats=[
  {
      id: 1,
      icon: "Clock",
      value: 5,
      suffix: "+",
      label: "Years Experience",
      color: "blue",
    },
    {
      id: 2,
      icon: "Code",
      value: 48,
      suffix: "",
      label: "Projects Completed",
      color: "purple",
    },
    {
      id: 3,
      icon: "Users",
      value: 32,
      suffix: "",
      label: "Happy Clients",
      color: "green",
    },
    {
      id: 4,
      icon: "Award",
      value: 12,
      suffix: "",
      label: "Awards Received",
      color: "amber",
    },
]


const dummyDataCertifications = [
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    order: 1
  },
  {
    name: "Certified Kubernetes Administrator (CKA)",
    issuer: "Cloud Native Computing Foundation",
    date: "2022",
    order: 2
  },
  {
    name: "Microsoft Certified: Azure Developer Associate",
    issuer: "Microsoft",
    date: "2022",
    order: 3
  },
  {
    name: "Google Professional Cloud Architect",
    issuer: "Google Cloud",
    date: "2021",
    order: 4
  },
  {
    name: "Certified Scrum Master (CSM)",
    issuer: "Scrum Alliance",
    date: "2020",
    order: 5
  }
];

const dummyDataEducation = [
  {
    degree: "Master of Computer Science",
    institution: "Stanford University",
    period: "2018 - 2020",
    description: "Specialized in Artificial Intelligence and Machine Learning with focus on natural language processing and computer vision applications.",
    order: 1
  },
  {
    degree: "Bachelor of Science in Computer Engineering",
    institution: "Massachusetts Institute of Technology",
    period: "2014 - 2018",
    description: "Graduated with honors. Completed coursework in algorithms, data structures, computer architecture, and software engineering.",
    order: 2
  },
  {
    degree: "Full Stack Web Development Bootcamp",
    institution: "App Academy",
    period: "2013",
    description: "Intensive 12-week program covering modern web development frameworks, JavaScript, React, Node.js, and database design.",
    order: 3
  }
];
const dummyDataNow=[
  {
      order: 1,
      icon: "Code",
      title: "Building",
      description: "Working on a new e-commerce platform with React, Next.js, and Tailwind CSS.",
      color: "blue",
      link: "#",
      status: "In Progress",
      progress: 65,
    },
    {
      order: 2,
      icon: "BookOpen",
      title: "Learning",
      description: "Diving deep into WebGL and Three.js for creating immersive 3D web experiences.",
      color: "purple",
      link: "#",
      status: "Ongoing",
      progress: 40,
    },
    {
      order: 3,
      icon: "Briefcase",
      title: "Freelancing",
      description: "Taking on select client projects focused on modern web applications.",
      color: "amber",
      link: "#",
      status: "Active",
      progress: 80,
    },
    {
      order: 4,
      icon: "Coffee",
      title: "Writing",
      description: "Publishing a series of articles about frontend development best practices.",
      color: "green",
      link: "#",
      status: "New",
      progress: 25,
    },
    {
      order: 5,
      icon: "Music",
      title: "Creating",
      description: "Producing a podcast about tech careers and the future of web development.",
      color: "pink",
      link: "#",
      status: "Planning",
      progress: 15,
    }
]

const dummyDataExperience=[
  {
      order: 1,
      role: "frontend developer",
      company: "Appe Nexus",
      period: "Dec,2024 - Present",
      description:
        "Lead the frontend development team in building and maintaining multiple web applications. Implemented new features and optimized performance.",
    },
    {
      order: 2,
      role: "Technical Team Member",
      company: "Team Next Nexus",
      period: "sept,2024 - present",
      description:
        "Developed responsive web applications using React and Next.js. Collaborated with designers and backend developers to implement new features.",
    },
    {
      order: 3,
      role: "Technical Team Member",
      company: "Computer Society of India(CSI)",
      period: "oct,2023 - feb,2024",
      description:
        "Assisted in the development of web applications. Learned modern web development practices and tools.",
    },
]


const insertData = async () => {
  try {
    await connectDB();
    await NowItem.insertMany(dummyDataNow);
    console.log('✅ Data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting data:', error);
    process.exit(1);
  }
};

insertData();