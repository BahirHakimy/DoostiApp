import React from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { FaKey, FaUserLock } from "react-icons/fa";
import { axios } from "../../../services/client";
import { LoadingSpinner, Sbutton } from "../../lib";
import { PasswordField } from "../../Shared";
import { useUser } from "../../common/hooks";
import { toast } from "react-toastify";

function Account({ theme }) {
  const { username } = useUser();
  const [formState, setFormState] = React.useReducer(
    (s, a) => ({ ...s, ...a }),
    {
      isVisible: false,
      currentPassword: "",
      password1: "",
      password2: "",
      error: null,
      pending: false,
    }
  );

  const Button = ({ theme, ...rest }) => (
    <Sbutton
      background={theme === "light" ? "var(--cyan)" : "var(--primary)"}
      {...rest}
    />
  );

  const formStructure = [
    {
      name: "currentPassword",
      placeholder: "Current Password",
      autocmpl: "current-password",
    },
    {
      name: "password1",
      placeholder: "New Password",
      autocmpl: "new-password",
    },
    {
      name: "password2",
      placeholder: "Confirm Password",
      autocmpl: "new-password",
    },
  ];

  function handlePassChangeClick() {
    if (formState.isVisible) {
      setFormState({
        error: "Please close this form",
      });
    } else {
      setFormState({ isVisible: true });
    }
  }

  function handleCancelClick() {
    setFormState({ isVisible: false, error: null });
  }

  function handleInputChange(event) {
    setFormState({ [event.target.name]: event.target.value });
  }

  function checkForValidation() {
    let err = "";
    const { currentPassword, password1, password2 } = formState;
    if (currentPassword === "" || password1 === "" || password2 === "") {
      err = "All fields are required";
    }
    if (password1 !== password2) {
      err = "New passwords dont match";
    }
    return err ? err : null;
  }

  function handleSubmit(event) {
    const { currentPassword, password1 } = formState;
    event.preventDefault();
    const formError = checkForValidation();
    if (formError) {
      setFormState({ error: formError });
    } else {
      setFormState({ error: null, pending: true });
      axios
        .post("account/changePassword/", {
          username,
          currentPassword,
          newPassword: password1,
        })
        .then(
          ({ data }) => {
            toast.success(data.message);
            setFormState({ isVisible: false, error: null, pending: false });
          },
          ({ response }) => {
            setFormState({ error: response?.data?.message, pending: false });
          }
        );
    }
  }

  const { isVisible, error, pending } = formState;
  return (
    <div>
      <div className={`settings-header header-${theme}`}>
        <FaUserLock />
        Account
      </div>
      <div className={`settings-group group-${theme}`}>
        <div className="flex">
          <b className="setting-title">Password:</b>
          <p className="setting-caption">
            You can change your password if you need.
          </p>
        </div>
        <Button
          theme={theme}
          style={{ margin: "0 1rem" }}
          onClick={handlePassChangeClick}
        >
          <FaKey />
          ChangePassword
        </Button>
      </div>
      {isVisible && (
        <form
          id="passwordChangeForm"
          className={`form-${theme}`}
          onSubmit={handleSubmit}
        >
          <p id={`passFormCaption-${theme}`}>Change your password</p>
          {formStructure.map((st) => (
            <div key={st.name} className="settingInputGroup">
              <PasswordField
                name={st.name}
                autoComplete={st.autocmpl}
                className="passFormInput"
                onChange={handleInputChange}
                placeholder={st.placeholder}
              />
            </div>
          ))}
          <div id="passFormButtonGroup">
            {pending ? (
              <span id="spinnerContainer">
                <LoadingSpinner
                  color={theme === "light" ? "var(--dark)" : "var(--light)"}
                  size="25px"
                />
              </span>
            ) : (
              <Button theme={theme} type="submit">
                Change
              </Button>
            )}
            <Button theme={theme} onClick={handleCancelClick}>
              Cancel
            </Button>
          </div>
          <p id="passFormError" className={`error-${theme}`}>
            {error && (
              <>
                <AiOutlineWarning size="18px" />
                {error}
              </>
            )}
          </p>
        </form>
      )}
    </div>
  );
}
export default Account;
