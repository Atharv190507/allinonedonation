import { BloodRequest } from '@/types';

export const bloodRequests: BloodRequest[] = [
  {
    id: '1',
    bloodGroup: 'A+',
    hospital: 'City General Hospital',
    urgency: 'high',
    location: 'New York, NY',
    contactNumber: '(555) 123-4567',
    date: '2023-06-15',
    status: 'open',
  },
  {
    id: '2',
    bloodGroup: 'O-',
    hospital: 'Memorial Medical Center',
    urgency: 'high',
    location: 'Los Angeles, CA',
    contactNumber: '(555) 987-6543',
    date: '2023-06-14',
    status: 'open',
  },
  {
    id: '3',
    bloodGroup: 'B+',
    hospital: 'University Hospital',
    urgency: 'medium',
    location: 'Chicago, IL',
    contactNumber: '(555) 456-7890',
    date: '2023-06-18',
    status: 'open',
  },
  {
    id: '4',
    bloodGroup: 'AB+',
    hospital: "St. Mary's Medical Center",
    urgency: 'low',
    location: 'Houston, TX',
    contactNumber: '(555) 234-5678',
    date: '2023-06-20',
    status: 'open',
  },
  {
    id: '5',
    bloodGroup: 'A-',
    hospital: 'Mercy Hospital',
    urgency: 'medium',
    location: 'Philadelphia, PA',
    contactNumber: '(555) 345-6789',
    date: '2023-06-17',
    status: 'open',
  },
];