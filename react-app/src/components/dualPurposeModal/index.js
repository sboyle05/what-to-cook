import React from "react";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './dualPurposeModal.css';

function DualPurposeModal() {
  return (
    <>
      <section className="dualPurposeContainer">
      <OpenModalButton
        buttonText="Log In"
        className='dpLoginButton'
        modalComponent={<LoginFormModal />}
      />
      <OpenModalButton
        buttonText="Sign Up"
        className='dpSignUpButton'
        modalComponent={<SignupFormModal />}
      />
      </section>
    </>
  );
}

export default DualPurposeModal;
