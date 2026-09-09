const fs = require('fs');

let content = fs.readFileSync('c:/Users/selena ashlin joe/Desktop/Fizz coder - mini project/FIZZ-CODERS/frontend/src/components/auth/PixelCollaborationVisual.jsx', 'utf-8');

// Colors
const replacements = [
  // Primary reds to Aqua
  { regex: /#FF2D3D/g, val: '#16C6D2' },
  { regex: /#FF4B55/g, val: '#39D9D5' },
  { regex: /#D81F2E/g, val: '#16C6D2' },
  { regex: /#B91C1C/g, val: '#16C6D2' },
  { regex: /#EF4444/g, val: '#39D9D5' },
  { regex: /#991B1B/g, val: '#16C6D2' },
  { regex: /rgba\(255,\s*45,\s*61/g, val: 'rgba(22, 198, 210' },

  // Dark reds (backgrounds/blocks) to light/white/aqua tints
  { regex: /#0A0001/g, val: '#EAF5F5' }, // shadows
  { regex: /#280003/g, val: '#F0FAFA' }, // left faces
  { regex: /#140002/g, val: '#E0F0F0' }, // right faces
  { regex: /#580007/g, val: '#FFFFFF' }, // top faces
  { regex: /#3D0005/g, val: '#FFFFFF' },
  { regex: /#1C0002/g, val: '#F0FAFA' },
  { regex: /#100001/g, val: '#E0F0F0' },
  
  { regex: /#1E0205/g, val: '#FFFFFF' },
  { regex: /#0E0102/g, val: '#F5FCFC' },
  { regex: /#380004/g, val: '#F0FAFA' },
  { regex: /#180002/g, val: '#E0F0F0' },
  { regex: /#6E0009/g, val: '#FFFFFF' },
  { regex: /#4A0006/g, val: '#FFFFFF' },
  { regex: /#260003/g, val: '#F0FAFA' },
  { regex: /#120001/g, val: '#E0F0F0' },
  
  { regex: /#2E0105/g, val: '#EAF5F5' },
  { regex: /#1A0204/g, val: '#EAF5F5' },
  { regex: /#2B0004/g, val: '#F5FCFC' },
  { regex: /#180103/g, val: '#FFFFFF' },
  { regex: /#300004/g, val: '#EAF5F5' },
  { regex: /#1C0104/g, val: '#FFFFFF' },
  { regex: /#340005/g, val: '#EAF5F5' },
  { regex: /#140002/g, val: '#E0F0F0' },
  
  // Also change the moon
  { regex: /#6B0007/g, val: '#EFFCFB' },
  { regex: /#2B0003/g, val: '#FFFFFF' },
  { regex: /#200003/g, val: '#FFFFFF' }, // clouds
  
  // Texts on cards were E5E5E5 or FFFFFF on dark, now need to be dark navy
  { regex: /fill="#FFFFFF"/g, val: 'fill="#10243E"' },
  { regex: /fill="#E5E5E5"/g, val: 'fill="#5F7185"' },
  { regex: /fill="#9A9A9A"/g, val: 'fill="#90A4AE"' },
  
  // Character clothing that was red
  { regex: /#8B000B/g, val: '#16C6D2' },
  
  // The dark red stroke on boardGrad
  { regex: /#2E0105/g, val: '#EAF5F5' },
  
  // Other texts
  { regex: /"anim-data-wire"/g, val: '"anim-data-wire" opacity="0.6"' },
];

replacements.forEach(r => {
  content = content.replace(r.regex, r.val);
});

// Remove feature badges completely
const badgesRegex1 = /\{\/\* Integrated Left Feature Badges \*\/\}.*?<\/div>\s*<\/div>/s;
content = content.replace(badgesRegex1, '</div>');
content = content.replace(/\{\/\* Integrated Creator Badges \*\/\}.*?<\/div>\s*<\/div>/s, '</div>');

// Remove styles for badges
content = content.replace(/\/\* Left-side Feature Badges integrated neatly \*\/.+?\.hfp-text\s*\{[^}]+\}/s, '');
content = content.replace(/\.hero-feature-badges\s*\{[^}]+\}/g, '');

fs.writeFileSync('c:/Users/selena ashlin joe/Desktop/Fizz coder - mini project/FIZZ-CODERS/frontend/src/components/auth/PixelCollaborationVisual.jsx', content, 'utf-8');
console.log('Done');
