import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingContext
 * 
 * Kontekst koji omogućava dijeljenje informacija o stanju učitavanja kroz aplikaciju.
 * Omogućava komponentama da znaju kada se nešto učitava i kontroliraju prikaz loading indikatora.
 */
export const LoadingContext = createContext();

/**
 * LoadingProvider
 * 
 * Komponenta koja upravlja stanjem učitavanja.
 * - Čuva trenutno stanje loading-a (true/false).
 * - Omogućava funkcije showLoading i hideLoading za kontrolu loading statusa.
 * - Omotava child komponente kako bi im omogućila pristup LoadingContext-u.
 * 
 * @param {ReactNode} children - Djeca komponente koja trebaju pristup loading kontekstu.
 */
export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  /**
   * showLoading
   * 
   * Funkcija koja postavlja stanje loading-a na true.
   */
  function showLoading() {
    setLoading(true);
  }

  /**
   * hideLoading
   * 
   * Funkcija koja postavlja stanje loading-a na false.
   */
  function hideLoading() {
    setLoading(false);
  }

  const value = {
    loading,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

/**
 * PropTypes validacija za LoadingProvider
 * - Provjerava da su djeca komponente definirana i tipa ReactNode.
 */
LoadingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
