import { Event, NewsArticle, TeamMember, VolunteerOpportunity, Testimonial, FAQItem, Donation, CommunityPost, Achievement, User, VolunteerLog, Notification, Report, Partner, JobOpening } from './types';

export const ACHIEVEMENTS_DATA: Achievement[] = [
  { id: 'first_donation', name: 'Founding Supporter', description: 'Made one of the very first donations to help launch our cause.', icon: '💖' },
  { id: 'generous_giver', name: 'Generous Giver', description: 'Donated over KES 10,000 to kickstart our mission.', icon: '💰' },
  { id: 'community_voice', name: 'Founding Member', description: 'Made your first post in our new community forum.', icon: '📣' },
  { id: 'event_goer', name: 'First Attendee', description: 'Attended our inaugural community event.', icon: '🎉' },
  { id: 'monthly_supporter', name: 'Pillar of Support', description: 'Became one of our first recurring monthly donors.', icon: '🗓️' },
];

export const MOCK_NOTIFICATIONS_DATA: Notification[] = [
    {
        id: 'notif-1',
        message: "Welcome to FOTY! We're so excited to have you join us from the very beginning.",
        type: 'announcement',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        read: false,
        link: '/dashboard'
    },
    {
        id: 'notif-2',
        message: "Our 'Inaugural Community Meet & Greet' is being planned! Details coming soon.",
        type: 'event',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false,
        link: '/events'
    },
     {
        id: 'notif-3',
        message: 'Aisha Juma posted a welcome message in the community forum.',
        type: 'community',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        read: true,
        link: '/community'
    },
];

export const ADMIN_ANALYTICS_DATA = [
  { month: 'Jan', donations: 0, volunteers: 0 },
  { month: 'Feb', donations: 0, volunteers: 0 },
  { month: 'Mar', donations: 0, volunteers: 0 },
  { month: 'Apr', donations: 0, volunteers: 0 },
  { month: 'May', donations: 0, volunteers: 0 },
  { month: 'Jun', donations: 5000, volunteers: 2 }, // Data for the first week
];

export const MOCK_USERS_DATA: User[] = [
    {
        id: 'user-1',
        name: 'Community Member',
        email: 'member@foty.org',
        phone: '0712 345 678',
        role: 'member',
        achievements: [],
        profilePicture: `https://picsum.photos/seed/user1/200`,
        totalDonations: 0,
        volunteerHours: 0,
    },
    {
        id: 'user-2',
        name: 'Admin User',
        email: 'admin@foty.org',
        phone: '0787 654 321',
        role: 'admin',
        achievements: [],
        profilePicture: `https://picsum.photos/seed/user2/200`,
        totalDonations: 5000,
        volunteerHours: 2,
    },
    {
        id: 'user-3',
        name: 'John Omondi',
        email: 'john.o@example.com',
        phone: '0722 111 222',
        role: 'member',
        achievements: [],
        profilePicture: `https://picsum.photos/seed/user3/200`,
        totalDonations: 0,
        volunteerHours: 0,
    },
    {
        id: 'user-4',
        name: 'Maryanne Njeri',
        email: 'maryanne.n@example.com',
        phone: '0733 444 555',
        role: 'member',
        achievements: [],
        profilePicture: `https://picsum.photos/seed/user4/200`,
        totalDonations: 0,
        volunteerHours: 0,
    },
];

export const VOLUNTEER_LOG_DATA: VolunteerLog[] = [];

export const EVENTS_DATA: Event[] = [
  {
    id: 1,
    title: 'Our Inaugural Community Meet & Greet',
    date: 'August 15, 2024',
    location: 'Nairobi (Venue TBD)',
    description: 'Join the founding members, team, and early supporters of FOTY for our very first community event! This is a chance to learn about our vision, share your ideas, and become part of our story from day one.',
    image: 'https://picsum.photos/seed/event1/800/600',
    attendees: 0,
    content: 'As a newly launched organization, our first step is to build our community. The Inaugural Meet & Greet is more than just an event; it\'s the official start of our journey together. We invite you to come and meet the team, hear directly about our mission to empower the youth of Kenya, and find out how you can get involved as a volunteer, donor, or advocate. There will be opportunities for discussion, networking, and celebrating the beginning of something special. Your presence will mark a historic moment for FOTY. Let\'s build the future, together.'
  },
];

export const NEWS_DATA: NewsArticle[] = [
  {
    id: 1,
    title: 'Friends of the Youth (FOTY) Has Officially Launched!',
    excerpt: 'A new chapter begins for youth empowerment in Kenya. FOTY is born with a mission to provide education, health, and shelter.',
    image: 'https://picsum.photos/seed/news1/800/600',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    category: 'Announcement',
    content: 'We are thrilled to announce the official launch of Friends of the Youth (FOTY), a non-profit organization dedicated to empowering the youth of Kenya. Founded on the belief that every young person deserves the opportunity to succeed, FOTY will focus on three core pillars: providing access to quality education, ensuring vital healthcare services, and creating safe shelter for those in need.\nOur journey is just beginning, and our mission is ambitious. We aim to build a strong, transparent, and impactful organization from the ground up. We are calling on community members, corporate partners, and passionate individuals to join us as founding supporters. Together, we can build a brighter future and create lasting change for generations to come. Explore our website to learn more about our vision and how you can be a part of this foundational story.'
  },
];

export const TEAM_DATA: TeamMember[] = [
  { id: 1, name: 'Aisha Juma', title: 'Founder & Executive Director', bio: 'Aisha founded FOTY with a vision to create lasting change for the youth in her community. Her leadership and passion are the driving forces behind our mission.', image: 'https://picsum.photos/seed/team1/200/200' },
  { id: 2, name: 'David Mwangi', title: 'Program Director', bio: 'David is responsible for designing and implementing our educational, healthcare, and shelter programs to ensure they are effective and impactful from day one.', image: 'https://picsum.photos/seed/team2/200/200' },
  { id: 3, name: 'Fatima Ali', title: 'Head of Community Outreach', bio: 'Fatima is focused on building our foundational relationships with local communities, partners, and our very first volunteers.', image: 'https://picsum.photos/seed/team3/200/200' },
  { id: 4, name: 'Samuel Kariuki', title: 'Finance & Operations Manager', bio: 'Samuel is committed to establishing transparent and efficient financial systems to maximize the impact of every donation we receive.', image: 'https://picsum.photos/seed/team4/200/200' },
];

export const TESTIMONIALS_DATA: Testimonial[] = [];

export const FAQ_DATA: FAQItem[] = [
    { id: 1, question: "How can I donate?", answer: "As a new organization, your early support is crucial. You can donate through our website's 'Donate' page. We currently accept one-time donations via M-Pesa and are working to set up more options soon." },
    { id: 2, question: "What percentage of my donation will go to programs?", answer: "We are committed to the highest standards of transparency and efficiency. Our pledge is to ensure that a minimum of 85% of every donation goes directly to our programs. The remaining 15% will cover essential administrative and fundraising costs to help us grow." },
    { id: 3, question: "How can I volunteer?", answer: "We are actively looking for founding volunteers! We have various opportunities, from helping shape our programs to assisting with our first community outreach events. Please visit our 'Volunteer' page to see how you can get involved." },
    { id: 4, question: "Is my donation tax-deductible?", answer: "Yes, Friends of the Youth (FOTY) is a registered NGO in Kenya. Your donations are tax-deductible to the extent allowed by law. You will receive a receipt for your contribution." },
];

export const VOLUNTEER_OPPORTUNITIES: VolunteerOpportunity[] = [
    { id: 1, title: "Founding Program Volunteer", description: "Help us shape our core programs. We need passionate individuals to contribute ideas and help with planning for our first educational and health initiatives.", commitment: "Flexible, 2-5 hours per week", skills: ["Creativity", "Planning", "Community Knowledge"] },
    { id: 2, title: "Community Outreach Assistant", description: "Be the face of FOTY in the community. Help us spread the word about our mission and recruit other supporters and volunteers for our launch phase.", commitment: "3-4 hours per week", skills: ["Communication", "Networking", "Enthusiasm"] },
    { id: 3, title: "Social Media Ambassador", description: "Help us build our online presence from scratch. Share our story, create content, and engage with our growing community on social media platforms.", commitment: "2-3 hours per week", skills: ["Social Media Savvy", "Content Creation", "Communication"] },
    { id: 4, title: "Fundraising Committee Member", description: "Join our founding fundraising team to help plan and execute our first campaigns to secure the seed funding needed for our programs.", commitment: "4-6 hours per month", skills: ["Fundraising", "Event Planning", "Networking"] },
];


export const DONATIONS_DATA: Donation[] = [];

export const COMMUNITY_POSTS_DATA: CommunityPost[] = [
    { id: 1, author: 'Aisha Juma', authorImage: 'https://picsum.photos/seed/team1/200/200', timestamp: '1 day ago', content: 'Welcome everyone to the official community forum for Friends of the Youth! We are so excited to begin this journey with all of you. Let\'s build something amazing together! 🙏' },
    { id: 2, author: 'David Mwangi', authorImage: 'https://picsum.photos/seed/team2/200/200', timestamp: '2 days ago', content: 'Our team is hard at work designing our first set of programs. We want to hear from you! What are the most pressing needs for youth in your community? Share your thoughts below! #DayOne #CommunityBuilding' },
];

export const COMMUNITY_ACHIEVEMENTS_DATA = [
    { userName: 'John Omondi', achievement: ACHIEVEMENTS_DATA.find(a => a.id === 'community_voice')! },
];

export const REPORTS_DATA: Report[] = [];

export const PARTNERS_DATA: Partner[] = [];

export const JOBS_DATA: JobOpening[] = [
    { id: 1, title: 'Program Coordinator, Education', location: 'Nairobi', type: 'Full-time', description: 'We are seeking an experienced Program Coordinator to help build our educational initiatives from the ground up, including scholarship programs and school partnerships. The ideal candidate will have a background in education management and a passion for youth development.' },
    { id: 2, title: 'Community Outreach Officer', location: 'Mombasa (Future Opening)', type: 'Full-time', description: 'Join our future coastal team to build and maintain strong relationships with local communities. This role involves organizing events, managing volunteer activities, and being the face of FOTY in the Mombasa region.' },
    { id: 3, title: 'Grant Writer', location: 'Remote', type: 'Contract', description: 'We are looking for a skilled Grant Writer to help us secure the foundational funding for our new programs. Proven experience in writing successful grant proposals for non-profits is essential.' },
];
