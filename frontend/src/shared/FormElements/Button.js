import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "./Button.css";

const Button = (props) => {
  const button = useRef();
  const tl = useRef();
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline()
        .to(
          button.current,
          {
            rotate: 10,
            duration: 0.3,
          },
          
        )
        .to(
          button.current,
          {
            rotate: -10,
            duration: 0.3,
          },
          
        ).to(
          button.current,
          {
            rotate: 0,
            duration: 0.3,
          },
          
        );
    });
  });

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
      ref={button}
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
