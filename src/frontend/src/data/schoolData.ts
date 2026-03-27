export interface Teacher {
  id: number;
  name: string;
  subject: string;
  faculty: string;
  experience: string;
  education: string;
  email: string;
  photo: string;
  bio: string;
}

export interface Notice {
  id: number;
  title: string;
  date: string;
  isNew: boolean;
  category: "Academic" | "Sports" | "Event" | "Exam" | "Holiday";
}

export interface SubjectResult {
  subject: string;
  maxMarks: number;
  obtainedMarks: number;
}

export interface StudentResult {
  name: string;
  cls: string;
  section: string;
  rollNo: string;
  subjects: SubjectResult[];
}

const photos = [
  "/assets/generated/teacher-male-1.dim_300x300.jpg",
  "/assets/generated/teacher-female-1.dim_300x300.jpg",
  "/assets/generated/teacher-male-2.dim_300x300.jpg",
  "/assets/generated/teacher-female-2.dim_300x300.jpg",
];

export const teachers: Teacher[] = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    subject: "Mathematics",
    faculty: "Science & Math",
    experience: "18 years",
    education: "Ph.D. Mathematics, IIT Delhi",
    email: "r.kumar@brightfuture.edu",
    photo: photos[0],
    bio: "Dr. Rajesh Kumar is a distinguished mathematician who has guided hundreds of students to excel in competitive exams including JEE and NEET.",
  },
  {
    id: 2,
    name: "Mrs. Priya Sharma",
    subject: "English Literature",
    faculty: "Languages",
    experience: "14 years",
    education: "M.A. English, Delhi University",
    email: "p.sharma@brightfuture.edu",
    photo: photos[1],
    bio: "Mrs. Priya Sharma brings literature to life with her engaging storytelling approach and innovative teaching methods.",
  },
  {
    id: 3,
    name: "Mr. Arjun Singh",
    subject: "Physics",
    faculty: "Science & Math",
    experience: "12 years",
    education: "M.Sc. Physics, IIT Bombay",
    email: "a.singh@brightfuture.edu",
    photo: photos[2],
    bio: "Mr. Arjun Singh uses real-world experiments and demonstrations to make Physics accessible and exciting for all students.",
  },
  {
    id: 4,
    name: "Ms. Kavya Nair",
    subject: "Chemistry",
    faculty: "Science & Math",
    experience: "10 years",
    education: "M.Sc. Chemistry, BITS Pilani",
    email: "k.nair@brightfuture.edu",
    photo: photos[3],
    bio: "Ms. Kavya Nair's laboratory-focused teaching approach has produced numerous state-level science olympiad winners.",
  },
  {
    id: 5,
    name: "Mr. Suresh Patel",
    subject: "History",
    faculty: "Social Studies",
    experience: "20 years",
    education: "M.A. History, BHU Varanasi",
    email: "s.patel@brightfuture.edu",
    photo: photos[0],
    bio: "Mr. Suresh Patel's passion for history and storytelling captivates students, making complex historical events memorable and meaningful.",
  },
  {
    id: 6,
    name: "Mrs. Anita Verma",
    subject: "Geography",
    faculty: "Social Studies",
    experience: "15 years",
    education: "M.A. Geography, Jadavpur University",
    email: "a.verma@brightfuture.edu",
    photo: photos[1],
    bio: "Mrs. Anita Verma integrates digital mapping tools and field trips to create immersive geography learning experiences.",
  },
  {
    id: 7,
    name: "Mr. Vikram Joshi",
    subject: "Computer Science",
    faculty: "Technology",
    experience: "9 years",
    education: "B.Tech CS, NIT Trichy",
    email: "v.joshi@brightfuture.edu",
    photo: photos[2],
    bio: "Mr. Vikram Joshi is a tech enthusiast who mentors students in coding competitions and robotics clubs.",
  },
  {
    id: 8,
    name: "Ms. Deepika Reddy",
    subject: "Biology",
    faculty: "Science & Math",
    experience: "11 years",
    education: "M.Sc. Biotechnology, Hyderabad University",
    email: "d.reddy@brightfuture.edu",
    photo: photos[3],
    bio: "Ms. Deepika Reddy's research background in biotechnology gives students a cutting-edge perspective on life sciences.",
  },
  {
    id: 9,
    name: "Dr. Mohan Das",
    subject: "Hindi",
    faculty: "Languages",
    experience: "22 years",
    education: "Ph.D. Hindi Literature, Allahabad University",
    email: "m.das@brightfuture.edu",
    photo: photos[0],
    bio: "Dr. Mohan Das is an acclaimed poet who instills a deep love for Hindi literature and culture in his students.",
  },
  {
    id: 10,
    name: "Mrs. Sunita Mehta",
    subject: "Economics",
    faculty: "Commerce",
    experience: "16 years",
    education: "M.A. Economics, LSR Delhi",
    email: "s.mehta@brightfuture.edu",
    photo: photos[1],
    bio: "Mrs. Sunita Mehta brings economic concepts to life with case studies drawn from current affairs and market analysis.",
  },
  {
    id: 11,
    name: "Mr. Ravi Gupta",
    subject: "Accountancy",
    faculty: "Commerce",
    experience: "13 years",
    education: "CA, ICAI; M.Com, Mumbai University",
    email: "r.gupta@brightfuture.edu",
    photo: photos[2],
    bio: "Mr. Ravi Gupta's CA background ensures students receive industry-standard accounting knowledge preparing them for professional careers.",
  },
  {
    id: 12,
    name: "Ms. Pooja Iyer",
    subject: "Music",
    faculty: "Arts",
    experience: "8 years",
    education: "M.Mus. Carnatic, Chennai Music Academy",
    email: "p.iyer@brightfuture.edu",
    photo: photos[3],
    bio: "Ms. Pooja Iyer has trained in classical Carnatic music and inspires students to explore music as a life skill.",
  },
  {
    id: 13,
    name: "Mr. Anil Chopra",
    subject: "Physical Education",
    faculty: "Sports",
    experience: "17 years",
    education: "B.P.Ed., Sports Authority of India",
    email: "a.chopra@brightfuture.edu",
    photo: photos[0],
    bio: "Mr. Anil Chopra has coached state-level athletes in cricket, badminton, and athletics over his distinguished career.",
  },
  {
    id: 14,
    name: "Mrs. Rekha Bose",
    subject: "Art & Craft",
    faculty: "Arts",
    experience: "12 years",
    education: "MFA Fine Arts, Visva-Bharati University",
    email: "r.bose@brightfuture.edu",
    photo: photos[1],
    bio: "Mrs. Rekha Bose's artwork has been exhibited nationally, and she channels that creativity to nurture budding young artists.",
  },
  {
    id: 15,
    name: "Mr. Sandeep Rao",
    subject: "Business Studies",
    faculty: "Commerce",
    experience: "10 years",
    education: "MBA, IIM Ahmedabad",
    email: "s.rao@brightfuture.edu",
    photo: photos[2],
    bio: "Mr. Sandeep Rao brings entrepreneurial insights from his IIM background to spark business acumen in commerce students.",
  },
  {
    id: 16,
    name: "Ms. Nisha Pillai",
    subject: "Sanskrit",
    faculty: "Languages",
    experience: "19 years",
    education: "M.A. Sanskrit, BHU Varanasi",
    email: "n.pillai@brightfuture.edu",
    photo: photos[3],
    bio: "Ms. Nisha Pillai is dedicated to preserving Sanskrit traditions while making them accessible and relevant to modern students.",
  },
  {
    id: 17,
    name: "Mr. Tarun Saxena",
    subject: "Environmental Science",
    faculty: "Science & Math",
    experience: "7 years",
    education: "M.Sc. Environmental Science, JNU Delhi",
    email: "t.saxena@brightfuture.edu",
    photo: photos[0],
    bio: "Mr. Tarun Saxena conducts environmental awareness campaigns and field studies to foster ecological responsibility among students.",
  },
  {
    id: 18,
    name: "Mrs. Lalitha Krishnan",
    subject: "Mathematics",
    faculty: "Science & Math",
    experience: "21 years",
    education: "M.Sc. Applied Math, IIT Madras",
    email: "l.krishnan@brightfuture.edu",
    photo: photos[1],
    bio: "Mrs. Lalitha Krishnan's patient and systematic teaching approach has helped even the most math-anxious students achieve excellence.",
  },
  {
    id: 19,
    name: "Mr. Deepak Tiwari",
    subject: "Political Science",
    faculty: "Social Studies",
    experience: "14 years",
    education: "M.A. Political Science, JMI Delhi",
    email: "d.tiwari@brightfuture.edu",
    photo: photos[2],
    bio: "Mr. Deepak Tiwari encourages critical thinking and civic awareness through debates and Model UN activities.",
  },
  {
    id: 20,
    name: "Ms. Archana Desai",
    subject: "Psychology",
    faculty: "Social Studies",
    experience: "9 years",
    education: "M.A. Psychology, Pune University",
    email: "a.desai@brightfuture.edu",
    photo: photos[3],
    bio: "Ms. Archana Desai is also the school counselor, combining psychology teaching with genuine student wellbeing support.",
  },
  {
    id: 21,
    name: "Mr. Harish Malhotra",
    subject: "French",
    faculty: "Languages",
    experience: "11 years",
    education: "DALF C2, Alliance Française de Paris",
    email: "h.malhotra@brightfuture.edu",
    photo: photos[0],
    bio: "Mr. Harish Malhotra studied in Paris and brings authentic French cultural immersion to his language classes.",
  },
  {
    id: 22,
    name: "Mrs. Sheela Thomas",
    subject: "Home Science",
    faculty: "Vocational",
    experience: "16 years",
    education: "M.Sc. Home Science, Kerala Agricultural University",
    email: "s.thomas@brightfuture.edu",
    photo: photos[1],
    bio: "Mrs. Sheela Thomas integrates nutrition, design, and management into her holistic Home Science curriculum.",
  },
];

export const notices: Notice[] = [
  {
    id: 1,
    title:
      "Annual Sports Day – March 15, 2026 | All students must report by 8:00 AM",
    date: "Mar 10, 2026",
    isNew: true,
    category: "Sports",
  },
  {
    id: 2,
    title: "Class XII Board Practical Examinations Schedule Released",
    date: "Mar 8, 2026",
    isNew: true,
    category: "Exam",
  },
  {
    id: 3,
    title:
      "Parent-Teacher Meeting scheduled for March 22 – Attendance Mandatory",
    date: "Mar 6, 2026",
    isNew: true,
    category: "Academic",
  },
  {
    id: 4,
    title: "Holi Celebration – School closed on March 14, 2026",
    date: "Mar 4, 2026",
    isNew: false,
    category: "Holiday",
  },
  {
    id: 5,
    title: "Science Exhibition 2026 – Registrations open until March 12",
    date: "Mar 1, 2026",
    isNew: false,
    category: "Event",
  },
  {
    id: 6,
    title: "Mid-Term Results for Classes VI–X will be distributed on March 18",
    date: "Feb 27, 2026",
    isNew: false,
    category: "Academic",
  },
  {
    id: 7,
    title: "Inter-School Debate Competition – Bright Future wins 1st place!",
    date: "Feb 24, 2026",
    isNew: false,
    category: "Event",
  },
  {
    id: 8,
    title: "Summer Camp 2026 Registrations Now Open – Limited Seats Available",
    date: "Feb 20, 2026",
    isNew: false,
    category: "Event",
  },
];

export const studentResults: Record<string, StudentResult> = {
  "rahul sharma-10-a": {
    name: "Rahul Sharma",
    cls: "10",
    section: "A",
    rollNo: "10A-021",
    subjects: [
      { subject: "Mathematics", maxMarks: 100, obtainedMarks: 92 },
      { subject: "Science", maxMarks: 100, obtainedMarks: 87 },
      { subject: "English", maxMarks: 100, obtainedMarks: 79 },
      { subject: "Hindi", maxMarks: 100, obtainedMarks: 83 },
      { subject: "Social Studies", maxMarks: 100, obtainedMarks: 76 },
    ],
  },
  "priya nair-10-b": {
    name: "Priya Nair",
    cls: "10",
    section: "B",
    rollNo: "10B-007",
    subjects: [
      { subject: "Mathematics", maxMarks: 100, obtainedMarks: 98 },
      { subject: "Science", maxMarks: 100, obtainedMarks: 95 },
      { subject: "English", maxMarks: 100, obtainedMarks: 91 },
      { subject: "Hindi", maxMarks: 100, obtainedMarks: 88 },
      { subject: "Social Studies", maxMarks: 100, obtainedMarks: 89 },
    ],
  },
  "amit kumar-9-a": {
    name: "Amit Kumar",
    cls: "9",
    section: "A",
    rollNo: "9A-014",
    subjects: [
      { subject: "Mathematics", maxMarks: 100, obtainedMarks: 58 },
      { subject: "Science", maxMarks: 100, obtainedMarks: 62 },
      { subject: "English", maxMarks: 100, obtainedMarks: 70 },
      { subject: "Hindi", maxMarks: 100, obtainedMarks: 74 },
      { subject: "Social Studies", maxMarks: 100, obtainedMarks: 55 },
    ],
  },
  "sneha patel-12-c": {
    name: "Sneha Patel",
    cls: "12",
    section: "C",
    rollNo: "12C-003",
    subjects: [
      { subject: "Physics", maxMarks: 100, obtainedMarks: 89 },
      { subject: "Chemistry", maxMarks: 100, obtainedMarks: 84 },
      { subject: "Mathematics", maxMarks: 100, obtainedMarks: 91 },
      { subject: "English", maxMarks: 100, obtainedMarks: 78 },
      { subject: "Computer Science", maxMarks: 100, obtainedMarks: 96 },
    ],
  },
  "ravi verma-8-d": {
    name: "Ravi Verma",
    cls: "8",
    section: "D",
    rollNo: "8D-031",
    subjects: [
      { subject: "Mathematics", maxMarks: 100, obtainedMarks: 40 },
      { subject: "Science", maxMarks: 100, obtainedMarks: 35 },
      { subject: "English", maxMarks: 100, obtainedMarks: 48 },
      { subject: "Hindi", maxMarks: 100, obtainedMarks: 52 },
      { subject: "Social Studies", maxMarks: 100, obtainedMarks: 44 },
    ],
  },
};
