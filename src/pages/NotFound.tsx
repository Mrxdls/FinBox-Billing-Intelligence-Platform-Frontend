import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-page grid place-items-center py-28 text-center">
      <div>
        <p className="text-6xl font-black text-brand-400/30">404</p>
        <h1 className="mt-3 text-2xl font-bold text-white">Page not found</h1>
        <p className="mt-2 text-slate-400">That page doesn’t exist in FinBox.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Back home</Button>
        </Link>
      </div>
    </div>
  );
}
