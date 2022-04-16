import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

function AuthForm(props) {
  const { register, formState: { errors }, handleSubmit } = useForm({criteriaMode: "all"});
  const onSubmit = data => {
    axios({
      method: 'POST',
      url: 'http://localhost:3001/api/v1/' + props.url,
      data
    }).then(response => {
      localStorage.setItem(
        'user',
        JSON.stringify({
          'access-token': response.headers['access-token'],
          'client': response.headers['client'],
          'uid': response.data.data.uid
        })
      )
      window.location = '/';
    })
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>{props.title}</h1>
      <input {...register(
        "email",
        {
          required: true
        }
        )} required type="email"/>

      <input {...register(
        "password", {
          required: "Required",
          minLength: { value: 5, message: "Min Length is 5" },
          maxLength: { value: 20, message: "Max Length is 20" }
        })}
      type="password"/>
      <ErrorMessage
        errors={errors}
        name="password"
        render={({ messages }) =>
          messages &&
          Object.entries(messages).map(([type, message]) => (
            <p key={type}>{message}</p>
          ))
        }
      />

      <input type="submit" />
    </form>
  );
}

export default AuthForm
