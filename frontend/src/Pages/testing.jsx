import React from "react";
import Modal from "../components/modal/modal";

const Testing = () => {
  return (
    <div>
      <div style={{ width: "fit-content" }}>
        <Modal>
          <h1>tag1</h1>
          <p>paragraph1</p>
        </Modal>
      </div>

      <hr />
      <Modal>
        <h1>tag2</h1>
        <p>paragraph2</p>
        <p>paragrap32</p>
        <p>paragrap234h2</p>
      </Modal>
      <hr />
      <Modal>No children.</Modal>
    </div>
  );
};

export default Testing;
