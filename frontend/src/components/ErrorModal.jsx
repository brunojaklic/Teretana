import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * ErrorModal
 * 
 * Komponenta koja prikazuje modal s error porukama.
 * - Prikazuje naslov "Ups!" i listu error poruka.
 * - Omogućava zatvaranje modala putem gumba ili X u headeru.
 * 
 * @param {Object} props
 * @param {boolean} props.show - Kontrolira je li modal vidljiv.
 * @param {function} props.onHide - Funkcija koja se poziva pri zatvaranju modala.
 * @param {Array|string} props.errors - Lista ili poruka greške koja se prikazuje u modalu.
 */
export default function ErrorModal({ show, onHide, errors }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Ups!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {errors}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Zatvori
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/**
 * PropTypes validacija za ErrorModal
 * - Provjerava tipove props-a i osigurava da su obavezni props-i definirani.
 */
ErrorModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  errors: PropTypes.array,
};
