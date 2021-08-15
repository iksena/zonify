import { withIronSession } from 'next-iron-session';

export default function withSession(handler) {
  return withIronSession(handler, {
    password: 'wowdgV2x7oevN08jk7GZsHLaG1jp7j5P',
    cookieName: 'zonify',
    cookieOptions: {
      secure: false,
    },
  });
}
