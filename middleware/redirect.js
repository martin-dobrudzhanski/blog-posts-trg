import external from '@/middleware/redirects/external';
import deadRoutes from '@/middleware/redirects/deadRoutes';
import bookings from '@/middleware/redirects/bookings'

export default function({ route, redirect }) {
  const redirects = [...external, ...bookings, ...deadRoutes];

  redirects.forEach(redirectObject => {
    if (redirectObject.from && route.fullPath === redirectObject.from) {
      return redirect(redirectObject.statusCode, redirectObject.to);
    }
    if (
      redirectObject.contains &&
      route.fullPath.includes(redirectObject.contains)
    ) {
      return redirect(redirectObject.statusCode, redirectObject.to);
    }
    return false;
  });
}
