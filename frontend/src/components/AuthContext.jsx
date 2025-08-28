import { createContext, useEffect, useState } from 'react';
import { logInService } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import useLoading from '../hooks/useLoading';

/**
 * AuthContext
 * 
 * Kontekst koji omogućava dijeljenje podataka o autentifikaciji
 * (status prijave, token, funkcije login i logout) kroz cijelu aplikaciju.
 */
export const AuthContext = createContext();

/**
 * AuthProvider
 * 
 * Komponenta koja upravlja autentifikacijom korisnika.
 * - Čuva podatke o prijavi (isLoggedIn, authToken).
 * - Omogućava funkcije login i logout.
 * - Automatski provjerava postoji li token u localStorage prilikom mountanja.
 * - Omotava child komponente kako bi im omogućila pristup AuthContext-u.
 * 
 * @param {ReactNode} children - Djeca komponente koja trebaju pristup autentifikaciji.
 */
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const { showLoading, hideLoading } = useLoading();

  const navigate = useNavigate();

  /**
   * useEffect
   * 
   * Efekt koji se izvršava prilikom prvog učitavanja komponente.
   * Provjerava postoji li spremljeni Bearer token u localStorage.
   * Ako postoji -> korisnik je prijavljen.
   * Ako ne postoji -> korisnik se preusmjerava na početnu stranicu.
   */
  useEffect(() => {
    const token = localStorage.getItem('Bearer');

    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    } else {
      navigate(RouteNames.HOME);
    }
  }, []);

  /**
   * login
   * 
   * Funkcija za prijavu korisnika.
   * - Poziva AuthService logInService s korisničkim podacima.
   * - Ako je prijava uspješna -> sprema token, ažurira stanje i preusmjerava na nadzornu ploču.
   * - Ako prijava nije uspješna -> prikazuje grešku, briše token i vraća korisnika na početnu stranicu.
   * 
   * @param {Object} userData - Podaci za prijavu (korisničko ime, lozinka).
   */
  async function login(userData) {
    showLoading();
    const odgovor = await logInService(userData);
    hideLoading();
    if (!odgovor.greska) {
      localStorage.setItem('Bearer', odgovor.poruka);
      setAuthToken(odgovor.poruka);
      setIsLoggedIn(true);
      navigate(RouteNames.NADZORNA_PLOCA);
    } else {
      prikaziError(odgovor.poruka);
      localStorage.setItem('Bearer', '');
      setAuthToken('');
      setIsLoggedIn(false);
    }
  }

  /**
   * logout
   * 
   * Funkcija za odjavu korisnika.
   * - Briše token iz localStorage.
   * - Resetira stanje prijave.
   * - Preusmjerava korisnika na početnu stranicu.
   */
  function logout() {
    localStorage.setItem('Bearer', '');
    setAuthToken('');
    setIsLoggedIn(false);
    navigate(RouteNames.HOME);
  }

  const value = {
    isLoggedIn,
    authToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
