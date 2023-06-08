import { Bug } from './app/shared/models/bug';
import { Tag } from './app/shared/models/tag';

export const sample_bugs: Bug[] = [
  {
    _id: 1,
    summary: 'Something does not display correctly.',
    link: 'https://www.facebook.com',
    imageUrl: 'assets/images/bug1.jpg',
    description: 'The videos are not displaying correctly.',
    reproductionFindings:
      'The videos are cutting off when the user scrolls down.',
    developmentFindings: 'We fixed the issue by... doing some stuff.',
    message:
      'Thank you for your bug report! We have worked on and fixed the issue that was reported by our development team. Let us know if there are any other issues.',
    resolved: false,
  },
  {
    _id: 2,
    summary: 'Something does not working correctly.',
    link: 'https://www.facebook.com',
    imageUrl: 'assets/images/bug1.jpg',
    description: 'The videos are not loading correctly.',
    reproductionFindings: 'The videos are not loading for this user.',
    developmentFindings: 'We fixed the issue by... doing some stuff.',
    message:
      'Thank you for your bug report! We have worked on and fixed the issue that was reported by our development team. Let us know if there are any other issues.',
    resolved: true,
  },
];

export const sample_tags: Tag[] = [
  { name: 'All', count: 6 },
  { name: 'FastFood', count: 4 },
  { name: 'Pizza', count: 2 },
  { name: 'Lunch', count: 3 },
  { name: 'SlowFood', count: 2 },
  { name: 'Hamburger', count: 1 },
  { name: 'Fry', count: 1 },
  { name: 'Soup', count: 1 },
];
