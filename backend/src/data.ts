export const sample_bugs: any[] = [
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
    tags: ['display', 'facebook', 'cutting off', 'view'],
  },
  {
    _id: 2,
    summary: 'Scroll does not work correctly.',
    link: 'https://www.facebook.com',
    imageUrl: 'assets/images/bug1.jpg',
    description: 'The videos are not loading correctly.',
    reproductionFindings: 'The videos are not loading for this user.',
    developmentFindings: 'We fixed the issue by... doing some stuff.',
    message:
      'Thank you for your bug report! We have worked on and fixed the issue that was reported by our development team. Let us know if there are any other issues.',
    resolved: true,
    tags: ['functionality', 'scroll', 'facebook', 'videos'],
  },
];
