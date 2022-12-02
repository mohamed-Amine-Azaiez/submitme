import "./Auth.css";
import { useState, useContext, useRef, useLayoutEffect } from "react";
import { useForm } from "../../shared/hooks/Form-Hook";
import { useHttpClient } from "../../shared/hooks/Http-Hook";
import { AuthContext } from "../../shared/context/auth-context";
import { gsap } from "gsap";
import leftWoman from "../../assets/img/left-woman.png";
import rightMan from "../../assets/img/right-man.png";

import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import LoadingSpinner from "../../shared/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/UIElement/ErrorModal";
import ImageUpload from "../../shared/fileUpload/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import Card from "../../shared/UIElement/Card";
import Container from "../../shared/UIElement/Container/Container";
import Art from "../../shared/UIElement/Art/Art";
const Auth = (props) => {

 
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  const switchModeHandler = (event) => {
    event.preventDefault();
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: "", isValid: false },
          image: { value: null, isValid: false },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        auth.login(responseData.id);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );
        auth.login(responseData.id);
      } catch (err) {}
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearErrorHandler} />
      <Container>
        <div className="art-container">
          <Art />
        </div>
        <div className="form-container">
          <div className="form">
            <div className="form-tabs">
              <span
                className="tab"
                inverse
                onClick={switchModeHandler}
                disabled={!isLoginMode}
              >
                Sign in
              </span>
              <span
                className="tab"
                inverse
                onClick={switchModeHandler}
                disabled={isLoginMode}
              >
                Sign up
              </span>
            </div>
            <Card className="authentication">
              {isLoading && <LoadingSpinner asOverlay />}
              <form onSubmit={authSubmitHandler}>
                {!isLoginMode && (
                  <div className="name-input">
                    <Input
                      id="name"
                      label="Name"
                      element="input"
                      validators={[VALIDATOR_REQUIRE()]}
                      onInput={inputHandler}
                    />
                  </div>
                )}
                <div className="name-input">
                  <Input
                    id="email"
                    label="Email"
                    element="input"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="please enter a valid email format"
                    onInput={inputHandler}
                  />
                </div>

                <Input
                  id="password"
                  element="input"
                  type="password"
                  label="Password"
                  validators={[VALIDATOR_MINLENGTH(8), VALIDATOR_MAXLENGTH(16)]}
                  errorText="this password is not valid"
                  onInput={inputHandler}
                />
                {!isLoginMode && (
                  <ImageUpload center id="image" onInput={inputHandler} />
                )}
                <Button>Confirme</Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Auth;
