import { Link } from 'react-router-dom';
export default function RouteError() {
  return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
    <div role="alert"><h1>This page could not load.</h1><p>Please reload the page or return to the homepage.</p><div style={{ display: 'flex', gap: 16, marginTop: 24 }}><button className="btn btn--primary" onClick={() => window.location.reload()}>Reload page</button><Link className="btn btn--secondary" to="/">Return home</Link></div></div>
  </main>;
}
