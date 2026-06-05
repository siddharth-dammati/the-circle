const fs = require('fs');
const files = [
  'app/(dashboard)/chat/page.tsx',
  'app/(dashboard)/chat/[id]/page.tsx',
  'app/(dashboard)/dashboard/page.tsx',
  'app/(dashboard)/discover/page.tsx',
  'app/(dashboard)/events/page.tsx',
  'app/(dashboard)/layout.tsx',
  'app/(dashboard)/matches/page.tsx',
  'app/(dashboard)/profile/page.tsx',
  'app/admin/layout.tsx',
  'app/admin/page.tsx',
  'app/admin/reports/page.tsx',
  'app/admin/users/page.tsx',
  'app/api/admin/reports/[id]/route.ts',
  'app/api/admin/users/[id]/route.ts',
  'app/api/events/route.ts',
  'app/api/events/[id]/rsvp/route.ts',
  'app/api/likes/route.ts',
  'app/api/messages/route.ts',
  'app/api/notifications/route.ts',
  'app/api/profile/onboarding/route.ts',
  'app/api/profile/route.ts',
  'app/api/reports/route.ts',
  'app/api/secret-crush/route.ts'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/import \{ auth \} from "@\/lib\/auth";?/g, 'import { auth } from "@/lib/serverAuth";');
  fs.writeFileSync(f, content);
});
console.log('Done');
