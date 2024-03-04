import React from "react"
import "./cssatrules.css"

export const Button = (props) => (
  <button {...props} className={["button", props.className].filter(Boolean).join(" ")} />
)
