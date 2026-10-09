import { subDays, subHours } from 'date-fns';
import type { Notice } from '@/types';

// Posted times are relative to app start so the demo never looks stale.
const now = new Date();
const iso = (d: Date) => d.toISOString();

export const NOTICES: Notice[] = [
  {
    id: 'n1',
    category: 'exam',
    title: 'Midterm revised: OS paper moved to Fri, 16 Oct',
    source: 'Examinations Office',
    postedAt: iso(subHours(now, 2)),
    courseId: 'cs305',
    change: { wasLabel: 'Wed, 14 Oct', wasDetail: 'Exam Hall B', nowLabel: 'Fri, 16 Oct', nowDetail: '9:00 AM · Exam Hall A' },
    body:
      'The CS-305 Operating Systems midterm has been rescheduled because of the convocation on 14 October.\n\n' +
      'The paper will now be held on Friday, 16 October at 9:00 AM in Exam Hall A. Syllabus and duration (2 hours) stay the same. Bring your university ID card; entry closes 10 minutes after the start.',
  },
  {
    id: 'n2',
    category: 'room',
    title: 'CS-302 Database Systems moves to Room 204 from Monday',
    source: 'Academic Office',
    postedAt: iso(subHours(now, 5)),
    courseId: 'cs302',
    body:
      'From Monday, 12 October, CS-302 Database Systems lectures will be held in Room 204, CS Block (second floor) instead of Room 118.\n\n' +
      'The Wednesday lab stays in DB Lab 1. The change is already reflected in your timetable on the LMS.',
  },
  {
    id: 'n3',
    category: 'workshop',
    title: 'React Native & Flutter workshop on Sat, 17 Oct',
    source: 'ACM Student Chapter',
    postedAt: iso(subDays(now, 1)),
    body:
      'The ACM Student Chapter is running a hands-on workshop on building cross-platform apps with React Native and Flutter on Saturday, 17 October, 10:00 AM to 2:00 PM in Lab 3, CS Block.\n\n' +
      'Bring a laptop with Node.js installed. Seats are limited to 40; register through the ACM page on the LMS by Thursday.',
  },
  {
    id: 'n4',
    category: 'general',
    title: 'Library open till 10 PM during exam week',
    source: 'Central Library',
    postedAt: iso(subDays(now, 3)),
    body:
      'The Central Library will stay open until 10:00 PM on weekdays during midterm exam week, starting Monday, 12 October.\n\n' +
      'The silent study hall on the first floor is reserved for exam preparation. Keep your student ID with you after 6:00 PM.',
  },
  {
    id: 'n5',
    category: 'event',
    title: 'Career fair on 20 Oct in the Main Auditorium',
    source: 'Career Services',
    postedAt: iso(subDays(now, 4)),
    body:
      'Career Services is hosting the annual career fair on Tuesday, 20 October, from 10:00 AM to 4:00 PM in the Main Auditorium. Over 30 companies will be recruiting for internships and graduate roles.\n\n' +
      'Bring printed copies of your CV. A CV review desk will be open in the lobby from 9:00 AM.',
  },
  {
    id: 'n6',
    category: 'exam',
    title: 'Quiz week schedule published on the LMS',
    source: 'Examinations Office',
    postedAt: iso(subDays(now, 6)),
    body:
      'The schedule for quiz week (12–16 October) has been published on the LMS under Announcements. Each course lists its quiz date, time and room.\n\n' +
      'Report any clash to the Examinations Office within two working days so an alternative slot can be arranged.',
  },
];

export const SEED_READ_IDS = ['n3', 'n4', 'n5', 'n6'];
