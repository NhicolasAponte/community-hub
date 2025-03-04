export type Vendor = {
    id: number;
    name: string;
    description: string;
    services: string[];
    email: string;
    phone: string;
    address: string;
    website: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    facebook: string;
  }

  export type Event = {
    id: number;
    name: string;
    date: string;
    time: string;
    location: string;
    description: string;
    website: string;
    image: string;
  }

  export type BlogPost = {
    id: number;
    title: string;
    content: string;
    date: string;
  }

  export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
  }