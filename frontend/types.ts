export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or SVG path
}

export interface Notification {
  id: string;
  message: string;
  type: 'achievement' | 'event' | 'announcement' | 'community';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  achievements: Achievement[];
  // Fix: Added missing optional properties to User type
  phone?: string;
  role: string;
  profilePicture?: string;
  totalDonations?: number;
  volunteerHours?: number;
}

export interface BulletinPost {
    id: string;
    message: string;
    timestamp: string;
}

// Keep other types if they are still used by static pages
export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  // Fix: Added missing properties to Event type
  attendees: number;
  content: string;
}

export interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  image: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// Fix: Added missing type definitions
export interface NewsArticle {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    date: string;
    category: string;
    content: string;
}

export interface VolunteerOpportunity {
    id: number;
    title: string;
    description: string;
    commitment: string;
    skills: string[];
}

export interface Donation {
    id: number;
    name: string;
    amount: number;
    date: string;
    type: 'One-Time' | 'Monthly';
}

export interface CommunityPost {
    id: number;
    author: string;
    authorImage: string;
    timestamp: string;
    content: string;
}

export interface SpotlightPost {
    title: string;
    content: string;
}

export interface VolunteerLog {
  id: number;
  volunteerName: string;
  event: string;
  action: 'Checked In' | 'Completed Task' | 'Logged Hours';
  details: string;
  timestamp: string;
}

export interface Report {
  id: number;
  title: string;
  summary: string;
  year: number;
  url: string; // Direct link to a mock PDF
}

export interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  level: 'Platinum' | 'Gold' | 'Silver';
}

export interface JobOpening {
  id: number;
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
}