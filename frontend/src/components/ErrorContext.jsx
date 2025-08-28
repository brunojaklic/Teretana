import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorContext
 * 
 * Kontekst koji omogućava dijeljenje informacija o greškama kroz cijelu aplikaciju.
 * Omogućava prikaz i skrivanje error poruka globalno.
 */
export const ErrorContext = createContext();

/**
 * ErrorProvider
 * 
 * Komponenta koja upravlja error stanjima aplikacije.
 * - Čuva listu trenutnih grešaka i status prikaza error modala.
 * - Omogućava funkcije za prikaz i skrivanje grešaka.
 * - Omotava child komponente kako bi im omogućila pristup ErrorContext-u.
 * 
 * @param {ReactNode} children - Djeca komponente koja trebaju pristup error kontekstu.
 */
export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [prikaziErrorModal, setPrikaziErrorModal] = useState(false);

  /**
   * prikaziError
   * 
   * Funkcija za prikazivanje error poruka.
   * - Postavlja error poruke u stanje.
   * - Otvara error modal.
   * 
   * @param {Array|string} errorsMessage - Poruka ili lista poruka koje se prikazuju.
   */
  function prikaziError(errorsMessage) {
    setErrors(errorsMessage);
    setPrikaziErrorModal(true);
  }

  /**
   * sakrijError
   * 
   * Funkcija za skrivanje error poruka.
   * - Briše trenutne error poruke.
   * - Zatvara error modal.
   */
  function sakrijError() {
    setErrors([]);
    setPrikaziErrorModal(false);
  }

  return (
    <ErrorContext.Provider
      value={{ errors, prikaziErrorModal, prikaziError, sakrijError }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

/**
 * PropTypes validacija za ErrorProvider
 * - Provjerava da su djeca komponente definirana i tipa ReactNode.
 */
ErrorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
