import "./Input.css";
import { useReducer, useEffect, useLayoutEffect, useRef } from "react";
import { validate } from "../../shared/util/validators";
import gsap from "gsap";
import leftWoman from "../../assets/img/left-woman.png";
import rightMan from "../../assets/img/right-man.png";
import errorLeftWoman from "../../assets/img/error-left-woman.png";
import errorRightMan from "../../assets/img/error-right-man.png";
import male from "../../assets/img/male.png";
import female from "../../assets/img/female.png";
import errorMale from "../../assets/img/error-male.png";
import errorFemale from "../../assets/img/error-female.png";
import hearLeft from "../../assets/img/heart-left.png";
import heartRight from "../../assets/img/heart-right.png";
import errorHeartLeft from "../../assets/img/error-heart-left.png";
import errorHeartRight from "../../assets/img/error-heart-right.png";
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = (props) => {
  const leftWomanRef = useRef();
  const rightManRef = useRef();
  const maleRef = useRef();
  const femaleRef = useRef();
  const heartRightRef = useRef();
  const heartLeftRef = useRef();
  const tl = useRef();
  const tl1 = useRef();
  const labelRef = useRef();
  const labelAnimation = () => {
    tl1.current = gsap.timeline().to(
      labelRef.current,
      {
        opacity: 0,
        duration: 2,
      },
      0
    );
  };
  const nameSuccess = () => {
    tl.current = gsap
      .timeline()
      .to(
        "#male-signin",
        {
          x: "182%",
          duration: 2,
        },
        0
      )
      .to(
        "#female-signin",
        {
          x: "-182%",
          duration: 2,
        },
        0
      )
      .to(
        "#name",
        {
          opacity: 0,
          duration: 0.1,
        },
        0
      )
  };

  const nameError = () => {
    tl1.current = gsap
      .timeline()
      .to(
        "#male-signin",
        {
          x: "172%",
          duration: 2,
          rotate: -20,
        },
        0
      )
      .to(
        "#female-signin",
        {
          x: "-172%",
          duration: 2,
          rotate: 20,
        },
        0
      )
      .to(
        "#name",
        {
          opacity: 0,
          duration: 1,
        },
        0
      );
  };

  const emailSuccess = () => {
    tl.current = gsap
      .timeline()
      .to(
        "#leftwoman-signin",
        {
          x: "210%",
          duration: 2,
        },
        0
      )
      .to(
        "#rightman-signin",
        {
          x: "-210%",
          duration: 2,
        },
        0
      )
      .to(
        "#email",
        {
          opacity: 0,
          duration: 0.1,
        },
        0
      );
  };

  const emailError = () => {
    tl1.current = gsap
      .timeline()
      .to(
        "#leftwoman-signin",
        {
          x: "172%",
          duration: 2,
          rotate: -20,
        },
        0
      )
      .to(
        "#rightman-signin",
        {
          x: "-172%",
          duration: 2,
          rotate: 20,
        },
        0
      )
      .to(
        "#email",
        {
          opacity: 0,
          duration: 1,
        },
        0
      );
  };

  const pwsSuccess = () => {
    tl.current = gsap
      .timeline()
      .to(
        "#heartLeft-signin",
        {
          x: "210%",
          y: "4%",
          duration: 2,
          rotate: "2%",
        },
        0
      )
      .to(
        "#heartRight-signin",
        {
          x: "-210%",
          duration: 2,
        },
        0
      )
      .to(
        "#password",
        {
          opacity: 0,
          duration: 0.1,
        },
        0
      );
  };

  const pwsError = () => {
    tl1.current = gsap
      .timeline()
      .to(
        "#heartLeft-signin",
        {
          x: "210%",
          y: "10%",
          duration: 2,
        },
        0
      )
      .to(
        "#heartRight-signin",
        {
          x: "-210%",
          duration: 2,
        },
        0
      )
      .to(
        "#password",
        {
          opacity: 0,
          duration: 1,
        },
        0
      );
  };
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialIsValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
    switch (id) {
      case "email":
        if (isValid) {
          emailSuccess();
          labelAnimation();
        } else {
          emailError();
          labelAnimation();
        }
        break;
      case "password":
        if (isValid) {
          pwsSuccess();
          labelAnimation();
        } else {
          pwsError();
          labelAnimation();
        }
        break;
      case "name":
        if (isValid) {
          nameSuccess();
          labelAnimation();
        } else {
          nameError();
          labelAnimation();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className={"form-control"}>
      <label ref={labelRef} htmlFor={props.id}>
        {props.label}
      </label>
      {id === "email" ? (
        <div className="name-input">
          <img
            id="leftwoman-signin"
            ref={leftWomanRef}
            src={isValid ? leftWoman : errorLeftWoman}
            alt=""
            className="leftwoman"
          />
          <input
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
            onChange={changeHandler}
            onBlur={touchHandler}
            on
            value={inputState.value}
          />
          <img
            id="rightman-signin"
            ref={rightManRef}
            src={isValid ? rightMan : errorRightMan}
            alt=""
            className="leftwoman"
          />
        </div>
      ) : id === "name" ? (
        <div className="name-input">
          <img
            id="male-signin"
            ref={maleRef}
            src={isValid ? male : errorMale}
            alt=""
            className="leftwoman"
          />
          <input
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
            onChange={changeHandler}
            onBlur={touchHandler}
            on
            value={inputState.value}
          />
          <img
            id="female-signin"
            ref={femaleRef}
            src={isValid ? female : errorFemale}
            alt=""
            className="leftwoman"
          />
        </div>
      ) : id === "password" ? (
        <div className="name-input">
          <img
            id="heartLeft-signin"
            ref={heartLeftRef}
            src={isValid ? hearLeft : errorHeartLeft}
            alt=""
            className="leftwoman"
          />
          <input
            id={props.id}
            type={props.type}
            placeholder={props.placeholder}
            onChange={changeHandler}
            onBlur={touchHandler}
            on
            value={inputState.value}
          />
          <img
            id="heartRight-signin"
            ref={heartRightRef}
            src={isValid ? heartRight : errorHeartRight}
            alt=""
            className="leftwoman"
          />{" "}
        </div>
      ) : (
        " "
      )}
    </div>
  );
};

export default Input;
