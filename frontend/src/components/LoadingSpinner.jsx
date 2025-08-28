import { Spinner } from 'react-bootstrap';
import useLoading from '../hooks/useLoading';

/**
 * LoadingSpinner
 * 
 * Komponenta koja prikazuje spinner (indikator učitavanja) dok je aplikacija u loading stanju.
 * - Koristi custom hook `useLoading` za pristup trenutnom statusu učitavanja.
 * - Prikazuje spinner samo kada je `loading` true.
 * - Spinner je omotan u overlay div koji prekriva sadržaj aplikacije.
 */
export default function LoadingSpinner() {
  const { loading } = useLoading();

  return (
    <>
      {loading && (
        <div className='loading-spinner-overlay'>
          <Spinner animation='border' role='status' variant='primary' />
        </div>
      )}
    </>
  );
}
