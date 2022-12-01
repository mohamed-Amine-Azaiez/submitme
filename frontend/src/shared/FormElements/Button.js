import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

import "./Button.css";

const Button = (props) => {
  const boxRef = useRef();

  useLayoutEffect(() => {
    // Refs allow you to access DOM nodes
    console.log(boxRef); // { current: div.box }
    // then we can animate them like so...
    gsap.to(boxRef.current, {
      rotation: "+=360",
    });
  }, []);

  if (props.href) {
    return (
      <a
        className={`button button--${props.size || "default"} ${
          props.inverse && "button--inverse"
        } ${props.danger && "button--danger"}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`button button--${props.size || "default"} ${
          props.inverse && "button--inverse"
        } ${props.danger && "button--danger"}`}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
     ref={boxRef}
      className={`button button--${props.size || "default"} ${
        props.inverse && "button--inverse"
      } ${props.danger && "button--danger"}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
