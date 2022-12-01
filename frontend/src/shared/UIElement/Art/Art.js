import React from "react";
import "./Art.css";
import womanImg from "../../../assets/img/woman.png";
import whiteRibbnoImg from "../../../assets/img/white-ribbon.png";

function Art() {
  return (
    <div className="art">
      <div className="art-title">
        <img className="white-ribbon" src={whiteRibbnoImg} alt="" />
        <h5> Title goes here</h5>
      </div>
      <img className="woman-img" src={womanImg} alt="test" />
      <p className="art-descp">Disc goes here</p>
    </div>
  );
}

export default Art;
