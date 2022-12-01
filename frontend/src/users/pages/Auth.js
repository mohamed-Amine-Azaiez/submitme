import "./Auth.css";
import { useState, useContext } from "react";
import { useFormHook } from "../../shared/hooks/Form-Hook";
import { useHttpClient } from "../../shared/hooks/Http-Hook";
import { AuthContext } from "../../shared/context/auth-context";

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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { isLoading, error, sendRequest, clearErrorHandler } = useHttpClient();
  const [formState, inputHandler, loadData] = useFormHook(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  const switchModeHandler = (event) => {
    event.preventDefault();
    if (!isLoggedIn) {
      loadData(
        {
          ...formState,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid,
        formState.inputs.password.isValid
      );
    } else {
      loadData(
        {
          ...formState.inputs,
          name: { value: "", isValid: false },
          image: { value: null, isValid: false },
        },
        false
      );
    }
    setIsLoggedIn((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    if (isLoggedIn) {
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
          <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay />}
            <h2 className="authenticaton__header">Authentication Required</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
              {!isLoggedIn && (
                <Input
                  id="name"
                  label="Name"
                  element="input"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="please enter a valid name format"
                  onInput={inputHandler}
                />
              )}
              <Input
                id="email"
                label="Email"
                element="input"
                validators={[VALIDATOR_EMAIL()]}
                errorText="please enter a valid email format"
                onInput={inputHandler}
              />
              <Input
                id="password"
                element="input"
                type="password"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(8), VALIDATOR_MAXLENGTH(16)]}
                errorText="this password is not valid"
                onInput={inputHandler}
              />
              {!isLoggedIn && (
                <ImageUpload center id="image" onInput={inputHandler} />
              )}
              <Button disabled={!formState.isValid}>
                {isLoggedIn ? "LOGIN" : "SIGNUP"}
              </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>
              {isLoggedIn ? "SIGNUP" : "LOGIN"}
            </Button>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default Auth;
