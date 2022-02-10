/**@jsxImportSource @emotion/react */
import React from "react";
import { capitalize } from "lodash";
import Joi from "joi-browser";
import {
  Form as StyledForm,
  FormInput,
  WrapperDiv,
  InputGroup,
  Button,
  Spinner,
} from "./lib";
import { AlertBox } from "./Shared";
import { Link } from "react-router-dom";

const Form = ({
  structure,
  styling,
  meta,
  schema,
  footer,
  onSubmit,
  fieldPerPage,
  submitError,
  pending,
}) => {
  const [page, setPage] = React.useState(1);
  const [state, dispatch] = React.useReducer(formReducer, {
    data: {},
    errors: {},
  });

  function formReducer(state, action) {
    switch (action.type) {
      case "INPUT_TYPED":
        return { ...state, data: { ...state.data, [action.id]: action.value } };
      case "INPUT_ERROR":
        return {
          ...state,
          errors: { ...state.errors, [action.id]: action.value },
        };
      case "FINAL_VALIDATION":
        return {
          ...state,
          errors: action.value,
        };

      default:
        throw new Error(`Unsupported type: ${action?.type}`);
    }
  }

  function paginate(array, step, page) {
    return array.slice((page - 1) * step, page * step);
  }

  function validateProperty(input) {
    const { error } = Joi.validate(input.value, schema[input.name]);
    if (input.name === "confirm") {
      if (input.value === state.data?.password) {
        error.message = "";
      }
    }
    dispatch({ type: "INPUT_ERROR", value: error?.message, id: input.name });
  }

  function validate(data, schemaOverride) {
    const errors = {};
    const option = {
      abortEarly: false,
    };
    const { error } = Joi.validate(data, schemaOverride ?? schema, option);
    if (error) {
      for (let er of error.details) {
        errors[er.path[0]] = er.message;
      }
    }
    return Object.keys(errors).length === 0 ? null : errors;
  }

  function handleChange(event) {
    validateProperty(event.target);
    dispatch({
      type: "INPUT_TYPED",
      value: event.target.value,
      id: event.target.id,
    });
  }

  function renderInput(input) {
    return (
      <InputGroup key={input.name} css={{ margin: ".5rem 0", height: "5rem" }}>
        <WrapperDiv>
          <label htmlFor={input.name}>{input.icon ?? ""}</label>
          <FormInput
            onChange={handleChange}
            id={input.name}
            name={input.name}
            type={input.type ?? "text"}
            placeholder={capitalize(input.name)}
            value={state.data[input.name] || ""}
            {...input?.props}
          />
        </WrapperDiv>
        <AlertBox error={state.errors[input.name]} />
      </InputGroup>
    );
  }

  const dropdownStyles = {
    padding: ".5rem 2rem",
    color: "#333",
    outline: "none",
    borderRadius: ".5rem",
    background: "transparent",
    width: "15rem",
  };

  function renderDropdown(input) {
    return (
      <InputGroup key={input.name} css={{ margin: ".5rem 0", height: "5rem" }}>
        <WrapperDiv>
          <label htmlFor={input.name}>{input.icon ?? ""}</label>
          <select
            onChange={handleChange}
            css={dropdownStyles}
            name={input.name}
            id={input.name}
          >
            <option value="">Select Gender</option>
            {input.content.map(([value, label]) => (
              <option key={value} value={value}>
                {capitalize(label)}
              </option>
            ))}
          </select>
        </WrapperDiv>
        <AlertBox error={state.errors[input.name]} />
      </InputGroup>
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    const errors = validate(state.data);
    if (errors) {
      dispatch({ type: "FINAL_VALIDATION", value: errors });
    } else {
      onSubmit(state.data)
        .then((data) => data)
        .catch((err) => {
          dispatch({ type: "FINAL_VALIDATION", value: err });
          setPage(page - 1);
        });
    }
  }

  function handlePaginate() {
    const newSchema = {};
    const newData = {};
    paginate(structure, fieldPerPage, page).forEach((st) => {
      newSchema[st.name] = schema[st.name];
      newData[st.name] = state.data[st.name];
    });

    const errors = validate(newData, newSchema);
    if (errors) {
      dispatch({ type: "FINAL_VALIDATION", value: errors });
    } else {
      setPage(page + 1);
    }
  }

  //

  return (
    <StyledForm onSubmit={handleSubmit} css={styling}>
      <h3 css={{ color: "white" }}>
        {meta.title} {meta.icon}
      </h3>
      {paginate(structure, 3, page).map((st) => {
        return st.type === "dropdown" ? renderDropdown(st) : renderInput(st);
      })}
      <AlertBox error={submitError} />
      <div
        css={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {fieldPerPage ? (
          page === 1 ? (
            <Button type="button" onClick={handlePaginate}>
              Next
            </Button>
          ) : (
            <>
              <Button type="button" onClick={() => setPage(page - 1)}>
                Back
              </Button>
              {pending ? (
                <Spinner
                  size="24px"
                  css={{ margin: "1.2rem 0 0 .5rem", padding: ".1rem 0" }}
                />
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </>
          )
        ) : (
          <>
            {pending ? (
              <Spinner
                size="24px"
                css={{ margin: "1.2rem 0 0 .5rem", padding: ".1rem 0" }}
              />
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </>
        )}
      </div>
      <p css={{ fontSize: "0.8rem", color: "white" }}>
        {footer.caption}
        <Link
          css={{
            ":link": {
              color: "red",
            },
            ":visited": {
              color: "red",
            },
          }}
          to={`/${footer.to}`}
        >
          {" "}
          {capitalize(footer.to)}
        </Link>
      </p>
    </StyledForm>
  );
};

export default Form;
